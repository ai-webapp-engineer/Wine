import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }
    if (error.message === "Forbidden") {
      return jsonError("Forbidden", 403);
    }
    if (error.message === "Location required") {
      return jsonError("Location required", 400);
    }
    if (error.message === "Insufficient inventory") {
      return jsonError("Insufficient inventory", 409);
    }
    return jsonError(error.message, 400);
  }
  return jsonError("Internal server error", 500);
}
