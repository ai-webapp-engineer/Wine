import { AppHeader, BottomNav, PageShell, SidebarNav } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRoleLayout } from "@/lib/auth/layout-guard";
import { APP_MAIN_CLASS, APP_SCREEN_CLASS, APP_SHELL_CLASS } from "@/lib/layout";
import { db } from "@/lib/db";

const navItems = [
  { href: "/store", label: "ダッシュボード", icon: "dashboard" as const },
  { href: "/store/inventory", label: "在庫", icon: "inventory" as const },
  { href: "/store/orders", label: "発注", icon: "orders" as const },
  { href: "/store/receiving", label: "入荷", icon: "receiving" as const },
];

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRoleLayout("/store");

  return (
    <div className={APP_SCREEN_CLASS}>
      <AppHeader user={user} />
      <div className={APP_SHELL_CLASS}>
        <SidebarNav items={navItems} />
        <main className={APP_MAIN_CLASS}>{children}</main>
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}

export async function StoreDashboardStats({ locationId }: { locationId: string }) {
  const [inventoryCount, lowStockCount, openOrders] = await Promise.all([
    db.inventory.count({ where: { locationId } }),
    db.inventory.count({
      where: {
        locationId,
        product: { isActive: true },
        quantity: { lte: 5 },
      },
    }),
    db.order.count({
      where: {
        fromLocationId: locationId,
        status: { in: ["SUBMITTED", "PICKING", "SHIPPED"] },
      },
    }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardTitle>在庫SKU数</CardTitle>
        <p className="mt-2 text-3xl font-bold">{inventoryCount}</p>
      </Card>
      <Card>
        <CardTitle>低在庫</CardTitle>
        <p className="mt-2 text-3xl font-bold text-amber-700">{lowStockCount}</p>
      </Card>
      <Card>
        <CardTitle>進行中発注</CardTitle>
        <p className="mt-2 text-3xl font-bold">{openOrders}</p>
      </Card>
    </div>
  );
}

export function LowStockList({
  items,
}: {
  items: Array<{ id: string; quantity: number; product: { name: string; minStock: number } }>;
}) {
  return (
    <Card>
      <CardTitle>低在庫アラート</CardTitle>
      <ul className="mt-4 space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-stone-500">低在庫商品はありません</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.product.name}</span>
              <Badge variant="warning">
                {item.quantity} / 最低 {item.product.minStock}
              </Badge>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}

export { PageShell };
