import { PageShell, StoreDashboardStats } from "@/app/(store)/store/layout";
import { StoreDashboardCharts } from "@/components/store/dashboard-charts";
import { requireSessionUser } from "@/lib/auth/session";
import { getStoreDashboardChartData } from "@/lib/services/store-dashboard-stats";

export default async function StoreDashboardPage() {
  const user = await requireSessionUser();
  const locationId = user.locationId!;
  const chartData = await getStoreDashboardChartData(locationId);

  return (
    <PageShell title="店舗ダッシュボード" description="自店舗の在庫と発注状況">
      <StoreDashboardStats locationId={locationId} />
      <StoreDashboardCharts data={chartData} />
    </PageShell>
  );
}
