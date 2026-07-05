"use server";

import { revalidatePath } from "next/cache";

import { actionFail, actionOk, type ActionResult } from "@/lib/actions/result";
import { requireRole, requireSessionUser } from "@/lib/auth/session";
import {
  executeCreateOrder,
  executeUpdateOrderStatus,
} from "@/lib/services/order-operations";
import type { OrderStatus } from "@prisma/client";

export async function createOrderAction(input: {
  toLocationId: string;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<ActionResult<{ orderNo: string }>> {
  try {
    const user = await requireRole(["STORE_STAFF", "STORE_MANAGER"]);
    const order = await executeCreateOrder(user, input);
    revalidatePath("/store/orders");
    revalidatePath("/store");
    return actionOk({ orderNo: order.orderNo });
  } catch (error) {
    return actionFail(error, "発注に失敗しました");
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<ActionResult> {
  try {
    const user = await requireSessionUser();
    await executeUpdateOrderStatus(user, orderId, status);
    revalidatePath("/warehouse/picking");
    revalidatePath("/store/receiving");
    revalidatePath("/store/orders");
    revalidatePath("/hq/orders");
    return actionOk(undefined);
  } catch (error) {
    return actionFail(error, "ステータス更新に失敗しました");
  }
}
