import { z } from "zod";

z.config(z.locales.ja());

export const productSchema = z.object({
  janCode: z.string().min(8, "JANコードは8桁以上で入力してください").max(13, "JANコードは13桁以内で入力してください"),
  name: z.string().min(1, "商品名を入力してください"),
  nameKana: z.string().optional(),
  vintage: z.number().int("年号は整数で入力してください").optional(),
  producer: z.string().optional(),
  region: z.string().optional(),
  grape: z.string().optional(),
  volume: z.number().int("容量は整数で入力してください").positive("容量は1以上で入力してください").default(750),
  unitPrice: z.number().nonnegative("単価は0以上で入力してください"),
  costPrice: z.number().nonnegative("原価は0以上で入力してください").optional(),
  category: z.string().optional(),
  minStock: z.number().int("最低在庫は整数で入力してください").nonnegative("最低在庫は0以上で入力してください").default(5),
  isActive: z.boolean().default(true),
});

export const locationSchema = z.object({
  code: z.string().min(2, "拠点コードは2文字以上で入力してください"),
  name: z.string().min(1, "拠点名を入力してください"),
  type: z.enum(["STORE", "WAREHOUSE", "HQ"], {
    message: "拠点種別を選択してください",
  }),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const inventoryAdjustSchema = z.object({
  locationId: z.string().min(1, "拠点IDを指定してください"),
  productId: z.string().min(1, "商品IDを指定してください"),
  quantity: z.number().int("在庫数は整数で入力してください").nonnegative("在庫数は0以上で入力してください"),
  note: z.string().optional(),
});

export const stockInboundSchema = z.object({
  locationId: z.string().optional(),
  janCode: z.string().min(8, "JANコードは8桁以上で入力してください"),
  quantity: z.number().int("数量は整数で入力してください").positive("数量は1以上で入力してください"),
  note: z.string().optional(),
});

export const stockOutboundSchema = z.object({
  locationId: z.string().optional(),
  janCode: z.string().min(8, "JANコードは8桁以上で入力してください"),
  quantity: z.number().int("数量は整数で入力してください").positive("数量は1以上で入力してください"),
  orderId: z.string().optional(),
  note: z.string().optional(),
});

export const orderCreateSchema = z.object({
  toLocationId: z.string().min(1, "出荷倉庫を選択してください"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "商品を選択してください"),
        quantity: z.number().int("数量は整数で入力してください").positive("数量は1以上で入力してください"),
      }),
    )
    .min(1, "発注商品を1件以上追加してください"),
});

export const orderStatusSchema = z.object({
  status: z.enum(
    ["DRAFT", "SUBMITTED", "PICKING", "SHIPPED", "RECEIVED", "CANCELLED"],
    { message: "発注ステータスが正しくありません" },
  ),
});

export const userCreateSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  name: z.string().min(1, "名前を入力してください"),
  role: z.enum(
    [
      "STORE_STAFF",
      "STORE_MANAGER",
      "WAREHOUSE_STAFF",
      "WAREHOUSE_MANAGER",
      "HQ_STAFF",
      "HQ_ADMIN",
    ],
    { message: "権限を選択してください" },
  ),
  locationId: z.string().optional(),
});

export const posWebhookSchema = z.object({
  externalId: z.string().min(1, "取引IDを指定してください"),
  storeCode: z.string().min(1, "店舗コードを指定してください"),
  items: z
    .array(
      z.object({
        janCode: z.string().min(8, "JANコードは8桁以上で入力してください"),
        quantity: z.number().int("数量は整数で入力してください").positive("数量は1以上で入力してください"),
        unitPrice: z.number().nonnegative("単価は0以上で入力してください"),
      }),
    )
    .min(1, "商品を1件以上指定してください"),
  soldAt: z.string().datetime("販売日時の形式が正しくありません").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});
