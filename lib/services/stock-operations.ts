import type { SessionUser } from "@/lib/auth/types";
import { getEffectiveLocationId } from "@/lib/auth/session";
import { MSG } from "@/lib/messages/ja";
import { db } from "@/lib/db";
import { processInbound, processOutbound } from "@/lib/services/inventory";
import {
  stockInboundSchema,
  stockOutboundSchema,
} from "@/lib/validators";
import type { z } from "zod";

type InboundInput = z.infer<typeof stockInboundSchema>;
type OutboundInput = z.infer<typeof stockOutboundSchema>;

export async function executeInbound(user: SessionUser, input: InboundInput) {
  const body = stockInboundSchema.parse(input);
  const locationId = getEffectiveLocationId(user, body.locationId) ?? user.locationId;

  if (!locationId) {
    throw new Error(MSG.INVALID_LOCATION);
  }

  const product = await db.product.findUnique({
    where: { janCode: body.janCode },
    select: { id: true, name: true, janCode: true },
  });

  if (!product) {
    throw new Error(MSG.UNKNOWN_JAN);
  }

  const inventory = await processInbound({
    locationId,
    productId: product.id,
    quantity: body.quantity,
    userId: user.id,
    scannedJan: body.janCode,
    note: body.note,
  });

  return { inventory, product };
}

export async function executeOutbound(user: SessionUser, input: OutboundInput) {
  const body = stockOutboundSchema.parse(input);
  const locationId = getEffectiveLocationId(user, body.locationId) ?? user.locationId;

  if (!locationId) {
    throw new Error(MSG.INVALID_LOCATION);
  }

  const product = await db.product.findUnique({
    where: { janCode: body.janCode },
    select: { id: true, name: true, janCode: true },
  });

  if (!product) {
    throw new Error(MSG.UNKNOWN_JAN);
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

  return { inventory, product };
}
