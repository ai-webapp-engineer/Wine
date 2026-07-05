import { PageShell } from "@/app/(warehouse)/warehouse/layout";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function WarehouseInventoryPage() {
  const locationId = (await auth())!.user.locationId!;

  const inventory = await db.inventory.findMany({
    where: { locationId },
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });

  return (
    <PageShell title="倉庫在庫" description="倉庫SKU別在庫">
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">商品名</th>
              <th className="px-4 py-3">JAN</th>
              <th className="px-4 py-3">在庫</th>
              <th className="px-4 py-3">引当</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{item.product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.product.janCode}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.reservedQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
