import { ROLE_LABELS } from "@/lib/auth/rbac";
import type { SessionUser } from "@/lib/auth/types";
import { APP_HEADER_CLASS, APP_HEADER_INNER_CLASS } from "@/lib/layout";
import { Button } from "@/components/ui/button";

export { BottomNav, SidebarNav } from "@/components/layout/sidebar-nav";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className={APP_HEADER_CLASS}>
      <div className={APP_HEADER_INNER_CLASS}>
        <div>
          <p className="text-sm font-semibold text-wine-800">ワイン管理システム</p>
          <p className="text-xs text-stone-500">{ROLE_LABELS[user.role]}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-stone-600 sm:inline">{user.name}</span>
          <form action="/api/logout" method="POST">
            <Button type="submit" variant="outline" size="sm">
              ログアウト
            </Button>
          </form>
        </div>
      </div>
    </header>
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
