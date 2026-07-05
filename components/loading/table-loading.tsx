import { PageShell } from "@/components/layout/app-shell";
import { getDefaultTablePaginationProps, DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar, type FilterOption } from "@/components/ui/data-table-toolbar";
import { LoadingCenter } from "@/components/ui/spinner";

type TableDataLoadingProps = {
  basePath: string;
  columns: string[];
  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions?: FilterOption[];
};

export function TableDataLoading({
  basePath,
  columns,
  searchPlaceholder,
  filterLabel,
  filterOptions,
}: TableDataLoadingProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <DataTableToolbar
        basePath={basePath}
        searchPlaceholder={searchPlaceholder}
        filterLabel={filterLabel}
        filterOptions={filterOptions}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              {columns.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length}>
                <LoadingCenter label="データを読み込み中..." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DataTablePagination {...getDefaultTablePaginationProps(basePath)} />
    </div>
  );
}

export function TablePageLoading({
  title,
  description,
  basePath,
  columns,
  searchPlaceholder,
  filterLabel,
  filterOptions,
}: TableDataLoadingProps & {
  title: string;
  description?: string;
}) {
  return (
    <PageShell title={title} description={description}>
      <TableDataLoading
        basePath={basePath}
        columns={columns}
        searchPlaceholder={searchPlaceholder}
        filterLabel={filterLabel}
        filterOptions={filterOptions}
      />
    </PageShell>
  );
}

export function ContentPageLoading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <PageShell title={title} description={description}>
      <LoadingCenter label="読み込み中..." />
    </PageShell>
  );
}
