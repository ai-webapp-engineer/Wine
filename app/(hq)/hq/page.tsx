import { PageShell } from "@/app/(hq)/hq/layout";
import { HqDashboardCharts } from "@/components/hq/dashboard-charts";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getHqDashboardChartData } from "@/lib/services/hq-dashboard-stats";

export default async function HqDashboardPage() {
  const [productCount, locationCount, openOrders, totalInventory, chartData] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.location.count({ where: { isActive: true } }),
    db.order.count({ where: { status: { in: ["SUBMITTED", "PICKING", "SHIPPED"] } } }),
    db.inventory.aggregate({ _sum: { quantity: true } }),
    getHqDashboardChartData(),
  ]);

  return (
    <PageShell title="本部ダッシュボード" description="全社KPIサマリ">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardTitle>商品数</CardTitle>
          <p className="mt-2 text-3xl font-bold">{productCount}</p>
        </Card>
        <Card>
          <CardTitle>拠点数</CardTitle>
          <p className="mt-2 text-3xl font-bold">{locationCount}</p>
        </Card>
        <Card>
          <CardTitle>進行中発注</CardTitle>
          <p className="mt-2 text-3xl font-bold">{openOrders}</p>
        </Card>
        <Card>
          <CardTitle>総在庫数</CardTitle>
          <p className="mt-2 text-3xl font-bold">{totalInventory._sum.quantity ?? 0}</p>
        </Card>
        <Card>
          <CardTitle>在庫健全率</CardTitle>
          <p className="mt-2 text-3xl font-bold text-green-700">{chartData.stockHealthRate}%</p>
        </Card>
        <Card>
          <CardTitle>低在庫SKU</CardTitle>
          <p className="mt-2 text-3xl font-bold text-amber-700">{chartData.lowStockSkus}</p>
        </Card>
      </div>

      <HqDashboardCharts data={chartData} />
    </PageShell>
  );
}
