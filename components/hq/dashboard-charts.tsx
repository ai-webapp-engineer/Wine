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

export type HqChartData = {
  inventoryByLocation: Array<{ name: string; quantity: number }>;
  lowStockByLocation: Array<{ name: string; count: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  movementTrend: Array<{ day: string; 入庫: number; 出庫: number; POS販売: number }>;
  orderTrend: Array<{ day: string; 発注: number }>;
  storeOrderVolume: Array<{ store: string; count: number }>;
  inventoryByCategory: Array<{ category: string; quantity: number }>;
  stockHealthRate: number;
  lowStockSkus: number;
};

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardTitle className="mb-4">{title}</CardTitle>
      {children}
    </Card>
  );
}

export function HqDashboardCharts({ data }: { data: HqChartData }) {
  return (
    <div className={DASHBOARD_CHART_GRID_CLASS}>
      <ChartCard title="拠点別在庫">
        {data.inventoryByLocation.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart data={data.inventoryByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="quantity" name="在庫数" fill={CHART_COLORS.wine} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="拠点別低在庫SKU">
        {data.lowStockByLocation.length === 0 ? (
          <Empty message="低在庫の拠点はありません" />
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart data={data.lowStockByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="低在庫SKU" fill={CHART_COLORS.amber} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="在庫健全率">
        <div className="flex h-[300px] flex-col items-center justify-center">
          <p className="text-5xl font-bold text-wine-800">{data.stockHealthRate}%</p>
          <p className="mt-2 text-sm text-stone-500">
            全社 {data.lowStockSkus} SKU が最低在庫以下
          </p>
        </div>
      </ChartCard>

      <ChartCard title="発注ステータス">
        {data.ordersByStatus.length === 0 ? (
          <Empty />
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
      </ChartCard>

      <ChartCard title="発注件数推移（7日間）">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.orderTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="発注" stroke={CHART_COLORS.blue} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="店舗別発注量（7日間）">
        {data.storeOrderVolume.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart data={data.storeOrderVolume} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} allowDecimals={false} />
              <YAxis type="category" dataKey="store" width={100} tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="発注件数" fill={CHART_COLORS.wineLight} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="入出庫・POS推移（7日間）" className="xl:col-span-2">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.movementTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.stone }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="入庫" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="出庫" stroke={CHART_COLORS.wine} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="POS販売" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="カテゴリ別在庫">
        {data.inventoryByCategory.length === 0 ? (
          <Empty />
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
      </ChartCard>
    </div>
  );
}

function Empty({ message = "データがありません" }: { message?: string }) {
  return <p className="py-16 text-center text-sm text-stone-500">{message}</p>;
}
