import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import {
  getEffectiveLocationId,
  requireRole,
} from "@/lib/auth/session";
import { processInventoryAdjust } from "@/lib/services/inventory";
import { inventoryAdjustSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireRole([
      "STORE_STAFF",
      "STORE_MANAGER",
      "WAREHOUSE_STAFF",
      "WAREHOUSE_MANAGER",
      "HQ_STAFF",
      "HQ_ADMIN",
    ]);

    const body = inventoryAdjustSchema.parse(await request.json());
    const locationId = getEffectiveLocationId(user, body.locationId);

    if (!locationId || locationId !== body.locationId) {
      return jsonError("Invalid location", 403);
    }

    const inventory = await processInventoryAdjust({
      locationId: body.locationId,
      productId: body.productId,
      quantity: body.quantity,
      userId: user.id,
      note: body.note,
    });

    return jsonOk(inventory);
  } catch (error) {
    return handleApiError(error);
  }
}
