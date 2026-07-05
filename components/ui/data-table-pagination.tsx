"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { buildTableHref, PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type DataTablePaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  q?: string;
  filter?: string;
  disabled?: boolean;
};

const linkClass =
  "inline-flex h-8 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium transition hover:bg-stone-50";

export function DataTablePagination({
  basePath,
  page,
  totalPages,
  total,
  pageSize,
  q = "",
  filter = "",
  disabled = false,
}: DataTablePaginationProps) {
  const router = useRouter();
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const hrefParams = { q, filter, limit: pageSize };

  function handlePageSizeChange(nextPageSize: number) {
    router.push(
      buildTableHref(basePath, {
        ...hrefParams,
        limit: nextPageSize,
        page: 1,
      }),
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-stone-100 px-4 py-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {!disabled ? (
          <p>
            全 {total} 件 · {from}–{to} 件目
          </p>
        ) : null}
        <label className="flex items-center gap-2">
          <span className="text-stone-500">表示件数</span>
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(event) => handlePageSizeChange(Number(event.target.value))}
            className="h-8 rounded-lg border border-stone-300 bg-white px-2 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        {disabled || page <= 1 ? (
          <span className={cn(linkClass, "opacity-50")}>前へ</span>
        ) : (
          <Link
            href={buildTableHref(basePath, { ...hrefParams, page: prevPage })}
            className={linkClass}
          >
            前へ
          </Link>
        )}
        <span className="min-w-20 text-center text-stone-600">
          {page} / {totalPages} ページ
        </span>
        {disabled || page >= totalPages ? (
          <span className={cn(linkClass, "opacity-50")}>次へ</span>
        ) : (
          <Link
            href={buildTableHref(basePath, { ...hrefParams, page: nextPage })}
            className={linkClass}
          >
            次へ
          </Link>
        )}
      </div>
    </div>
  );
}

export function getDefaultTablePaginationProps(basePath: string) {
  return {
    basePath,
    page: 1,
    totalPages: 1,
    total: 0,
    pageSize: PAGE_SIZE,
    disabled: true,
  };
}
