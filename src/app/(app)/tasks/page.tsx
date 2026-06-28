"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  taskCategories,
  taskDifficulties,
  tasks,
  type TaskDifficulty,
  type TaskStatus,
} from "@/lib/tasks/data";
import { cn } from "@/lib/utils";
import { Clock, Filter, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const difficultyColors: Record<TaskDifficulty, string> = {
  Beginner: "bg-success-light text-success",
  Intermediate: "bg-warning-light text-warning",
  Advanced: "bg-error-light text-error",
};

const statusConfig: Record<
  TaskStatus,
  { variant: "default" | "success" | "warning" | "accent"; label: string; action: string }
> = {
  "Not started": { variant: "default", label: "Not started", action: "Start task" },
  "In progress": { variant: "accent", label: "In progress", action: "Continue" },
  Submitted: { variant: "warning", label: "Submitted", action: "View submission" },
  Approved: { variant: "success", label: "Approved", action: "View submission" },
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<(typeof taskDifficulties)[number]>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const searchable = [task.title, task.summary, task.category, task.difficulty, ...task.skills]
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (category !== "All" && task.category !== category) return false;
      if (difficulty !== "All" && task.difficulty !== difficulty) return false;
      return true;
    });
  }, [category, difficulty, search]);

  const activeFilterCount = (category !== "All" ? 1 : 0) + (difficulty !== "All" ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setDifficulty("All");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Task library</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Browse {tasks.length} real-world engineering tasks across {taskCategories.length - 1}{" "}
            categories.
          </p>
        </div>
        <p className="text-xs text-text-tertiary">
          {filtered.length} task{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            aria-label="Search tasks"
            placeholder="Search tasks, skills, or categories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant={showFilters ? "primary" : "secondary"}
          onClick={() => setShowFilters((value) => !value)}
          className="sm:w-auto"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card padding="md">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {taskCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      category === item
                        ? "bg-accent text-white"
                        : "bg-gray-50 text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Difficulty</p>
              <div className="flex flex-wrap gap-1.5">
                {taskDifficulties.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDifficulty(item)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      difficulty === item
                        ? "bg-accent text-white"
                        : "bg-gray-50 text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {(activeFilterCount > 0 || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text"
              >
                <X className="h-3 w-3" />
                Clear all filters
              </button>
            )}
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((task) => (
          <Card
            key={task.id}
            padding="none"
            className="flex min-h-[320px] flex-col hover:border-border-strong transition-colors"
          >
            <div className="flex flex-1 flex-col space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold leading-snug text-text">{task.title}</h2>
                <Badge variant={statusConfig[task.status].variant} className="shrink-0">
                  {statusConfig[task.status].label}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                <span>{task.category}</span>
                <span aria-hidden="true">/</span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-xs font-medium",
                    difficultyColors[task.difficulty]
                  )}
                >
                  {task.difficulty}
                </span>
                <span aria-hidden="true">/</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.estimatedMinutes} min
                </span>
              </div>

              <p className="text-sm leading-relaxed text-text-secondary">{task.summary}</p>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {task.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
                {task.skills.length > 4 && (
                  <Badge variant="default">+{task.skills.length - 4}</Badge>
                )}
              </div>
            </div>

            <div className="border-t border-border px-5 py-3">
              <Link href={`/tasks/${task.id}`}>
                <Button
                  size="sm"
                  variant={task.status === "In progress" ? "primary" : "secondary"}
                  className="w-full"
                >
                  {statusConfig[task.status].action}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-text">No tasks match your filters</p>
          <p className="mt-1 text-sm text-text-secondary">
            Try a different keyword, category, or difficulty level.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-sm text-accent hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
