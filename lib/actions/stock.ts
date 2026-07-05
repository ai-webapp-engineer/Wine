"use server";

import { revalidatePath } from "next/cache";

import { actionFail, actionOk, type ActionResult } from "@/lib/actions/result";
import { requireRole } from "@/lib/auth/session";
import { executeInbound, executeOutbound } from "@/lib/services/stock-operations";

export async function submitInboundAction(
  janCode: string,
  quantity: number,
): Promise<ActionResult<{ productName: string }>> {
  try {
    const user = await requireRole(["WAREHOUSE_STAFF", "WAREHOUSE_MANAGER", "HQ_ADMIN"]);
    const result = await executeInbound(user, { janCode, quantity });
    revalidatePath("/warehouse/inbound");
    revalidatePath("/warehouse/inventory");
    revalidatePath("/warehouse");
    return actionOk({ productName: result.product.name });
  } catch (error) {
    return actionFail(error, "入庫に失敗しました");
  }
}

export async function submitOutboundAction(
  janCode: string,
  quantity: number,
  orderId?: string,
): Promise<ActionResult<{ productName: string }>> {
  try {
    const user = await requireRole(["WAREHOUSE_STAFF", "WAREHOUSE_MANAGER", "HQ_ADMIN"]);
    const result = await executeOutbound(user, { janCode, quantity, orderId });
    revalidatePath("/warehouse/picking");
    revalidatePath("/warehouse/inventory");
    revalidatePath("/warehouse");
    return actionOk({ productName: result.product.name });
  } catch (error) {
    return actionFail(error, "出庫に失敗しました");
  }
}
