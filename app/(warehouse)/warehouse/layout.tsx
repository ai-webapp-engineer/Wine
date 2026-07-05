import { AppHeader, BottomNav, PageShell, SidebarNav } from "@/components/layout/app-shell";
import { requireRoleLayout } from "@/lib/auth/layout-guard";
import { APP_MAIN_CLASS, APP_SCREEN_CLASS, APP_SHELL_CLASS } from "@/lib/layout";

const navItems = [
  { href: "/warehouse", label: "ホーム", icon: "home" as const },
  { href: "/warehouse/inbound", label: "入庫", icon: "inbound" as const },
  { href: "/warehouse/picking", label: "ピッキング", icon: "picking" as const },
  { href: "/warehouse/inventory", label: "在庫", icon: "inventory" as const },
];

export default async function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRoleLayout("/warehouse");

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

export { PageShell };
