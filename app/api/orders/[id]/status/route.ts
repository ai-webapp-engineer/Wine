import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireSessionUser } from "@/lib/auth/session";
import { executeUpdateOrderStatus } from "@/lib/services/order-operations";
import { orderStatusSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const body = orderStatusSchema.parse(await request.json());
    const updated = await executeUpdateOrderStatus(user, id, body.status);
    return jsonOk(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
