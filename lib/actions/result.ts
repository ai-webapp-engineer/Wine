import { formatErrorMessage, MSG } from "@/lib/messages/ja";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function actionOk<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionFail(error: unknown, fallback: string = MSG.OPERATION_FAILED): ActionResult<never> {
  return { ok: false, error: formatErrorMessage(error, fallback) };
}
