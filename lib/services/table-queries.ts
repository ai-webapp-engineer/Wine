import type { OrderStatus, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { getPaginationMeta, type TableQueryInput } from "@/lib/pagination";

export type TableQueryResult<T> = {
  rows: T[];
  total: number;
  currentPage: number;
  totalPages: number;
};

function productTextSearch(q: string): Prisma.ProductWhereInput {
  if (!q) return {};
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { janCode: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { producer: { contains: q, mode: "insensitive" } },
    ],
  };
}

function locationTextSearch(q: string): Prisma.LocationWhereInput {
  if (!q) return {};
  return {
    OR: [
      { code: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ],
  };
}

export async function fetchProductsTable(
  input: TableQueryInput,
): Promise<TableQueryResult<Awaited<ReturnType<typeof db.product.findMany>>[number]>> {
  const where: Prisma.ProductWhereInput = {
    ...productTextSearch(input.q),
    ...(input.filter ? { category: input.filter } : {}),
  };

  const total = await db.product.count({ where });
  const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
  const rows = await db.product.findMany({
    where,
    orderBy: { name: "asc" },
    skip,
    take,
  });

  return { rows, total, currentPage, totalPages };
}

export async function fetchProductCategories(): Promise<string[]> {
  const rows = await db.product.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((row) => row.category!).filter(Boolean);
}

export const LOCATION_TYPE_LABELS: Record<string, string> = {
  STORE: "店舗",
  WAREHOUSE: "倉庫",
  HQ: "本部",
};

export async function fetchLocationsTable(
  input: TableQueryInput,
): Promise<TableQueryResult<Awaited<ReturnType<typeof db.location.findMany>>[number]>> {
  const where: Prisma.LocationWhereInput = {
    ...locationTextSearch(input.q),
    ...(input.filter ? { type: input.filter as "STORE" | "WAREHOUSE" | "HQ" } : {}),
  };

  const total = await db.location.count({ where });
  const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
  const rows = await db.location.findMany({
    where,
    orderBy: { code: "asc" },
    skip,
    take,
  });

  return { rows, total, currentPage, totalPages };
}

export async function fetchHqInventoryTable(
  input: TableQueryInput,
): Promise<
  TableQueryResult<
    Awaited<
      ReturnType<
        typeof db.inventory.findMany<{ include: { product: true; location: true } }>
      >
    >[number]
  >
> {
  const where: Prisma.InventoryWhereInput = {
    ...(input.filter ? { locationId: input.filter } : {}),
    ...(input.q
      ? {
          OR: [
            { product: { name: { contains: input.q, mode: "insensitive" } } },
            { product: { janCode: { contains: input.q, mode: "insensitive" } } },
            { location: { name: { contains: input.q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const total = await db.inventory.count({ where });
  const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
  const rows = await db.inventory.findMany({
    where,
    include: { product: true, location: true },
    orderBy: [{ location: { code: "asc" } }, { product: { name: "asc" } }],
    skip,
    take,
  });

  return { rows, total, currentPage, totalPages };
}

export async function fetchLocationInventoryTable(
  locationId: string,
  input: TableQueryInput,
): Promise<
  TableQueryResult<
    Awaited<ReturnType<typeof db.inventory.findMany<{ include: { product: true } }>>>[number]
  >
> {
  const productSearch: Prisma.ProductWhereInput | undefined = input.q
    ? {
        OR: [
          { name: { contains: input.q, mode: "insensitive" } },
          { janCode: { contains: input.q, mode: "insensitive" } },
          { category: { contains: input.q, mode: "insensitive" } },
        ],
      }
    : undefined;

  if (input.filter === "low") {
    const all = await db.inventory.findMany({
      where: {
        locationId,
        product: {
          isActive: true,
          ...productSearch,
        },
      },
      include: { product: true },
      orderBy: { product: { name: "asc" } },
    });
    const filtered = all.filter((item) => item.quantity <= item.product.minStock);
    const total = filtered.length;
    const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
    return {
      rows: filtered.slice(skip, skip + take),
      total,
      currentPage,
      totalPages,
    };
  }

  const where: Prisma.InventoryWhereInput = {
    locationId,
    ...(productSearch ? { product: productSearch } : {}),
  };

  const total = await db.inventory.count({ where });
  const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
  const rows = await db.inventory.findMany({
    where,
    include: { product: true },
    orderBy: { product: { name: "asc" } },
    skip,
    take,
  });

  return { rows, total, currentPage, totalPages };
}

export async function fetchUsersTable(
  input: TableQueryInput,
): Promise<
  TableQueryResult<
    Awaited<ReturnType<typeof db.user.findMany<{ include: { location: true } }>>>[number]
  >
> {
  const where: Prisma.UserWhereInput = {
    ...(input.q
      ? {
          OR: [
            { name: { contains: input.q, mode: "insensitive" } },
            { email: { contains: input.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(input.filter ? { role: input.filter as Prisma.EnumUserRoleFilter["equals"] } : {}),
  };

  const total = await db.user.count({ where });
  const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
  const rows = await db.user.findMany({
    where,
    include: { location: true },
    orderBy: { email: "asc" },
    skip,
    take,
  });

  return { rows, total, currentPage, totalPages };
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: "下書き",
  SUBMITTED: "送信済",
  PICKING: "ピッキング中",
  SHIPPED: "出荷済",
  RECEIVED: "入荷済",
  CANCELLED: "取消",
};

type OrderRow = Awaited<
  ReturnType<
    typeof db.order.findMany<{
      include: {
        fromLocation: true;
        toLocation: true;
        items: { include: { product: true } };
      };
    }>
  >
>[number];

export async function fetchOrdersTable(
  baseWhere: Prisma.OrderWhereInput,
  input: TableQueryInput,
): Promise<TableQueryResult<OrderRow>> {
  const where: Prisma.OrderWhereInput = {
    ...baseWhere,
    ...(input.filter ? { status: input.filter as OrderStatus } : {}),
    ...(input.q
      ? {
          OR: [
            { orderNo: { contains: input.q, mode: "insensitive" } },
            { fromLocation: { name: { contains: input.q, mode: "insensitive" } } },
            { toLocation: { name: { contains: input.q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const total = await db.order.count({ where });
  const { currentPage, skip, take, totalPages } = getPaginationMeta(total, input.page, input.pageSize);
  const rows = await db.order.findMany({
    where,
    include: {
      fromLocation: true,
      toLocation: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return { rows, total, currentPage, totalPages };
}

export async function fetchActiveLocations() {
  return db.location.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
    select: { id: true, name: true, type: true },
  });
}
