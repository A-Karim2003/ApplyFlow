"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "./dashboard-card";
import { ACCENT, EmptyChart } from "./chart-shared";

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

const TOOLTIP_STYLE = {
  background: "var(--card)",
  color: "var(--card-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export type TimelinePoint = { label: string; count: number };

type TimelineChartProps = {
  points: TimelinePoint[];
  unit: "week" | "month";
};

export function TimelineChart({ points, unit }: TimelineChartProps) {
  const isEmpty = points.every((point) => point.count === 0);

  return (
    <DashboardCard
      title="Applications over time"
      description={`Applications added per ${unit}`}
    >
      {isEmpty ? (
        <EmptyChart />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={AXIS_TICK}
              />
              <YAxis
                width={32}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={AXIS_TICK}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#timelineFill)"
                dot={{ r: 3, fill: ACCENT }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}
