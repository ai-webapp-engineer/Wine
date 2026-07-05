import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import {
  getEffectiveLocationId,
  isHqRole,
  requireSessionUser,
} from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const requestedLocationId = request.nextUrl.searchParams.get("locationId");
    const locationId = getEffectiveLocationId(user, requestedLocationId);

    if (!locationId && !isHqRole(user.role)) {
      return jsonError("locationId is required", 400);
    }

    const inventory = await db.inventory.findMany({
      where: locationId ? { locationId } : undefined,
      include: {
        product: true,
        location: true,
      },
      orderBy: [{ location: { code: "asc" } }, { product: { name: "asc" } }],
    });

    return jsonOk(inventory);
  } catch (error) {
    return handleApiError(error);
  }
}
