import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { locationSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireRole([
      "HQ_STAFF",
      "HQ_ADMIN",
      "STORE_STAFF",
      "STORE_MANAGER",
      "WAREHOUSE_STAFF",
      "WAREHOUSE_MANAGER",
    ]);

    const locations = await db.location.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
    });

    return jsonOk(locations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["HQ_STAFF", "HQ_ADMIN"]);
    const body = locationSchema.parse(await request.json());

    const location = await db.location.create({ data: body });
    return jsonOk(location, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
