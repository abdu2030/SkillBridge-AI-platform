"use client";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface SkillChartPoint {
  skill: string;
  score: number;
}

const fallbackData: SkillChartPoint[] = [
  { skill: "Python", score: 88 },
  { skill: "Docker", score: 64 },
  { skill: "Git", score: 75 },
  { skill: "Review", score: 91 },
  { skill: "Security", score: 58 },
  { skill: "DB", score: 72 },
];

interface SkillChartProps {
  data?: SkillChartPoint[];
}

export function SkillChart({ data = fallbackData }: SkillChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Radar dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
