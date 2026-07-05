import { PageShell } from "@/app/(hq)/hq/layout";
import { LocationForm } from "@/components/hq/location-form";
import { DataTable } from "@/components/ui/data-table";
import { parseTableParams, type TableSearchParams } from "@/lib/pagination";
import { fetchLocationsTable, LOCATION_TYPE_LABELS } from "@/lib/services/table-queries";

type Props = {
  searchParams: Promise<TableSearchParams>;
};

export default async function HqLocationsPage({ searchParams }: Props) {
  const params = parseTableParams(await searchParams);
  const table = await fetchLocationsTable(params);

  return (
    <PageShell title="拠点マスタ" description="店舗・倉庫・本部の管理">
      <LocationForm />
      <DataTable
        basePath="/hq/locations"
        q={params.q}
        filter={params.filter}
        filterLabel="種別"
        filterOptions={[
          { value: "STORE", label: LOCATION_TYPE_LABELS.STORE },
          { value: "WAREHOUSE", label: LOCATION_TYPE_LABELS.WAREHOUSE },
          { value: "HQ", label: LOCATION_TYPE_LABELS.HQ },
        ]}
        searchPlaceholder="コード・名称・住所で検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "code", header: "コード", cell: (row) => row.code },
          { key: "name", header: "名称", cell: (row) => row.name },
          {
            key: "type",
            header: "種別",
            cell: (row) => LOCATION_TYPE_LABELS[row.type] ?? row.type,
          },
          { key: "address", header: "住所", cell: (row) => row.address ?? "—" },
        ]}
      />
    </PageShell>
  );
}
