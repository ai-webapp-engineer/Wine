import { PageShell } from "@/app/(hq)/hq/layout";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { parseTableParams, type TableSearchParams } from "@/lib/pagination";
import { fetchOrdersTable, ORDER_STATUS_LABELS } from "@/lib/services/table-queries";
import { formatDate } from "@/lib/utils";

type Props = {
  searchParams: Promise<TableSearchParams>;
};

const STATUS_FILTER_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default async function HqOrdersPage({ searchParams }: Props) {
  const params = parseTableParams(await searchParams);
  const table = await fetchOrdersTable({}, params);

  return (
    <PageShell title="発注管理" description="全店舗の発注状況">
      <DataTable
        basePath="/hq/orders"
        q={params.q}
        filter={params.filter}
        filterLabel="ステータス"
        filterOptions={STATUS_FILTER_OPTIONS}
        searchPlaceholder="発注番号・店舗・倉庫で検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "orderNo", header: "発注番号", cell: (row) => row.orderNo },
          {
            key: "route",
            header: "ルート",
            cell: (row) => `${row.fromLocation.name} → ${row.toLocation.name}`,
          },
          {
            key: "date",
            header: "日付",
            cell: (row) => formatDate(row.createdAt),
          },
          {
            key: "status",
            header: "ステータス",
            cell: (row) => <Badge>{ORDER_STATUS_LABELS[row.status]}</Badge>,
          },
          { key: "sku", header: "SKU数", cell: (row) => row.items.length },
          {
            key: "qty",
            header: "合計数量",
            cell: (row) => row.items.reduce((sum, item) => sum + item.quantity, 0),
          },
        ]}
      />
    </PageShell>
  );
}
