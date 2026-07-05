import { z } from "zod";

export const productSchema = z.object({
  janCode: z.string().min(8).max(13),
  name: z.string().min(1),
  nameKana: z.string().optional(),
  vintage: z.number().int().optional(),
  producer: z.string().optional(),
  region: z.string().optional(),
  grape: z.string().optional(),
  volume: z.number().int().positive().default(750),
  unitPrice: z.number().nonnegative(),
  costPrice: z.number().nonnegative().optional(),
  category: z.string().optional(),
  minStock: z.number().int().nonnegative().default(5),
  isActive: z.boolean().default(true),
});

export const locationSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(1),
  type: z.enum(["STORE", "WAREHOUSE", "HQ"]),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const inventoryAdjustSchema = z.object({
  locationId: z.string(),
  productId: z.string(),
  quantity: z.number().int().nonnegative(),
  note: z.string().optional(),
});

export const stockInboundSchema = z.object({
  locationId: z.string().optional(),
  janCode: z.string().min(8),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});

export const stockOutboundSchema = z.object({
  locationId: z.string().optional(),
  janCode: z.string().min(8),
  quantity: z.number().int().positive(),
  orderId: z.string().optional(),
  note: z.string().optional(),
});

export const orderCreateSchema = z.object({
  toLocationId: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "PICKING",
    "SHIPPED",
    "RECEIVED",
    "CANCELLED",
  ]),
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum([
    "STORE_STAFF",
    "STORE_MANAGER",
    "WAREHOUSE_STAFF",
    "WAREHOUSE_MANAGER",
    "HQ_STAFF",
    "HQ_ADMIN",
  ]),
  locationId: z.string().optional(),
});

export const posWebhookSchema = z.object({
  externalId: z.string(),
  storeCode: z.string(),
  items: z.array(
    z.object({
      janCode: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    }),
  ),
  soldAt: z.string().datetime().optional(),
});
