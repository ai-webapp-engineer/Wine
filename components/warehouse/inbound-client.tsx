"use client";

import { useRouter } from "next/navigation";

import { submitInboundAction } from "@/lib/actions/stock";
import { JanScanner } from "@/components/scanner/jan-scanner";

export function WarehouseInboundClient() {
  const router = useRouter();

  async function handleSubmit(payload: { janCode: string; quantity: number }) {
    const result = await submitInboundAction(payload.janCode, payload.quantity);
    if (!result.ok) {
      throw new Error(result.error);
    }
    router.refresh();
  }

  return <JanScanner mode="inbound" onSubmit={handleSubmit} />;
}
