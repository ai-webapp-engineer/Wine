import { PageShell } from "@/app/(hq)/hq/layout";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function HqOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      fromLocation: true,
      toLocation: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell title="発注管理" description="全店舗の発注状況">
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.orderNo}</p>
                <p className="text-sm text-stone-500">
                  {order.fromLocation.name} → {order.toLocation.name} / {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge>{order.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {order.items.length} SKU / 合計 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 本
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
