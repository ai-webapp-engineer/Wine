import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireRole, requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    await requireSessionUser();
    const search = request.nextUrl.searchParams.get("search");

    const products = await db.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { janCode: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
    });

    return jsonOk(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["HQ_STAFF", "HQ_ADMIN"]);
    const body = productSchema.parse(await request.json());

    const product = await db.product.create({
      data: {
        ...body,
        unitPrice: body.unitPrice,
        costPrice: body.costPrice,
      },
    });

    return jsonOk(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
