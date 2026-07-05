import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { requireSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

type Params = { params: Promise<{ janCode: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireSessionUser();
    const { janCode } = await params;

    const product = await db.product.findUnique({ where: { janCode } });
    if (!product) {
      return jsonError("Product not found", 404);
    }

    return jsonOk(product);
  } catch (error) {
    return handleApiError(error);
  }
}
