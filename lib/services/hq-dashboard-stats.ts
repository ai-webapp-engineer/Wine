import { db } from "@/lib/db";
import { formatDayKey, last7DayKeys } from "@/components/charts/chart-primitives";
import { ORDER_STATUS_LABELS } from "@/lib/services/table-queries";

function formatDayKeyLocal(date: Date): string {
  return date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

function last7DayKeysLocal(): string[] {
  const keys: string[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    keys.push(formatDayKeyLocal(d));
  }
  return keys;
}

export async function getHqDashboardChartData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [locations, orderGroups, movements, inventories, recentOrders, allInventory] =
    await Promise.all([
      db.location.findMany({
        where: { isActive: true, type: { in: ["STORE", "WAREHOUSE"] } },
        select: {
          name: true,
          inventories: {
            select: { quantity: true, product: { select: { minStock: true } } },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.order.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.stockMovement.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
          type: { in: ["INBOUND", "OUTBOUND", "POS_SALE"] },
        },
        select: { type: true, quantity: true, createdAt: true },
      }),
      db.inventory.findMany({
        select: { quantity: true, product: { select: { category: true } } },
      }),
      db.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, fromLocation: { select: { name: true } } },
      }),
      db.inventory.findMany({
        where: { product: { isActive: true } },
        select: { quantity: true, product: { select: { minStock: true } } },
      }),
    ]);

  const inventoryByLocation = locations.map((location) => ({
    name: location.name,
    quantity: location.inventories.reduce((sum, item) => sum + item.quantity, 0),
  }));

  const lowStockByLocation = locations
    .map((location) => ({
      name: location.name,
      count: location.inventories.filter((item) => item.quantity <= item.product.minStock).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const ordersByStatus = orderGroups
    .map((group) => ({
      status: ORDER_STATUS_LABELS[group.status] ?? group.status,
      count: group._count._all,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const dayKeys = last7DayKeysLocal();
  const movementTrend = dayKeys.map((day) => ({
    day,
    入庫: 0,
    出庫: 0,
    POS販売: 0,
  }));

  for (const movement of movements) {
    const key = formatDayKeyLocal(movement.createdAt);
    const row = movementTrend.find((item) => item.day === key);
    if (!row) continue;
    if (movement.type === "INBOUND") row.入庫 += movement.quantity;
    else if (movement.type === "OUTBOUND") row.出庫 += movement.quantity;
    else if (movement.type === "POS_SALE") row.POS販売 += movement.quantity;
  }

  const orderTrend = dayKeys.map((day) => ({ day, 発注: 0 }));
  for (const order of recentOrders) {
    const key = formatDayKeyLocal(order.createdAt);
    const row = orderTrend.find((item) => item.day === key);
    if (row) row.発注 += 1;
  }

  const storeOrderVolume = Object.entries(
    recentOrders.reduce<Record<string, number>>((acc, order) => {
      const name = order.fromLocation.name;
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([store, count]) => ({ store, count }))
    .sort((a, b) => b.count - a.count);

  const categoryTotals = new Map<string, number>();
  for (const item of inventories) {
    const category = item.product.category ?? "その他";
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + item.quantity);
  }
  const inventoryByCategory = [...categoryTotals.entries()]
    .map(([category, quantity]) => ({ category, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  const totalSkus = allInventory.length;
  const lowStockSkus = allInventory.filter((i) => i.quantity <= i.product.minStock).length;
  const stockHealthRate = totalSkus > 0 ? Math.round(((totalSkus - lowStockSkus) / totalSkus) * 100) : 100;

  return {
    inventoryByLocation,
    lowStockByLocation,
    ordersByStatus,
    movementTrend,
    orderTrend,
    storeOrderVolume,
    inventoryByCategory,
    stockHealthRate,
    lowStockSkus,
  };
}
