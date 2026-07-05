import { PageShell } from "@/app/(store)/store/layout";
import { OrderCreateForm } from "@/components/orders/order-create-form";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
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

export default async function StoreOrdersPage({ searchParams }: Props) {
  const user = await requireSessionUser();
  const locationId = user.locationId!;
  const params = parseTableParams(await searchParams);

  const [table, products, warehouses] = await Promise.all([
    fetchOrdersTable({ fromLocationId: locationId }, params),
    db.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, janCode: true },
    }),
    db.location.findMany({
      where: { type: "WAREHOUSE", isActive: true },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <PageShell title="発注" description="倉庫への発注作成と履歴">
      <OrderCreateForm products={products} warehouses={warehouses} />
      <DataTable
        basePath="/store/orders"
        q={params.q}
        filter={params.filter}
        filterLabel="ステータス"
        filterOptions={STATUS_FILTER_OPTIONS}
        searchPlaceholder="発注番号・倉庫名で検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "orderNo", header: "発注番号", cell: (row) => row.orderNo },
          { key: "warehouse", header: "出荷倉庫", cell: (row) => row.toLocation.name },
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
