import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { requireRole, requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { generateOrderNo } from "@/lib/services/inventory";
import { orderCreateSchema } from "@/lib/validators";

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
    });

    return jsonOk(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["STORE_STAFF", "STORE_MANAGER"]);
    if (!user.locationId) {
      return jsonError("Store location required", 400);
    }

    const body = orderCreateSchema.parse(await request.json());

    const order = await db.order.create({
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

    return jsonOk(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
