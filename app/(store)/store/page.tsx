import {
  LowStockList,
  PageShell,
  StoreDashboardStats,
} from "@/app/(store)/store/layout";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function StoreDashboardPage() {
  const session = await auth();
  const locationId = session!.user.locationId!;

  const lowStock = await db.inventory.findMany({
    where: {
      locationId,
      product: { isActive: true },
    },
    include: { product: true },
    take: 20,
  });

  const alerts = lowStock.filter((item) => item.quantity <= item.product.minStock);

  return (
    <PageShell title="店舗ダッシュボード" description="自店舗の在庫と発注状況">
      <StoreDashboardStats locationId={locationId} />
      <LowStockList items={alerts.slice(0, 8)} />
    </PageShell>
  );
}
