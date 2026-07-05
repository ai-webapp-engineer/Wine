"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_SIDEBAR_CLASS } from "@/lib/layout";
import { getNavIcon, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (pathname.startsWith(`${href}/`)) {
    const rootPaths = ["/store", "/warehouse", "/hq"];
    if (rootPaths.includes(href)) return false;
    return true;
  }
  return false;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className={APP_SIDEBAR_CLASS}>
      <div className="sticky top-[57px] p-4">
        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
          メニュー
        </p>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = getNavIcon(item.icon);
            const isActive = isNavActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full max-w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-wine-50 text-wine-800 shadow-sm ring-1 ring-wine-200"
                    : "text-stone-600 hover:bg-stone-100 hover:text-wine-800",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-wine-100 text-wine-700"
                      : "bg-stone-100 text-stone-500 group-hover:bg-wine-50 group-hover:text-wine-700",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const Icon = getNavIcon(item.icon);
          const isActive = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-wine-800" : "text-stone-500 active:text-wine-700",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-wine-700")} strokeWidth={2} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
