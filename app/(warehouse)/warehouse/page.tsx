import { PageShell } from "@/app/(warehouse)/warehouse/layout";
import { WarehouseDashboardCharts } from "@/components/warehouse/dashboard-charts";
import { Card, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getWarehouseDashboardChartData } from "@/lib/services/warehouse-dashboard-stats";

export default async function WarehouseDashboardPage() {
  const user = await requireSessionUser();
  const locationId = user.locationId!;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [skuCount, chartData] = await Promise.all([
    db.inventory.count({ where: { locationId } }),
    getWarehouseDashboardChartData(locationId),
  ]);

  return (
    <PageShell title="倉庫ダッシュボード" description="入出庫とピッキング">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardTitle>在庫SKU</CardTitle>
          <p className="mt-2 text-3xl font-bold">{skuCount}</p>
        </Card>
        <Card>
          <CardTitle>未処理発注</CardTitle>
          <p className="mt-2 text-3xl font-bold">{chartData.pendingOrderCount}</p>
        </Card>
        <Card>
          <CardTitle>本日入庫</CardTitle>
          <p className="mt-2 text-3xl font-bold text-green-700">{chartData.todayInbound}</p>
        </Card>
        <Card>
          <CardTitle>本日出庫</CardTitle>
          <p className="mt-2 text-3xl font-bold text-wine-800">{chartData.todayOutbound}</p>
        </Card>
        <Card>
          <CardTitle>要補充SKU</CardTitle>
          <p className="mt-2 text-3xl font-bold text-amber-700">{chartData.lowStockItems.length}</p>
        </Card>
      </div>

      <WarehouseDashboardCharts data={chartData} />
    </PageShell>
  );
}
