"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

const submissions = [
  {
    id: "1",
    task: "Fix broken Python CSV parser",
    category: "Python",
    score: 84,
    status: "Reviewed" as const,
    time: "42 minutes ago",
    feedback: true,
  },
  {
    id: "2",
    task: "Debug async request handler",
    category: "Python",
    score: 91,
    status: "Approved" as const,
    time: "2 hours ago",
    feedback: true,
  },
  {
    id: "3",
    task: "Review AI-generated Dockerfile",
    category: "Code Review",
    score: 72,
    status: "Needs improvement" as const,
    time: "1 day ago",
    feedback: true,
  },
  {
    id: "4",
    task: "Resolve Git rebase conflict",
    category: "Git",
    score: 95,
    status: "Approved" as const,
    time: "3 days ago",
    feedback: true,
  },
  {
    id: "5",
    task: "Fix Docker multi-stage build",
    category: "Docker",
    score: null,
    status: "Pending" as const,
    time: "4 days ago",
    feedback: false,
  },
];

const statusBadge: Record<string, "success" | "accent" | "warning" | "default"> = {
  Approved: "success",
  Reviewed: "accent",
  "Needs improvement": "warning",
  Pending: "default",
};

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Submissions</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Your submitted solutions and their review status.
        </p>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                  Task
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                  Score
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden md:table-cell">
                  Submitted
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-secondary">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-text">{sub.task}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-text-secondary text-xs">{sub.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    {sub.score ? (
                      <span className="font-semibold text-text tabular-nums">{sub.score}</span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={statusBadge[sub.status] || "default"}>{sub.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-text-tertiary hidden md:table-cell">
                    {sub.time}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {sub.feedback ? (
                      <Link href="/feedback">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Feedback
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-text-tertiary">Pending review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
