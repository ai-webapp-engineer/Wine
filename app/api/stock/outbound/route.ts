import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireRole } from "@/lib/auth/session";
import { executeOutbound } from "@/lib/services/stock-operations";
import { stockOutboundSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["WAREHOUSE_STAFF", "WAREHOUSE_MANAGER", "HQ_ADMIN"]);
    const body = stockOutboundSchema.parse(await request.json());
    const result = await executeOutbound(user, body);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
