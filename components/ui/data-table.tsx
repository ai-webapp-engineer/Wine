import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar, type FilterOption } from "@/components/ui/data-table-toolbar";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  basePath: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  q?: string;
  filter?: string;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

export function DataTable<T>({
  basePath,
  columns,
  rows,
  rowKey,
  page,
  totalPages,
  total,
  pageSize,
  q = "",
  filter = "",
  filterOptions,
  filterLabel,
  searchPlaceholder,
  emptyMessage = "データがありません",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <DataTableToolbar
        basePath={basePath}
        q={q}
        filter={filter}
        pageSize={pageSize}
        filterOptions={filterOptions}
        filterLabel={filterLabel}
        searchPlaceholder={searchPlaceholder}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn("px-4 py-3 font-medium", column.headerClassName)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-stone-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="border-t border-stone-100 hover:bg-stone-50/50">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 py-3", column.className)}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        basePath={basePath}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        q={q}
        filter={filter}
      />
    </div>
  );
}
