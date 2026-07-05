import { z } from "zod";

export const MSG = {
  UNAUTHORIZED: "ログインが必要です",
  FORBIDDEN: "権限がありません",
  LOCATION_REQUIRED: "拠点が指定されていません",
  INVALID_LOCATION: "拠点が正しくありません",
  INSUFFICIENT_INVENTORY: "在庫が不足しています",
  UNKNOWN_JAN: "JANコードが見つかりません",
  PRODUCT_NOT_FOUND: "商品が見つかりません",
  ORDER_NOT_FOUND: "発注が見つかりません",
  STORE_LOCATION_REQUIRED: "店舗の拠点が設定されていません",
  INTERNAL_ERROR: "サーバーでエラーが発生しました",
  VALIDATION_ERROR: "入力内容に誤りがあります",
  LOCATION_ID_REQUIRED: "拠点IDを指定してください",
  POS_UNAUTHORIZED: "POS連携の認証に失敗しました",
  UNKNOWN_STORE: "店舗コードが見つかりません",
  OPERATION_FAILED: "操作に失敗しました",
  REGISTER_FAILED: "登録に失敗しました",
  LOGIN_FAILED: "メールアドレスまたはパスワードが正しくありません",
  unknownJan: (jan: string) => `JANコードが見つかりません: ${jan}`,
} as const;

const LEGACY_ERROR_MAP: Record<string, string> = {
  Unauthorized: MSG.UNAUTHORIZED,
  Forbidden: MSG.FORBIDDEN,
  "Location required": MSG.LOCATION_REQUIRED,
  "Invalid location": MSG.INVALID_LOCATION,
  "Insufficient inventory": MSG.INSUFFICIENT_INVENTORY,
  "Unknown JAN code": MSG.UNKNOWN_JAN,
  "Product not found": MSG.PRODUCT_NOT_FOUND,
  "Order not found": MSG.ORDER_NOT_FOUND,
  "Store location required": MSG.STORE_LOCATION_REQUIRED,
  "Internal server error": MSG.INTERNAL_ERROR,
  "locationId is required": MSG.LOCATION_ID_REQUIRED,
  "Invalid locationId": MSG.INVALID_LOCATION,
};

function isZodError(error: unknown): error is z.ZodError {
  return (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as z.ZodError).issues)
  );
}

export function formatErrorMessage(error: unknown, fallback: string = MSG.OPERATION_FAILED): string {
  if (isZodError(error)) {
    const first = error.issues[0];
    if (first?.message) return first.message;
    return MSG.VALIDATION_ERROR;
  }

  if (error instanceof Error) {
    return LEGACY_ERROR_MAP[error.message] ?? error.message;
  }

  return fallback;
}


export function formatHttpStatusFromMessage(message: string): number {
  switch (message) {
    case MSG.UNAUTHORIZED:
      return 401;
    case MSG.FORBIDDEN:
      return 403;
    case MSG.INSUFFICIENT_INVENTORY:
      return 409;
    case MSG.PRODUCT_NOT_FOUND:
    case MSG.ORDER_NOT_FOUND:
    case MSG.UNKNOWN_JAN:
    case MSG.UNKNOWN_STORE:
      return 404;
    default:
      return 400;
  }
}
