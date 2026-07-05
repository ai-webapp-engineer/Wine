import { AppHeader, PageShell, SidebarNav } from "@/components/layout/app-shell";
import { requireRoleLayout } from "@/lib/auth/layout-guard";
import { APP_MAIN_CLASS, APP_SCREEN_CLASS, APP_SHELL_CLASS } from "@/lib/layout";

const navItems = [
  { href: "/hq", label: "ダッシュボード", icon: "dashboard" as const },
  { href: "/hq/products", label: "商品マスタ", icon: "products" as const },
  { href: "/hq/locations", label: "拠点マスタ", icon: "locations" as const },
  { href: "/hq/inventory", label: "全拠点在庫", icon: "allInventory" as const },
  { href: "/hq/orders", label: "発注管理", icon: "orders" as const },
  { href: "/hq/users", label: "ユーザー管理", icon: "users" as const },
];

export default async function HqLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRoleLayout("/hq");

  return (
    <div className={APP_SCREEN_CLASS}>
      <AppHeader user={user} />
      <div className={APP_SHELL_CLASS}>
        <SidebarNav items={navItems} />
        <main className={APP_MAIN_CLASS}>{children}</main>
      </div>
    </div>
  );
}

export { PageShell };
