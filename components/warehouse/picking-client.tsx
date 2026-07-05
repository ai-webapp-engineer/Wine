"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { JanScanner } from "@/components/scanner/jan-scanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PickingOrder = {
  id: string;
  orderNo: string;
  storeName: string;
  status: string;
  items: Array<{
    productId: string;
    name: string;
    janCode: string;
    quantity: number;
  }>;
};

export function WarehousePickingClient({ orders }: { orders: PickingOrder[] }) {
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id ?? "");

  async function handleOutbound(payload: { janCode: string; quantity: number }) {
    const response = await fetch("/api/stock/outbound", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        orderId: selectedOrderId || undefined,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error ?? "出庫に失敗しました");
    }

    router.refresh();
  }

  async function updateStatus(status: "PICKING" | "SHIPPED") {
    if (!selectedOrderId) return;
    await fetch(`/api/orders/${selectedOrderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  const selected = orders.find((order) => order.id === selectedOrderId);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-stone-500">ピッキング対象の発注はありません</p>
        ) : (
          orders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrderId(order.id)}
              className={`w-full rounded-xl border p-4 text-left ${
                selectedOrderId === order.id
                  ? "border-wine-700 bg-wine-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{order.orderNo}</p>
                <Badge>{order.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-stone-500">{order.storeName}</p>
            </button>
          ))
        )}
      </div>

      <div className="space-y-4">
        {selected ? (
          <>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="mb-2 font-medium">ピッキングリスト</p>
              <ul className="space-y-1 text-sm text-stone-600">
                {selected.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} ({item.janCode}) x {item.quantity}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button type="button" variant="outline" onClick={() => updateStatus("PICKING")}>
                  ピッキング開始
                </Button>
                <Button type="button" onClick={() => updateStatus("SHIPPED")}>
                  出荷完了
                </Button>
              </div>
            </div>
            <JanScanner mode="outbound" onSubmit={handleOutbound} />
          </>
        ) : null}
      </div>
    </div>
  );
}
