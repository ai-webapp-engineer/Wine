import { PageShell } from "@/app/(store)/store/layout";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function StoreInventoryPage() {
  const session = await auth();
  const locationId = session!.user.locationId!;

  const inventory = await db.inventory.findMany({
    where: { locationId },
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });

  return (
    <PageShell title="在庫一覧" description="自店舗のSKU別在庫">
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">商品名</th>
              <th className="px-4 py-3">JAN</th>
              <th className="px-4 py-3">在庫</th>
              <th className="px-4 py-3">最低在庫</th>
              <th className="px-4 py-3">単価</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{item.product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.product.janCode}</td>
                <td className="px-4 py-3">
                  {item.quantity <= item.product.minStock ? (
                    <Badge variant="warning">{item.quantity}</Badge>
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="px-4 py-3">{item.product.minStock}</td>
                <td className="px-4 py-3">{formatCurrency(item.product.unitPrice.toString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
