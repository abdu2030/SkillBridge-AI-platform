"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CategoryPerformancePoint {
  skill: string;
  score: number;
  completedCount: number;
}

interface CategoryPerformanceChartProps {
  data: CategoryPerformancePoint[];
}

export function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={22} layout="vertical" margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
        <XAxis
          type="number"
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
        />
        <YAxis
          type="category"
          dataKey="skill"
          width={88}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <Tooltip
          formatter={(value, name, item) => [
            `${value}% from ${item.payload.completedCount} completed`,
            "Average score",
          ]}
          contentStyle={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="score" fill="#0f766e" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
