"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type ReceivingOrder = {
  id: string;
  orderNo: string;
  warehouseName: string;
  items: Array<{ name: string; quantity: number }>;
};

export function ReceivingClient({ orders }: { orders: ReceivingOrder[] }) {
  const router = useRouter();

  async function confirmReceiving(orderId: string) {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RECEIVED" }),
    });
    router.refresh();
  }

  if (orders.length === 0) {
    return <p className="text-sm text-stone-500">入荷待ちの発注はありません</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{order.orderNo}</p>
              <p className="text-sm text-stone-500">出荷元: {order.warehouseName}</p>
            </div>
            <Button onClick={() => confirmReceiving(order.id)}>入荷確認</Button>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-stone-600">
            {order.items.map((item, index) => (
              <li key={`${order.id}-${index}`}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
