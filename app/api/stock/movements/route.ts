import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import {
  getEffectiveLocationId,
  requireSessionUser,
} from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const locationId = getEffectiveLocationId(
      user,
      request.nextUrl.searchParams.get("locationId"),
    );

    const movements = await db.stockMovement.findMany({
      where: locationId
        ? {
            OR: [{ fromLocationId: locationId }, { toLocationId: locationId }],
          }
        : undefined,
      include: {
        product: true,
        fromLocation: true,
        toLocation: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return jsonOk(movements);
  } catch (error) {
    return handleApiError(error);
  }
}
