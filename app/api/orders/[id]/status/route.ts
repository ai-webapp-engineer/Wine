import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { processInbound } from "@/lib/services/inventory";
import { orderStatusSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const body = orderStatusSchema.parse(await request.json());

    const order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return jsonError("Order not found", 404);
    }

    const updated = await db.order.update({
      where: { id },
      data: {
        status: body.status,
        approvedById: body.status === "SHIPPED" ? user.id : undefined,
      },
    });

    if (body.status === "RECEIVED") {
      for (const item of order.items) {
        await processInbound({
          locationId: order.fromLocationId,
          productId: item.productId,
          quantity: item.quantity,
          userId: user.id,
          referenceNo: order.orderNo,
          note: "Store receiving",
        });
      }
    }

    return jsonOk(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
