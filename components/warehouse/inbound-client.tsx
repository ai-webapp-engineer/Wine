"use client";

import { useRouter } from "next/navigation";

import { JanScanner } from "@/components/scanner/jan-scanner";

export function WarehouseInboundClient() {
  const router = useRouter();

  async function handleSubmit(payload: { janCode: string; quantity: number }) {
    const response = await fetch("/api/stock/inbound", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error ?? "入庫に失敗しました");
    }

    router.refresh();
  }

  return <JanScanner mode="inbound" onSubmit={handleSubmit} />;
}
