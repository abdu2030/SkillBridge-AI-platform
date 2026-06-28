"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SkillChart } from "@/components/charts/skill-chart";
import { Globe, Star, CheckCircle2, ExternalLink, Copy, Award } from "lucide-react";
import { useState } from "react";

const skills = [
  { skill: "Python Debugging", score: 88, tasks: 6 },
  { skill: "Code Review", score: 91, tasks: 4 },
  { skill: "Git Workflows", score: 82, tasks: 2 },
  { skill: "Docker", score: 76, tasks: 3 },
  { skill: "Security", score: 68, tasks: 2 },
  { skill: "Database", score: 72, tasks: 1 },
];

const approvedTasks = [
  {
    title: "Debug async Python request handler",
    category: "Python Debugging",
    score: 91,
    date: "Mar 15, 2025",
    reviewerComment:
      "Clean solution with proper error handling. Good use of async context managers.",
  },
  {
    title: "Fix broken Python CSV parser",
    category: "Python Debugging",
    score: 88,
    date: "Mar 12, 2025",
    reviewerComment:
      "Handles all edge cases including BOM and mixed line endings. Well documented.",
  },
  {
    title: "Resolve Git rebase conflict",
    category: "Git Workflows",
    score: 95,
    date: "Mar 10, 2025",
    reviewerComment: "Perfect conflict resolution. Clear commit messages and clean history.",
  },
  {
    title: "Review AI-generated Dockerfile",
    category: "Code Review",
    score: 91,
    date: "Mar 8, 2025",
    reviewerComment:
      "Thorough review catching all security issues. Good suggestions for multi-stage builds.",
  },
  {
    title: "Fix Docker multi-stage build",
    category: "Docker",
    score: 84,
    date: "Mar 5, 2025",
    reviewerComment:
      "Good optimization of the final image size. Consider using distroless for production.",
  },
];

export default function PortfolioPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://skillbridge.ai/u/janedoe");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Portfolio</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Your public developer portfolio. Share it with employers and clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Button size="sm">
            <ExternalLink className="w-3.5 h-3.5" />
            View public page
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-accent">JD</span>
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-text">Jane Doe</h2>
            <p className="text-sm text-text-secondary mt-1">
              Full-stack developer specializing in Python and cloud infrastructure. Building
              reliable software with clean code and thorough testing.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <a
                href="#"
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
              >
                <GitHubIcon /> github.com/janedoe
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> janedoe.dev
              </a>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-accent" /> 14 approved tasks
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-accent" /> Reviewer verified
              </span>
              <span className="flex items-center gap-1">
                <TrendingAvg /> Avg score: 85%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Skill Badges & Chart */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Skill scores</CardTitle>
          <div className="mt-4 space-y-3">
            {skills.map((s) => (
              <div key={s.skill}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text">{s.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">{s.tasks} tasks</span>
                    <span className="text-xs font-semibold text-text tabular-nums">{s.score}%</span>
                  </div>
                </div>
                <Progress
                  value={s.score}
                  color={s.score >= 85 ? "success" : s.score >= 70 ? "accent" : "warning"}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Skill distribution</CardTitle>
          <SkillChart />
        </Card>
      </div>

      {/* Approved Tasks */}
      <div>
        <h2 className="text-sm font-semibold text-text mb-4">Approved submissions</h2>
        <div className="space-y-3">
          {approvedTasks.map((task) => (
            <Card key={task.title} padding="md">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-text">{task.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-text tabular-nums">{task.score}</span>
                      <Badge variant="success">Approved</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-text-tertiary">
                    <Badge variant="outline">{task.category}</Badge>
                    <span>{task.date}</span>
                  </div>
                  {task.reviewerComment && (
                    <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg border-l-2 border-accent">
                      <p className="text-xs text-text-secondary italic">
                        &ldquo;{task.reviewerComment}&rdquo;
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">— Reviewer</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TrendingAvg() {
  return (
    <svg
      className="w-3.5 h-3.5 text-accent"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
