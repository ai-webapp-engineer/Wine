"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildTableHref, PAGE_SIZE } from "@/lib/pagination";

export type FilterOption = {
  value: string;
  label: string;
};

type DataTableToolbarProps = {
  basePath: string;
  q?: string;
  filter?: string;
  pageSize?: number;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  searchPlaceholder?: string;
};

export function DataTableToolbar({
  basePath,
  q = "",
  filter = "",
  pageSize = PAGE_SIZE,
  filterOptions,
  filterLabel = "絞り込み",
  searchPlaceholder = "キーワード検索",
}: DataTableToolbarProps) {
  const hasFilters = Boolean(q || filter);

  return (
    <form
      action={basePath}
      method="get"
      className="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row sm:items-end"
    >
      {pageSize !== PAGE_SIZE ? <input type="hidden" name="limit" value={pageSize} /> : null}
      <div className="flex-1">
        <label htmlFor="table-search" className="mb-1 block text-xs font-medium text-stone-600">
          検索
        </label>
        <Input
          id="table-search"
          name="q"
          defaultValue={q}
          placeholder={searchPlaceholder}
        />
      </div>

      {filterOptions && filterOptions.length > 0 ? (
        <div className="sm:w-48">
          <label htmlFor="table-filter" className="mb-1 block text-xs font-medium text-stone-600">
            {filterLabel}
          </label>
          <select
            id="table-filter"
            name="filter"
            defaultValue={filter}
            className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm"
          >
            <option value="">すべて</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          適用
        </Button>
        {hasFilters ? (
          <Link
            href={buildTableHref(basePath, { limit: pageSize !== PAGE_SIZE ? pageSize : undefined })}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            クリア
          </Link>
        ) : null}
      </div>
    </form>
  );
}
