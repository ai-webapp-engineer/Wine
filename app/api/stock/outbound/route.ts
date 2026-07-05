import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import {
  getEffectiveLocationId,
  requireRole,
} from "@/lib/auth/session";
import { db } from "@/lib/db";
import { processOutbound } from "@/lib/services/inventory";
import { stockOutboundSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["WAREHOUSE_STAFF", "WAREHOUSE_MANAGER", "HQ_ADMIN"]);
    const body = stockOutboundSchema.parse(await request.json());
    const locationId = getEffectiveLocationId(user, body.locationId) ?? user.locationId;

    if (!locationId) {
      return jsonError("Invalid location", 403);
    }

    const product = await db.product.findUnique({ where: { janCode: body.janCode } });
    if (!product) {
      return jsonError("Unknown JAN code", 404);
    }

    const inventory = await processOutbound({
      locationId,
      productId: product.id,
      quantity: body.quantity,
      userId: user.id,
      scannedJan: body.janCode,
      referenceNo: body.orderId,
      note: body.note,
    });

    if (body.orderId) {
      await db.order.update({
        where: { id: body.orderId },
        data: { status: "PICKING" },
      });
    }

    return jsonOk({ inventory, product });
  } catch (error) {
    return handleApiError(error);
  }
}
