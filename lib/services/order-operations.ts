import type { OrderStatus } from "@prisma/client";

import type { SessionUser } from "@/lib/auth/types";
import { MSG } from "@/lib/messages/ja";
import { db } from "@/lib/db";
import { generateOrderNo, processInbound } from "@/lib/services/inventory";
import { orderCreateSchema, orderStatusSchema } from "@/lib/validators";
import type { z } from "zod";

type CreateOrderInput = z.infer<typeof orderCreateSchema>;

export async function executeCreateOrder(user: SessionUser, input: CreateOrderInput) {
  if (!user.locationId) {
    throw new Error(MSG.STORE_LOCATION_REQUIRED);
  }

  const body = orderCreateSchema.parse(input);

  return db.order.create({
    data: {
      orderNo: generateOrderNo(),
      fromLocationId: user.locationId,
      toLocationId: body.toLocationId,
      status: "SUBMITTED",
      requestedById: user.id,
      items: {
        create: body.items,
      },
    },
    include: {
      items: { include: { product: true } },
    },
  });
}

export async function executeUpdateOrderStatus(
  user: SessionUser,
  orderId: string,
  status: OrderStatus,
) {
  orderStatusSchema.parse({ status });

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error(MSG.ORDER_NOT_FOUND);
  }

  const updated = await db.order.update({
    where: { id: orderId },
    data: {
      status,
      approvedById: status === "SHIPPED" ? user.id : undefined,
    },
  });

  if (status === "RECEIVED") {
    for (const item of order.items) {
      await processInbound({
        locationId: order.fromLocationId,
        productId: item.productId,
        quantity: item.quantity,
        userId: user.id,
        referenceNo: order.orderNo,
        note: "店舗入荷",
      });
    }
  }

  return updated;
}
