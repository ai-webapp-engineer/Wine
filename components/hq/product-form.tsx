"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSG } from "@/lib/messages/ja";

export function ProductForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    janCode: "",
    name: "",
    category: "赤",
    unitPrice: 5000,
    minStock: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? MSG.REGISTER_FAILED);
      setLoading(false);
      return;
    }

    setLoading(false);

    setForm({ janCode: "", name: "", category: "赤", unitPrice: 5000, minStock: 5 });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-5">
      <Input
        placeholder="JANコード"
        value={form.janCode}
        onChange={(event) => setForm({ ...form, janCode: event.target.value })}
        required
      />
      <Input
        placeholder="商品名"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        required
      />
      <Input
        placeholder="カテゴリ"
        value={form.category}
        onChange={(event) => setForm({ ...form, category: event.target.value })}
      />
      <Input
        type="number"
        placeholder="単価"
        value={form.unitPrice}
        onChange={(event) => setForm({ ...form, unitPrice: Number(event.target.value) })}
      />
      <Button type="submit" loading={loading}>
        商品追加
      </Button>
      {error ? <p className="text-sm text-red-600 md:col-span-5">{error}</p> : null}
    </form>
  );
}
