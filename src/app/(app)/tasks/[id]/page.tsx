"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getHiddenTestCount,
  getRubricTotal,
  getTaskById,
  getVisibleTestCount,
  type TaskDifficulty,
} from "@/lib/tasks/data";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCode,
  ListChecks,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const difficultyColors: Record<TaskDifficulty, string> = {
  Beginner: "bg-success-light text-success",
  Intermediate: "bg-warning-light text-warning",
  Advanced: "bg-error-light text-error",
};

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="max-w-xl space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-text">Task not found</h1>
          <p className="mt-1 text-sm text-text-secondary">
            This task may have been moved, archived, or removed from the library.
          </p>
        </div>
        <Link href="/tasks">
          <Button variant="secondary">Back to task library</Button>
        </Link>
      </div>
    );
  }

  const rubricTotal = getRubricTotal(task);
  const visibleTestCount = getVisibleTestCount(task);
  const hiddenTestCount = getHiddenTestCount(task);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href="/tasks" className="hover:text-text transition-colors">
            Tasks
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{task.title}</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="outline">{task.category}</Badge>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs font-medium",
                  difficultyColors[task.difficulty]
                )}
              >
                {task.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                <Clock className="h-3 w-3" />
                {task.estimatedMinutes} min
              </span>
            </div>
            <h1 className="text-xl font-semibold text-text">{task.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{task.summary}</p>
          </div>

          <Link href="/workspace">
            <Button>
              Start task
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {task.skills.map((skill) => (
          <Badge key={skill} variant="accent">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-text-secondary" />
              <CardTitle>Task instructions</CardTitle>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary">
              {task.instructions.map((instruction) => (
                <p key={instruction}>{instruction}</p>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-text-secondary" />
              <CardTitle>Expected behavior</CardTitle>
            </div>
            <ul className="space-y-2">
              {task.expectedBehavior.map((behavior) => (
                <li key={behavior} className="flex gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{behavior}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-text-secondary" />
              <CardTitle>Starter files</CardTitle>
            </div>
            <div className="space-y-2">
              {task.starterFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-gray-50">
                    <FileCode className="h-4 w-4 text-text-tertiary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs font-medium text-text">{file.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {file.lines} lines / {file.language}
                    </p>
                  </div>
                  <Badge variant={file.role === "Visible test" ? "accent" : "outline"}>
                    {file.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-text-secondary" />
              <CardTitle>Rubric preview</CardTitle>
            </div>
            <p className="mb-4 text-xs text-text-secondary">Total: {rubricTotal} points</p>
            <div className="space-y-4">
              {task.rubric.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-text">{item.label}</span>
                    <span className="text-xs font-semibold tabular-nums text-text">
                      {item.points} pts
                    </span>
                  </div>
                  <p className="mb-2 text-xs leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                  <Progress value={item.points} max={rubricTotal} color="accent" size="sm" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Test visibility</CardTitle>
            <p className="mt-1 text-xs text-text-secondary">
              {visibleTestCount} visible test{visibleTestCount !== 1 ? "s" : ""} and{" "}
              {hiddenTestCount} hidden test{hiddenTestCount !== 1 ? "s" : ""}.
            </p>
            <div className="mt-4 space-y-2">
              {task.tests.map((test) => (
                <div key={test.name} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-xs font-medium text-text">{test.name}</p>
                    <Badge variant={test.visibility === "hidden" ? "default" : "success"}>
                      {test.visibility === "hidden" ? "Hidden" : "Visible"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
                    {test.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Link href="/workspace">
            <Button size="lg" className="w-full">
              Open workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
