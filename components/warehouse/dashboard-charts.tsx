"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_COLORS,
  ChartTooltip,
  PIE_COLORS,
} from "@/components/charts/chart-primitives";
import { Card, CardTitle } from "@/components/ui/card";
import { CHART_HEIGHT, DASHBOARD_CHART_GRID_CLASS } from "@/lib/layout";

export type WarehouseChartData = {
  movementTrend: Array<{ day: string; 入庫: number; 出庫: number }>;
  shippedTrend: Array<{ day: string; 出荷: number }>;
  pendingByStore: Array<{ store: string; units: number }>;
  orderQueue: Array<{ status: string; count: number }>;
  inventoryByCategory: Array<{ category: string; quantity: number }>;
  lowStockItems: Array<{ name: string; quantity: number; minStock: number }>;
  todayInbound: number;
  todayOutbound: number;
  pendingOrderCount: number;
};

export function WarehouseDashboardCharts({ data }: { data: WarehouseChartData }) {
  return (
    <div className={DASHBOARD_CHART_GRID_CLASS}>
      <Card>
        <CardTitle className="mb-4">本日の入出庫</CardTitle>
        <div className="grid grid-cols-2 gap-4 py-8">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-xs text-stone-600">入庫</p>
            <p className="text-3xl font-bold text-green-700">{data.todayInbound}</p>
          </div>
          <div className="rounded-lg bg-wine-50 p-4 text-center">
            <p className="text-xs text-stone-600">出庫</p>
            <p className="text-3xl font-bold text-wine-800">{data.todayOutbound}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">ピッキング負荷</CardTitle>
        <div className="flex h-[300px] flex-col items-center justify-center">
          <p className="text-5xl font-bold text-amber-700">{data.pendingOrderCount}</p>
          <p className="mt-2 text-sm text-stone-500">未処理発注（件）</p>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">処理キュー</CardTitle>
        {data.orderQueue.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">未処理の発注はありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <PieChart>
              <Pie
                data={data.orderQueue}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.orderQueue.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="xl:col-span-2">
        <CardTitle className="mb-4">入出庫推移（7日間）</CardTitle>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.movementTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="入庫" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="出庫" stroke={CHART_COLORS.wine} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardTitle className="mb-4">出荷件数推移（7日間）</CardTitle>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.shippedTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="出荷" stroke={CHART_COLORS.blue} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardTitle className="mb-4">店舗別ピッキング待ち</CardTitle>
        {data.pendingByStore.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">ピッキング待ちはありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart data={data.pendingByStore}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="store" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="units" name="数量" fill={CHART_COLORS.amber} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card>
        <CardTitle className="mb-4">カテゴリ別在庫</CardTitle>
        {data.inventoryByCategory.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">在庫データがありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart data={data.inventoryByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <YAxis type="category" dataKey="category" width={72} tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="quantity" name="在庫数" fill={CHART_COLORS.wineLight} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {data.lowStockItems.length > 0 ? (
        <Card className="xl:col-span-3">
          <CardTitle className="mb-4">要補充SKU（最低在庫以下）</CardTitle>
          <ResponsiveContainer width="100%" height={Math.max(180, data.lowStockItems.length * 40)}>
            <BarChart data={data.lowStockItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="quantity" name="現在庫" fill={CHART_COLORS.wine} radius={[0, 4, 4, 0]} />
              <Bar dataKey="minStock" name="最低在庫" fill={CHART_COLORS.stone} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : null}
    </div>
  );
}
