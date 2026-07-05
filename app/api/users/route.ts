import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { userCreateSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireRole(["HQ_STAFF", "HQ_ADMIN"]);

    const users = await db.user.findMany({
      include: { location: true },
      orderBy: { email: "asc" },
    });

    return jsonOk(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["HQ_ADMIN"]);
    const body = userCreateSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await db.user.create({
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        locationId: body.locationId,
        passwordHash,
      },
    });

    return jsonOk({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
