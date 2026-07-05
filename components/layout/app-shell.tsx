import Link from "next/link";
import { signOut } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import type { SessionUser } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:px-6">
      <div>
        <p className="text-sm font-semibold text-wine-800">Wine Management</p>
        <p className="text-xs text-stone-500">{ROLE_LABELS[user.role]}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-stone-600 sm:inline">{user.name}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="outline" size="sm">
            ログアウト
          </Button>
        </form>
      </div>
    </header>
  );
}

type NavItem = { href: string; label: string };

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-stone-200 bg-stone-50 p-4 md:block">
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-white hover:text-wine-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 flex-col items-center justify-center px-1 text-xs font-medium text-stone-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
