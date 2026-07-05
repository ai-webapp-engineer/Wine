import { redirect } from "next/navigation";

import { AppHeader, PageShell, SidebarNav } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/hq", label: "ダッシュボード" },
  { href: "/hq/products", label: "商品マスタ" },
  { href: "/hq/locations", label: "拠点マスタ" },
  { href: "/hq/inventory", label: "全拠点在庫" },
  { href: "/hq/orders", label: "発注管理" },
  { href: "/hq/users", label: "ユーザー管理" },
];

export default async function HqLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader user={session.user} />
      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-7xl">
        <SidebarNav items={navItems} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export { PageShell };
