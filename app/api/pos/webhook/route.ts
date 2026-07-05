import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { db } from "@/lib/db";
import { processPosSale } from "@/lib/services/inventory";
import { posWebhookSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-pos-secret");
    if (!secret || secret !== process.env.POS_WEBHOOK_SECRET) {
      return jsonError("Unauthorized", 401);
    }

    const body = posWebhookSchema.parse(await request.json());
    const location = await db.location.findUnique({ where: { code: body.storeCode } });
    if (!location) {
      return jsonError("Unknown store", 404);
    }

    const soldAt = body.soldAt ? new Date(body.soldAt) : new Date();
    const results = [];

    for (const item of body.items) {
      const product = await db.product.findUnique({ where: { janCode: item.janCode } });
      if (!product) {
        return jsonError(`Unknown JAN: ${item.janCode}`, 404);
      }

      const tx = await db.posTransaction.create({
        data: {
          externalId: `${body.externalId}-${item.janCode}`,
          locationId: location.id,
          productId: product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          soldAt,
        },
      });

      const systemUser = await db.user.findFirst({
        where: { role: "HQ_ADMIN" },
      });

      if (systemUser) {
        await processPosSale({
          locationId: location.id,
          productId: product.id,
          quantity: item.quantity,
          userId: systemUser.id,
          scannedJan: item.janCode,
          referenceNo: body.externalId,
        });
      }

      results.push(tx);
    }

    return jsonOk({ processed: results.length });
  } catch (error) {
    return handleApiError(error);
  }
}
