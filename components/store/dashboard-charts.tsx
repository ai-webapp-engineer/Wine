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

export type StoreChartData = {
  salesTrend: Array<{ day: string; POS販売: number; 入荷: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  orderTrend: Array<{ day: string; 発注: number }>;
  inventoryByCategory: Array<{ category: string; quantity: number }>;
  lowStockItems: Array<{ name: string; quantity: number; minStock: number; gap: number }>;
  pendingReceiving: number;
  openOrders: number;
};

export function StoreDashboardCharts({ data }: { data: StoreChartData }) {
  return (
    <div className={DASHBOARD_CHART_GRID_CLASS}>
      <Card>
        <CardTitle className="mb-4">入荷待ち</CardTitle>
        <div className="flex h-[300px] flex-col items-center justify-center">
          <p className="text-5xl font-bold text-blue-700">{data.pendingReceiving}</p>
          <p className="mt-2 text-sm text-stone-500">出荷済・未入荷（件）</p>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">進行中発注</CardTitle>
        <div className="flex h-[300px] flex-col items-center justify-center">
          <p className="text-5xl font-bold text-wine-800">{data.openOrders}</p>
          <p className="mt-2 text-sm text-stone-500">送信済〜出荷済</p>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">発注ステータス</CardTitle>
        {data.ordersByStatus.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">発注データがありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <PieChart>
              <Pie
                data={data.ordersByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.ordersByStatus.map((_, i) => (
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
        <CardTitle className="mb-4">販売・入荷推移（7日間）</CardTitle>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.salesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="POS販売" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="入荷" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardTitle className="mb-4">発注件数推移（7日間）</CardTitle>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.orderTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="発注" stroke={CHART_COLORS.wine} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
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
          <CardTitle className="mb-4">要補充SKU（不足量順）</CardTitle>
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
