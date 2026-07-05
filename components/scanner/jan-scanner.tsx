"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatErrorMessage, MSG } from "@/lib/messages/ja";

type ScanResult = {
  janCode: string;
  productName?: string;
  quantity: number;
};

type JanScannerProps = {
  onSubmit: (payload: { janCode: string; quantity: number }) => Promise<void>;
  mode?: "inbound" | "outbound";
};

export function JanScanner({ onSubmit, mode = "inbound" }: JanScannerProps) {
  const [janCode, setJanCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!janCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({ janCode: janCode.trim(), quantity });
      setHistory((prev) => [
        { janCode: janCode.trim(), quantity, productName: undefined },
        ...prev.slice(0, 9),
      ]);
      setJanCode("");
      setQuantity(1);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(50);
      }
    } catch (submitError) {
      setError(formatErrorMessage(submitError, MSG.REGISTER_FAILED));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">JANコード</label>
          <Input
            autoFocus
            value={janCode}
            onChange={(event) => setJanCode(event.target.value)}
            placeholder="スキャンまたは入力"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">数量</label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          {loading ? "処理中..." : mode === "inbound" ? "入庫登録" : "出庫登録"}
        </Button>
      </form>

      {history.length > 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-stone-700">直近スキャン</p>
          <ul className="space-y-2 text-sm text-stone-600">
            {history.map((item, index) => (
              <li key={`${item.janCode}-${index}`} className="flex justify-between">
                <span>{item.janCode}</span>
                <span>x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
