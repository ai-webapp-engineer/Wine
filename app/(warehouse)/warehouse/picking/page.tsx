import { PageShell } from "@/app/(warehouse)/warehouse/layout";
import { WarehousePickingClient } from "@/components/warehouse/picking-client";
import { requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function WarehousePickingPage() {
  const user = await requireSessionUser();
  const locationId = user.locationId!;

  const orders = await db.order.findMany({
    where: {
      toLocationId: locationId,
      status: { in: ["SUBMITTED", "PICKING"] },
    },
    include: {
      items: { include: { product: true } },
      fromLocation: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <PageShell title="ピッキング" description="発注に基づく出庫">
      <WarehousePickingClient
        orders={orders.map((order) => ({
          id: order.id,
          orderNo: order.orderNo,
          storeName: order.fromLocation.name,
          status: order.status,
          items: order.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            janCode: item.product.janCode,
            quantity: item.quantity,
          })),
        }))}
      />
    </PageShell>
  );
}
