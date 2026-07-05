import { redirect } from "next/navigation";

import { AppHeader, BottomNav, PageShell, SidebarNav } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/warehouse", label: "ホーム" },
  { href: "/warehouse/inbound", label: "入庫" },
  { href: "/warehouse/picking", label: "ピッキング" },
  { href: "/warehouse/inventory", label: "在庫" },
];

export default async function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader user={session.user} />
      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-7xl">
        <SidebarNav items={navItems} />
        <main className="flex-1 p-4 pb-24 md:p-6">{children}</main>
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}

export { PageShell };
