import { db } from "@/lib/db";
import {
  emptyMovementTrend,
  formatDayKey,
  last7DayKeys,
} from "@/components/charts/chart-primitives";
import { ORDER_STATUS_LABELS } from "@/lib/services/table-queries";

export async function getWarehouseDashboardChartData(locationId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [movements, pendingOrders, shippedOrders, inventories, todayMovements] =
    await Promise.all([
      db.stockMovement.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
          type: { in: ["INBOUND", "OUTBOUND"] },
          OR: [{ toLocationId: locationId }, { fromLocationId: locationId }],
        },
        select: {
          type: true,
          quantity: true,
          createdAt: true,
          toLocationId: true,
          fromLocationId: true,
        },
      }),
      db.order.findMany({
        where: {
          toLocationId: locationId,
          status: { in: ["SUBMITTED", "PICKING"] },
        },
        select: {
          status: true,
          fromLocation: { select: { name: true } },
          items: { select: { quantity: true } },
        },
      }),
      db.order.findMany({
        where: {
          toLocationId: locationId,
          status: "SHIPPED",
          updatedAt: { gte: sevenDaysAgo },
        },
        select: { updatedAt: true },
      }),
      db.inventory.findMany({
        where: { locationId, product: { isActive: true } },
        select: {
          quantity: true,
          product: {
            select: { name: true, category: true, minStock: true },
          },
        },
      }),
      db.stockMovement.groupBy({
        by: ["type"],
        where: {
          createdAt: { gte: todayStart },
          OR: [{ toLocationId: locationId }, { fromLocationId: locationId }],
          type: { in: ["INBOUND", "OUTBOUND"] },
        },
        _sum: { quantity: true },
      }),
    ]);

  const movementTrend = emptyMovementTrend();
  for (const movement of movements) {
    const key = formatDayKey(movement.createdAt);
    const row = movementTrend.find((item) => item.day === key);
    if (!row) continue;
    if (movement.type === "INBOUND" && movement.toLocationId === locationId) {
      row.入庫 += movement.quantity;
    }
    if (movement.type === "OUTBOUND" && movement.fromLocationId === locationId) {
      row.出庫 += movement.quantity;
    }
  }

  const shippedTrend = last7DayKeys().map((day) => ({ day, 出荷: 0 }));
  for (const order of shippedOrders) {
    const key = formatDayKey(order.updatedAt);
    const row = shippedTrend.find((item) => item.day === key);
    if (row) row.出荷 += 1;
  }

  const storeTotals = new Map<string, number>();
  for (const order of pendingOrders) {
    const storeName = order.fromLocation.name;
    const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
    storeTotals.set(storeName, (storeTotals.get(storeName) ?? 0) + units);
  }
  const pendingByStore = [...storeTotals.entries()]
    .map(([store, units]) => ({ store, units }))
    .sort((a, b) => b.units - a.units);

  const orderQueue = Object.entries(
    pendingOrders.reduce<Record<string, number>>((acc, order) => {
      const label = ORDER_STATUS_LABELS[order.status] ?? order.status;
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([status, count]) => ({ status, count }))
    .filter((item) => item.count > 0);

  const categoryTotals = new Map<string, number>();
  for (const item of inventories) {
    const category = item.product.category ?? "その他";
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + item.quantity);
  }
  const inventoryByCategory = [...categoryTotals.entries()]
    .map(([category, quantity]) => ({ category, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  const lowStockItems = inventories
    .filter((item) => item.quantity <= item.product.minStock)
    .map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      minStock: item.product.minStock,
    }))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 8);

  const todayInbound =
    todayMovements.find((m) => m.type === "INBOUND")?._sum.quantity ?? 0;
  const todayOutbound =
    todayMovements.find((m) => m.type === "OUTBOUND")?._sum.quantity ?? 0;

  return {
    movementTrend,
    shippedTrend,
    pendingByStore,
    orderQueue,
    inventoryByCategory,
    lowStockItems,
    todayInbound,
    todayOutbound,
    pendingOrderCount: pendingOrders.length,
  };
}
