"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import type { DashboardProgressData } from "@/lib/progress/types";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const WeeklyChart = dynamic(
  () => import("@/components/charts/weekly-chart").then((module) => module.WeeklyChart),
  { ssr: false }
);
const SkillChart = dynamic(
  () => import("@/components/charts/skill-chart").then((module) => module.SkillChart),
  { ssr: false }
);
const CategoryPerformanceChart = dynamic(
  () =>
    import("@/components/charts/category-performance-chart").then(
      (module) => module.CategoryPerformanceChart
    ),
  { ssr: false }
);
const ScoreHistoryChart = dynamic(
  () =>
    import("@/components/charts/score-history-chart").then((module) => module.ScoreHistoryChart),
  { ssr: false }
);

interface DashboardContentProps {
  dashboard: DashboardProgressData;
  firstName: string;
}

function getScoreColor(score: number): "success" | "accent" | "warning" {
  if (score >= 80) return "success";
  if (score >= 60) return "accent";
  return "warning";
}

function getStatusBadge(status: string): "success" | "accent" | "warning" | "default" {
  const normalized = status.toLowerCase();
  if (normalized === "approved") return "success";
  if (normalized === "reviewed") return "accent";
  if (normalized === "rejected" || normalized.includes("needs")) return "warning";
  return "default";
}

export function DashboardContent({ dashboard, firstName }: DashboardContentProps) {
  const recentSubmissions = dashboard.recentSubmissions;
  const skillRows = dashboard.categoryPerformance;
  const lastSubmission = recentSubmissions[0]?.time;
  const hasCategoryData = skillRows.some((item) => item.completedCount > 0);
  const hasScoreHistory = dashboard.scoreHistory.length > 0;

  const stats = [
    {
      label: "Completed tasks",
      value: `${dashboard.completedTasks}`,
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      label: "Average score",
      value: `${dashboard.averageScore}%`,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "Strongest skill",
      value: dashboard.strongestSkill,
      icon: Star,
      color: "text-accent",
    },
    {
      label: "Weakest skill",
      value: dashboard.weakestSkill,
      icon: AlertCircle,
      color: "text-warning",
    },
    {
      label: "Current streak",
      value: `${dashboard.currentStreak} ${dashboard.currentStreak === 1 ? "day" : "days"}`,
      icon: Flame,
      color: "text-warning",
    },
    {
      label: "Feedback pending",
      value: `${dashboard.pendingFeedback}`,
      icon: MessageSquare,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Dashboard</h1>
        <p className="mt-0.5 text-sm text-text-secondary">
          Welcome back, {firstName}.{" "}
          {lastSubmission ? `Last submission: ${lastSubmission}.` : "Your progress starts here."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex min-h-20 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-text-secondary">{stat.label}</p>
                <p className="mt-1 truncate text-lg font-semibold text-text">{stat.value}</p>
              </div>
              <stat.icon className={`mt-0.5 h-4 w-4 shrink-0 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Weekly activity</CardTitle>
          <CardDescription>Reviewed tasks completed per day this week</CardDescription>
          <div className="mt-4">
            <WeeklyChart data={dashboard.weeklyActivity} />
          </div>
        </Card>

        <Card>
          <CardTitle>Skill breakdown</CardTitle>
          <CardDescription>Your average reviewer score by skill</CardDescription>
          {hasCategoryData ? (
            <div className="mt-2">
              <SkillChart data={skillRows} />
            </div>
          ) : (
            <EmptyState
              icon={<TrendingUp className="h-6 w-6" />}
              title="No skill scores yet"
              description="Skill charts appear after a reviewer scores your submissions."
            />
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Category performance</CardTitle>
          <CardDescription>Average score and completed count by category</CardDescription>
          {hasCategoryData ? (
            <div className="mt-4">
              <CategoryPerformanceChart data={skillRows} />
            </div>
          ) : (
            <EmptyState
              icon={<Star className="h-6 w-6" />}
              title="No reviewed categories yet"
              description="Complete and review tasks to compare your strongest areas."
            />
          )}
        </Card>

        <Card>
          <CardTitle>Score history</CardTitle>
          <CardDescription>Your latest reviewer scores over time</CardDescription>
          {hasScoreHistory ? (
            <div className="mt-4">
              <ScoreHistoryChart data={dashboard.scoreHistory} />
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-6 w-6" />}
              title="No score history yet"
              description="Reviewer scores will build a trend once submissions are reviewed."
            />
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardTitle>Recommended next task</CardTitle>
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-text">Build your weakest skill</p>
            <p className="text-xs text-text-secondary">
              Pick a task in {dashboard.weakestSkill} to improve your profile and unlock more
              badges.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{dashboard.weakestSkill}</Badge>
              <Badge variant="outline">Recommended</Badge>
              <span className="flex items-center gap-1 text-xs text-text-tertiary">
                <Clock className="h-3 w-3" /> 30 min
              </span>
            </div>
            <Link href="/tasks">
              <Button size="sm" className="mt-1">
                Browse tasks <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Recent submissions</CardTitle>
            <Link href="/submissions" className="text-xs font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text">{submission.task}</p>
                    <p className="mt-0.5 text-xs text-text-tertiary">{submission.time}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums text-text">
                      {submission.score !== null ? `${submission.score}%` : "Pending"}
                    </span>
                    <Badge variant={getStatusBadge(submission.status)}>{submission.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-6 w-6" />}
              title="No submissions yet"
              description="Start a task and submit your first solution to see feedback here."
              action={
                <Link href="/tasks">
                  <Button size="sm" variant="secondary">
                    Browse tasks
                  </Button>
                </Link>
              }
            />
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>Skill progress</CardTitle>
        <CardDescription>Your average scores by category</CardDescription>
        {hasCategoryData ? (
          <div className="mt-4 space-y-4">
            {skillRows.map((skill) => (
              <div key={skill.skill}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-sm text-text">{skill.skill}</span>
                  <span className="text-xs font-medium tabular-nums text-text-secondary">
                    {skill.score}% · {skill.completedCount} completed
                  </span>
                </div>
                <Progress value={skill.score} color={getScoreColor(skill.score)} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<TrendingUp className="h-6 w-6" />}
            title="No skill data yet"
            description="Skill progress appears after your first reviewed submission."
          />
        )}
      </Card>
    </div>
  );
}
