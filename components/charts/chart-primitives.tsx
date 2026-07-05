export const CHART_COLORS = {
  wine: "#7f1d1d",
  wineLight: "#b91c1c",
  stone: "#78716c",
  amber: "#b45309",
  green: "#059669",
  blue: "#2563eb",
} as const;

export const PIE_COLORS = [
  CHART_COLORS.wine,
  CHART_COLORS.wineLight,
  CHART_COLORS.amber,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.stone,
  "#9333ea",
  "#0891b2",
];

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-md">
      {label ? <p className="mb-1 font-medium text-stone-900">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function formatDayKey(date: Date): string {
  return date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export function last7DayKeys(): string[] {
  const keys: string[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    keys.push(formatDayKey(d));
  }
  return keys;
}

export function emptyMovementTrend() {
  return last7DayKeys().map((day) => ({ day, 入庫: 0, 出庫: 0 }));
}
