import { PageShell } from "@/app/(hq)/hq/layout";
import { DataTable } from "@/components/ui/data-table";
import { parseTableParams, type TableSearchParams } from "@/lib/pagination";
import { fetchActiveLocations, fetchHqInventoryTable } from "@/lib/services/table-queries";

type Props = {
  searchParams: Promise<TableSearchParams>;
};

export default async function HqInventoryPage({ searchParams }: Props) {
  const params = parseTableParams(await searchParams);
  const [table, locations] = await Promise.all([
    fetchHqInventoryTable(params),
    fetchActiveLocations(),
  ]);

  return (
    <PageShell title="全拠点在庫" description="店舗・倉庫横断の在庫一覧">
      <DataTable
        basePath="/hq/inventory"
        q={params.q}
        filter={params.filter}
        filterLabel="拠点"
        filterOptions={locations.map((location) => ({
          value: location.id,
          label: location.name,
        }))}
        searchPlaceholder="拠点・商品名・JANで検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "location", header: "拠点", cell: (row) => row.location.name },
          { key: "product", header: "商品名", cell: (row) => row.product.name },
          {
            key: "jan",
            header: "JAN",
            cell: (row) => <span className="font-mono text-xs">{row.product.janCode}</span>,
          },
          { key: "quantity", header: "在庫", cell: (row) => row.quantity },
        ]}
      />
    </PageShell>
  );
}
