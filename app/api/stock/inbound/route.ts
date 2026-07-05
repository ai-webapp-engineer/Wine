import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireRole } from "@/lib/auth/session";
import { executeInbound } from "@/lib/services/stock-operations";
import { stockInboundSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["WAREHOUSE_STAFF", "WAREHOUSE_MANAGER", "HQ_ADMIN"]);
    const body = stockInboundSchema.parse(await request.json());
    const result = await executeInbound(user, body);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
