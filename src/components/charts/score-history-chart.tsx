"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScoreHistoryPoint } from "@/lib/progress/types";

interface ScoreHistoryChartProps {
  data: ScoreHistoryPoint[];
}

export function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Reviewer score"]}
          contentStyle={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
