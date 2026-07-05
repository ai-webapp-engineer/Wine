"use client";

import { usePathname } from "next/navigation";

import { StatsGridSkeleton, ChartGridSkeleton } from "@/components/loading/page-skeletons";
import { ContentPageLoading, TablePageLoading } from "@/components/loading/table-loading";
import { PageShell } from "@/components/layout/app-shell";
import { getPageMeta } from "@/lib/loading/page-meta";

export function RouteLoading() {
  const pathname = usePathname();
  const meta = getPageMeta(pathname);

  if (meta.kind === "dashboard") {
    return (
      <PageShell title={meta.title} description={meta.description}>
        <StatsGridSkeleton count={meta.statCount} />
        <ChartGridSkeleton />
      </PageShell>
    );
  }

  if (meta.kind === "table") {
    return (
      <TablePageLoading
        title={meta.title}
        description={meta.description}
        basePath={meta.basePath}
        columns={meta.columns}
        searchPlaceholder={meta.searchPlaceholder}
        filterLabel={meta.filterLabel}
        filterOptions={meta.filterOptions}
      />
    );
  }

  return <ContentPageLoading title={meta.title} description={meta.description} />;
}
