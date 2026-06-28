import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  color?: "accent" | "success" | "warning" | "error";
  className?: string;
  showLabel?: boolean;
}

const colors = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export function Progress({
  value,
  max = 100,
  size = "md",
  color = "accent",
  className,
  showLabel,
}: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-gray-100 overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary tabular-nums">{percentage}%</span>
      )}
    </div>
  );
}
