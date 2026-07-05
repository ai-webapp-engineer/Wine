import { PageShell } from "@/app/(warehouse)/warehouse/layout";
import { Card, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function WarehouseDashboardPage() {
  const locationId = (await auth())!.user.locationId!;

  const [skuCount, pendingOrders, todayMovements] = await Promise.all([
    db.inventory.count({ where: { locationId } }),
    db.order.count({
      where: { toLocationId: locationId, status: { in: ["SUBMITTED", "PICKING"] } },
    }),
    db.stockMovement.count({
      where: {
        OR: [{ toLocationId: locationId }, { fromLocationId: locationId }],
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  return (
    <PageShell title="倉庫ダッシュボード" description="入出庫とピッキング">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardTitle>在庫SKU</CardTitle>
          <p className="mt-2 text-3xl font-bold">{skuCount}</p>
        </Card>
        <Card>
          <CardTitle>未処理発注</CardTitle>
          <p className="mt-2 text-3xl font-bold">{pendingOrders}</p>
        </Card>
        <Card>
          <CardTitle>本日の入出庫</CardTitle>
          <p className="mt-2 text-3xl font-bold">{todayMovements}</p>
        </Card>
      </div>
    </PageShell>
  );
}
