"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductOption = { id: string; name: string; janCode: string };
type WarehouseOption = { id: string; name: string };

export function OrderCreateForm({
  products,
  warehouses,
}: {
  products: ProductOption[];
  warehouses: WarehouseOption[];
}) {
  const router = useRouter();
  const [toLocationId, setToLocationId] = useState(warehouses[0]?.id ?? "");
  const [rows, setRows] = useState([{ productId: products[0]?.id ?? "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toLocationId,
        items: rows.filter((row) => row.productId && row.quantity > 0),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "発注に失敗しました");
      return;
    }

    router.refresh();
    setRows([{ productId: products[0]?.id ?? "", quantity: 1 }]);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">出荷倉庫</label>
        <select
          className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          value={toLocationId}
          onChange={(event) => setToLocationId(event.target.value)}
        >
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_120px]">
            <select
              className="h-10 rounded-lg border border-stone-300 px-3 text-sm"
              value={row.productId}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...next[index], productId: event.target.value };
                setRows(next);
              }}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              min={1}
              value={row.quantity}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...next[index], quantity: Number(event.target.value) };
                setRows(next);
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setRows([...rows, { productId: products[0]?.id ?? "", quantity: 1 }])}
        >
          行追加
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "送信中..." : "発注送信"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
