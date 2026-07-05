export const PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type TableSearchParams = {
  page?: string;
  q?: string;
  filter?: string;
  limit?: string;
};

export type TableQueryInput = {
  page: number;
  q: string;
  filter: string;
  pageSize: number;
};

export function parsePageParam(value: string | string[] | undefined, fallback = 1): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
}

export function parseQueryParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export function parsePageSizeParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  if (!PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])) {
    return PAGE_SIZE;
  }
  return parsed;
}

export function parseTableParams(searchParams: TableSearchParams): TableQueryInput {
  return {
    page: parsePageParam(searchParams.page),
    q: parseQueryParam(searchParams.q),
    filter: parseQueryParam(searchParams.filter),
    pageSize: parsePageSizeParam(searchParams.limit),
  };
}

export function getPaginationMeta(total: number, page: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * pageSize;

  return { totalPages, currentPage, skip, take: pageSize };
}

export function buildTableHref(
  basePath: string,
  params: { page?: number; q?: string; filter?: string; limit?: number },
): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.filter) search.set("filter", params.filter);
  if (params.limit && params.limit !== PAGE_SIZE) search.set("limit", String(params.limit));
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** @deprecated use PAGE_SIZE */
export const INVENTORY_PAGE_SIZE = PAGE_SIZE;
