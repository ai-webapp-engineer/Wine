import type { Prisma, StockMovementType } from "@prisma/client";

import { db } from "@/lib/db";

type InventoryChangeInput = {
  locationId: string;
  productId: string;
  delta: number;
};

export async function applyInventoryDelta(
  tx: Prisma.TransactionClient,
  input: InventoryChangeInput,
) {
  const existing = await tx.inventory.findUnique({
    where: {
      locationId_productId: {
        locationId: input.locationId,
        productId: input.productId,
      },
    },
  });

  const nextQuantity = (existing?.quantity ?? 0) + input.delta;
  if (nextQuantity < 0) {
    throw new Error("Insufficient inventory");
  }

  return tx.inventory.upsert({
    where: {
      locationId_productId: {
        locationId: input.locationId,
        productId: input.productId,
      },
    },
    create: {
      locationId: input.locationId,
      productId: input.productId,
      quantity: nextQuantity,
    },
    update: {
      quantity: nextQuantity,
    },
  });
}

type RecordMovementInput = {
  type: StockMovementType;
  productId: string;
  quantity: number;
  userId: string;
  fromLocationId?: string | null;
  toLocationId?: string | null;
  scannedJan?: string;
  referenceNo?: string;
  note?: string;
};

export async function recordStockMovement(
  tx: Prisma.TransactionClient,
  input: RecordMovementInput,
) {
  return tx.stockMovement.create({
    data: {
      type: input.type,
      productId: input.productId,
      quantity: input.quantity,
      userId: input.userId,
      fromLocationId: input.fromLocationId,
      toLocationId: input.toLocationId,
      scannedJan: input.scannedJan,
      referenceNo: input.referenceNo,
      note: input.note,
    },
  });
}

export async function processInbound(input: {
  locationId: string;
  productId: string;
  quantity: number;
  userId: string;
  scannedJan?: string;
  referenceNo?: string;
  note?: string;
}) {
  return db.$transaction(async (tx) => {
    const inventory = await applyInventoryDelta(tx, {
      locationId: input.locationId,
      productId: input.productId,
      delta: input.quantity,
    });

    await recordStockMovement(tx, {
      type: "INBOUND",
      productId: input.productId,
      quantity: input.quantity,
      userId: input.userId,
      toLocationId: input.locationId,
      scannedJan: input.scannedJan,
      referenceNo: input.referenceNo,
      note: input.note,
    });

    return inventory;
  });
}

export async function processOutbound(input: {
  locationId: string;
  productId: string;
  quantity: number;
  userId: string;
  scannedJan?: string;
  referenceNo?: string;
  note?: string;
}) {
  return db.$transaction(async (tx) => {
    const inventory = await applyInventoryDelta(tx, {
      locationId: input.locationId,
      productId: input.productId,
      delta: -input.quantity,
    });

    await recordStockMovement(tx, {
      type: "OUTBOUND",
      productId: input.productId,
      quantity: input.quantity,
      userId: input.userId,
      fromLocationId: input.locationId,
      scannedJan: input.scannedJan,
      referenceNo: input.referenceNo,
      note: input.note,
    });

    return inventory;
  });
}

export async function processInventoryAdjust(input: {
  locationId: string;
  productId: string;
  quantity: number;
  userId: string;
  note?: string;
}) {
  return db.$transaction(async (tx) => {
    const existing = await tx.inventory.findUnique({
      where: {
        locationId_productId: {
          locationId: input.locationId,
          productId: input.productId,
        },
      },
    });

    const delta = input.quantity - (existing?.quantity ?? 0);

    const inventory = await applyInventoryDelta(tx, {
      locationId: input.locationId,
      productId: input.productId,
      delta,
    });

    if (delta !== 0) {
      await recordStockMovement(tx, {
        type: "ADJUSTMENT",
        productId: input.productId,
        quantity: Math.abs(delta),
        userId: input.userId,
        fromLocationId: delta < 0 ? input.locationId : null,
        toLocationId: delta > 0 ? input.locationId : null,
        note: input.note,
      });
    }

    return inventory;
  });
}

export async function processPosSale(input: {
  locationId: string;
  productId: string;
  quantity: number;
  userId: string;
  scannedJan?: string;
  referenceNo?: string;
}) {
  return db.$transaction(async (tx) => {
    const inventory = await applyInventoryDelta(tx, {
      locationId: input.locationId,
      productId: input.productId,
      delta: -input.quantity,
    });

    await recordStockMovement(tx, {
      type: "POS_SALE",
      productId: input.productId,
      quantity: input.quantity,
      userId: input.userId,
      fromLocationId: input.locationId,
      scannedJan: input.scannedJan,
      referenceNo: input.referenceNo,
    });

    return inventory;
  });
}

export function generateOrderNo(): string {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ORD-${stamp}-${random}`;
}
