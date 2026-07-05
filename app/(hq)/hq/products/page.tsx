import { PageShell } from "@/app/(hq)/hq/layout";
import { ProductForm } from "@/components/hq/product-form";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function HqProductsPage() {
  const products = await db.product.findMany({ orderBy: { name: "asc" } });

  return (
    <PageShell title="商品マスタ" description="ワイン商品の登録・編集">
      <ProductForm />
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">商品名</th>
              <th className="px-4 py-3">JAN</th>
              <th className="px-4 py-3">カテゴリ</th>
              <th className="px-4 py-3">単価</th>
              <th className="px-4 py-3">最低在庫</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{product.janCode}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{formatCurrency(product.unitPrice.toString())}</td>
                <td className="px-4 py-3">{product.minStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
