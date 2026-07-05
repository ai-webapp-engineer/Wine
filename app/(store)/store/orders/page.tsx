import { PageShell } from "@/app/(store)/store/layout";
import { OrderCreateForm } from "@/components/orders/order-create-form";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  DRAFT: "下書き",
  SUBMITTED: "送信済",
  PICKING: "ピッキング中",
  SHIPPED: "出荷済",
  RECEIVED: "入荷済",
  CANCELLED: "取消",
};

export default async function StoreOrdersPage() {
  const session = await auth();
  const locationId = session!.user.locationId!;

  const [orders, products, warehouses] = await Promise.all([
    db.order.findMany({
      where: { fromLocationId: locationId },
      include: {
        items: { include: { product: true } },
        toLocation: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    db.location.findMany({ where: { type: "WAREHOUSE", isActive: true } }),
  ]);

  return (
    <PageShell title="発注" description="倉庫への発注作成と履歴">
      <OrderCreateForm products={products} warehouses={warehouses} />
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.orderNo}</p>
                <p className="text-sm text-stone-500">
                  {order.toLocation.name} / {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge>{statusLabel[order.status]}</Badge>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-stone-600">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
