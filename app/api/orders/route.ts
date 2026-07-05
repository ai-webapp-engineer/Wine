import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireRole, requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { executeCreateOrder } from "@/lib/services/order-operations";

export async function GET() {
  try {
    const user = await requireSessionUser();

    const orders = await db.order.findMany({
      where:
        user.role.startsWith("HQ")
          ? undefined
          : user.role.startsWith("STORE")
            ? { fromLocationId: user.locationId ?? undefined }
            : { toLocationId: user.locationId ?? undefined },
      include: {
        items: { include: { product: true } },
        fromLocation: true,
        toLocation: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return jsonOk(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["STORE_STAFF", "STORE_MANAGER"]);
    const body = await request.json();
    const order = await executeCreateOrder(user, body);
    return jsonOk(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
