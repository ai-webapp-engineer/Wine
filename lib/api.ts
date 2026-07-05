import { NextResponse } from "next/server";

import { formatErrorMessage, formatHttpStatusFromMessage, MSG } from "@/lib/messages/ja";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  const message = formatErrorMessage(error, MSG.INTERNAL_ERROR);
  const status = error instanceof Error ? formatHttpStatusFromMessage(message) : 500;
  return jsonError(message, status);
}
