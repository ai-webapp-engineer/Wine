import { PageShell } from "@/app/(hq)/hq/layout";
import { db } from "@/lib/db";

export default async function HqInventoryPage() {
  const inventory = await db.inventory.findMany({
    include: { product: true, location: true },
    orderBy: [{ location: { code: "asc" } }, { product: { name: "asc" } }],
  });

  return (
    <PageShell title="全拠点在庫" description="店舗・倉庫横断の在庫一覧">
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">拠点</th>
              <th className="px-4 py-3">商品名</th>
              <th className="px-4 py-3">JAN</th>
              <th className="px-4 py-3">在庫</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{item.location.name}</td>
                <td className="px-4 py-3">{item.product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.product.janCode}</td>
                <td className="px-4 py-3">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
