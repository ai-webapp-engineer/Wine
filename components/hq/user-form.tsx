"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UserForm({
  locations,
}: {
  locations: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "STORE_STAFF",
    locationId: locations[0]?.id ?? "",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-5">
      <Input
        placeholder="名前"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="メール"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="パスワード"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        required
      />
      <select
        className="h-10 rounded-lg border border-stone-300 px-3 text-sm"
        value={form.role}
        onChange={(event) => setForm({ ...form, role: event.target.value })}
      >
        <option value="STORE_STAFF">店舗スタッフ</option>
        <option value="STORE_MANAGER">店舗管理者</option>
        <option value="WAREHOUSE_STAFF">倉庫担当</option>
        <option value="WAREHOUSE_MANAGER">倉庫管理者</option>
        <option value="HQ_STAFF">本部スタッフ</option>
        <option value="HQ_ADMIN">本部管理者</option>
      </select>
      <Button type="submit">ユーザー追加</Button>
    </form>
  );
}
