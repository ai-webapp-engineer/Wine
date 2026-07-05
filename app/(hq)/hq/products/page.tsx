import { PageShell } from "@/app/(hq)/hq/layout";
import { ProductForm } from "@/components/hq/product-form";
import { DataTable } from "@/components/ui/data-table";
import { parseTableParams, type TableSearchParams } from "@/lib/pagination";
import { fetchProductCategories, fetchProductsTable } from "@/lib/services/table-queries";
import { formatCurrency } from "@/lib/utils";

type Props = {
  searchParams: Promise<TableSearchParams>;
};

export default async function HqProductsPage({ searchParams }: Props) {
  const params = parseTableParams(await searchParams);
  const [table, categories] = await Promise.all([
    fetchProductsTable(params),
    fetchProductCategories(),
  ]);

  return (
    <PageShell title="商品マスタ" description="ワイン商品の登録・編集">
      <ProductForm />
      <DataTable
        basePath="/hq/products"
        q={params.q}
        filter={params.filter}
        filterLabel="カテゴリ"
        filterOptions={categories.map((category) => ({ value: category, label: category }))}
        searchPlaceholder="商品名・JAN・カテゴリで検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "name", header: "商品名", cell: (row) => row.name },
          {
            key: "jan",
            header: "JAN",
            cell: (row) => <span className="font-mono text-xs">{row.janCode}</span>,
          },
          { key: "category", header: "カテゴリ", cell: (row) => row.category ?? "—" },
          {
            key: "price",
            header: "単価",
            cell: (row) => formatCurrency(row.unitPrice.toString()),
          },
          { key: "minStock", header: "最低在庫", cell: (row) => row.minStock },
        ]}
      />
    </PageShell>
  );
}
