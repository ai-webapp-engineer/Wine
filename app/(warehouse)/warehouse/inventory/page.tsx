import { PageShell } from "@/app/(warehouse)/warehouse/layout";
import { DataTable } from "@/components/ui/data-table";
import { requireSessionUser } from "@/lib/auth/session";
import { parseTableParams, type TableSearchParams } from "@/lib/pagination";
import { fetchLocationInventoryTable } from "@/lib/services/table-queries";

type Props = {
  searchParams: Promise<TableSearchParams>;
};

export default async function WarehouseInventoryPage({ searchParams }: Props) {
  const user = await requireSessionUser();
  const locationId = user.locationId!;
  const params = parseTableParams(await searchParams);
  const table = await fetchLocationInventoryTable(locationId, params);

  return (
    <PageShell title="倉庫在庫" description="倉庫SKU別在庫">
      <DataTable
        basePath="/warehouse/inventory"
        q={params.q}
        filter={params.filter}
        filterLabel="在庫状態"
        filterOptions={[{ value: "low", label: "最低在庫以下" }]}
        searchPlaceholder="商品名・JAN・カテゴリで検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "name", header: "商品名", cell: (row) => row.product.name },
          {
            key: "jan",
            header: "JAN",
            cell: (row) => <span className="font-mono text-xs">{row.product.janCode}</span>,
          },
          { key: "quantity", header: "在庫", cell: (row) => row.quantity },
          { key: "reserved", header: "引当", cell: (row) => row.reservedQty },
        ]}
      />
    </PageShell>
  );
}
