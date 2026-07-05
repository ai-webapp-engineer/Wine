"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LocationForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "STORE",
    address: "",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "", type: "STORE", address: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-5">
      <Input
        placeholder="コード"
        value={form.code}
        onChange={(event) => setForm({ ...form, code: event.target.value })}
        required
      />
      <Input
        placeholder="名称"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        required
      />
      <select
        className="h-10 rounded-lg border border-stone-300 px-3 text-sm"
        value={form.type}
        onChange={(event) => setForm({ ...form, type: event.target.value })}
      >
        <option value="STORE">STORE</option>
        <option value="WAREHOUSE">WAREHOUSE</option>
        <option value="HQ">HQ</option>
      </select>
      <Input
        placeholder="住所"
        value={form.address}
        onChange={(event) => setForm({ ...form, address: event.target.value })}
      />
      <Button type="submit">拠点追加</Button>
    </form>
  );
}
