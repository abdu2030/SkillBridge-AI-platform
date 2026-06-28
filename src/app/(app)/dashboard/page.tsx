"use client";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { SkillChart } from "@/components/charts/skill-chart";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  CheckCircle2,
  TrendingUp,
  Flame,
  Star,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Completed tasks", value: "12", icon: CheckCircle2, color: "text-success" },
  { label: "Average score", value: "84%", icon: TrendingUp, color: "text-accent" },
  { label: "Current streak", value: "5 days", icon: Flame, color: "text-warning" },
  { label: "Strongest skill", value: "Python Debugging", icon: Star, color: "text-accent" },
  { label: "Needs work", value: "Docker Security", icon: AlertCircle, color: "text-error" },
  { label: "Feedback pending", value: "2", icon: MessageSquare, color: "text-warning" },
];

const recentSubmissions = [
  { task: "Fix broken Python CSV parser", score: 84, status: "Reviewed", time: "42 minutes ago" },
  { task: "Debug async request handler", score: 91, status: "Approved", time: "2 hours ago" },
  {
    task: "Review AI-generated Dockerfile",
    score: 72,
    status: "Needs improvement",
    time: "1 day ago",
  },
];

const skillProgress = [
  { skill: "Python Debugging", score: 88 },
  { skill: "Code Review", score: 91 },
  { skill: "Git Workflows", score: 82 },
  { skill: "Docker", score: 64 },
  { skill: "Security", score: 58 },
  { skill: "Database", score: 72 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Welcome back, Jane. Last submission: 42 minutes ago.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-secondary">{stat.label}</p>
                <p className="text-lg font-semibold text-text mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-4 h-4 ${stat.color} mt-0.5`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Weekly activity</CardTitle>
          <CardDescription>Tasks completed per day this week</CardDescription>
          <div className="mt-4">
            <WeeklyChart />
          </div>
        </Card>
        <Card>
          <CardTitle>Skill breakdown</CardTitle>
          <CardDescription>Your performance across categories</CardDescription>
          <div className="mt-2">
            <SkillChart />
          </div>
        </Card>
      </div>

      {/* Recommended Task + Recent Submissions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardTitle>Recommended next task</CardTitle>
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-text">Fix Docker multi-stage build</p>
            <p className="text-xs text-text-secondary">
              The Dockerfile builds locally but fails in CI. Fix the multi-stage build configuration
              and reduce image size.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Docker</Badge>
              <Badge variant="outline">Intermediate</Badge>
              <span className="flex items-center gap-1 text-xs text-text-tertiary">
                <Clock className="w-3 h-3" /> 30 min
              </span>
            </div>
            <Link href="/tasks/docker-multistage">
              <Button size="sm" className="mt-1">
                Start task <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent submissions</CardTitle>
            <Link href="/submissions" className="text-xs text-accent hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub.task}
                  className="flex items-center gap-4 text-sm p-3 rounded-lg border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text truncate">{sub.task}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{sub.time}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-text tabular-nums">
                      {sub.score}
                    </span>
                    <Badge
                      variant={
                        sub.status === "Approved"
                          ? "success"
                          : sub.status === "Reviewed"
                            ? "accent"
                            : "warning"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquare className="w-6 h-6" />}
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

      {/* Skill Progress */}
      <Card>
        <CardTitle>Skill progress</CardTitle>
        <CardDescription>Your average scores by category</CardDescription>
        {skillProgress.length > 0 ? (
          <div className="mt-4 space-y-4">
            {skillProgress.map((s) => (
              <div key={s.skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text">{s.skill}</span>
                  <span className="text-xs font-medium text-text-secondary tabular-nums">
                    {s.score}%
                  </span>
                </div>
                <Progress
                  value={s.score}
                  color={s.score >= 80 ? "success" : s.score >= 60 ? "accent" : "warning"}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<TrendingUp className="w-6 h-6" />}
            title="No skill data yet"
            description="Skill progress appears after your first reviewed submission."
          />
        )}
      </Card>
    </div>
  );
}
