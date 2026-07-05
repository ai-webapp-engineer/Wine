import { db } from "@/lib/db";
import { formatDayKey, last7DayKeys } from "@/components/charts/chart-primitives";
import { ORDER_STATUS_LABELS } from "@/lib/services/table-queries";

export async function getStoreDashboardChartData(locationId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [movements, orders, inventories] = await Promise.all([
    db.stockMovement.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        OR: [{ fromLocationId: locationId }, { toLocationId: locationId }],
        type: { in: ["POS_SALE", "INBOUND", "OUTBOUND"] },
      },
      select: { type: true, quantity: true, createdAt: true, fromLocationId: true, toLocationId: true },
    }),
    db.order.findMany({
      where: { fromLocationId: locationId },
      select: { status: true, createdAt: true },
    }),
    db.inventory.findMany({
      where: { locationId, product: { isActive: true } },
      select: {
        quantity: true,
        product: { select: { name: true, category: true, minStock: true } },
      },
    }),
  ]);

  const salesTrend = last7DayKeys().map((day) => ({ day, POS販売: 0, 入荷: 0 }));
  for (const movement of movements) {
    const key = formatDayKey(movement.createdAt);
    const row = salesTrend.find((item) => item.day === key);
    if (!row) continue;
    if (movement.type === "POS_SALE" && movement.fromLocationId === locationId) {
      row.POS販売 += movement.quantity;
    }
    if (movement.type === "INBOUND" && movement.toLocationId === locationId) {
      row.入荷 += movement.quantity;
    }
  }

  const ordersByStatus = Object.entries(
    orders.reduce<Record<string, number>>((acc, order) => {
      const label = ORDER_STATUS_LABELS[order.status];
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([status, count]) => ({ status, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const orderTrend = last7DayKeys().map((day) => ({ day, 発注: 0 }));
  for (const order of orders) {
    const key = formatDayKey(order.createdAt);
    const row = orderTrend.find((item) => item.day === key);
    if (row) row.発注 += 1;
  }

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
      gap: item.product.minStock - item.quantity,
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);

  const pendingReceiving = orders.filter((o) => o.status === "SHIPPED").length;
  const openOrders = orders.filter((o) =>
    ["SUBMITTED", "PICKING", "SHIPPED"].includes(o.status),
  ).length;

  return {
    salesTrend,
    ordersByStatus,
    orderTrend,
    inventoryByCategory,
    lowStockItems,
    pendingReceiving,
    openOrders,
  };
}
