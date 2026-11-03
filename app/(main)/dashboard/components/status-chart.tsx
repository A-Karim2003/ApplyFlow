"use client";

import {
  Bar,
  BarChart,
  BarShapeProps,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "./dashboard-card";
import { EmptyChart } from "./chart-shared";

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

const TOOLTIP_STYLE = {
  background: "var(--card)",
  color: "var(--card-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

type StatusPoint = { label: string; count: number; colour: string };

export function StatusChart({ data }: { data: StatusPoint[] }) {
  const isEmpty = data.every((d) => d.count === 0);

  return (
    <DashboardCard
      title="Applications by status"
      description="Where every opportunity sits in your pipeline"
    >
      {isEmpty ? (
        <EmptyChart />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 2, left: 2, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={AXIS_TICK}
              />
              <YAxis
                width={"auto"}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={AXIS_TICK}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: "var(--card-foreground)" }}
                labelStyle={{ color: "var(--card-foreground)" }}
              />
              <Bar
                dataKey="count"
                name="Applications"
                radius={[6, 6, 0, 0]}
                shape={StatusBar}
                maxBarSize={56}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}

function StatusBar(props: BarShapeProps) {
  const colour = props.payload.colour;
  return <Rectangle {...props} fill={colour} />;
}
