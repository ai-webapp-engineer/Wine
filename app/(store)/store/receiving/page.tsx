import { PageShell } from "@/app/(store)/store/layout";
import { ReceivingClient } from "@/components/store/receiving-client";
import { requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function StoreReceivingPage() {
  const user = await requireSessionUser();
  const locationId = user.locationId!;

  const orders = await db.order.findMany({
    where: {
      fromLocationId: locationId,
      status: "SHIPPED",
    },
    include: {
      items: { include: { product: true } },
      toLocation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell title="入荷確認" description="倉庫からの出荷を受領">
      <ReceivingClient
        orders={orders.map((order) => ({
          id: order.id,
          orderNo: order.orderNo,
          warehouseName: order.toLocation.name,
          items: order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
          })),
        }))}
      />
    </PageShell>
  );
}
