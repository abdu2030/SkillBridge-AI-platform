"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { SubmissionResult } from "@/lib/submissions/data";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  FileCode,
  MessageSquare,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusBadge: Record<
  SubmissionResult["status"],
  "success" | "accent" | "warning" | "default"
> = {
  Approved: "success",
  Reviewed: "accent",
  "Needs improvement": "warning",
  Pending: "default",
};

const statusCopy: Record<SubmissionResult["status"], string> = {
  Approved: "Accepted and complete",
  Reviewed: "Reviewed with feedback",
  "Needs improvement": "Needs another pass",
  Pending: "Waiting for review",
};

export function SubmissionResultClient({ submission }: { submission: SubmissionResult }) {
  const [activeFilePath, setActiveFilePath] = useState(submission.files[0]?.path ?? "");
  const activeFile = useMemo(
    () => submission.files.find((file) => file.path === activeFilePath) ?? submission.files[0],
    [activeFilePath, submission.files]
  );

  const earnedPoints = submission.rubricPreview.reduce((total, item) => total + item.points, 0);
  const maxPoints = submission.rubricPreview.reduce((total, item) => total + item.maxPoints, 0);

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href="/submissions" className="hover:text-text transition-colors">
            Submissions
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{submission.task}</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant={statusBadge[submission.status]}>{submission.status}</Badge>
              <Badge variant="outline">Attempt {submission.attempt}</Badge>
              <Badge variant="outline">{submission.category}</Badge>
            </div>
            <h1 className="text-xl font-semibold text-text">{submission.task}</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{submission.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/submissions">
              <Button variant="secondary">Back to submissions</Button>
            </Link>
            <Link href="/tasks">
              <Button>
                Browse tasks
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Status</p>
            <p className="text-sm font-semibold text-text">{statusCopy[submission.status]}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-light text-success">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Score</p>
            <p className="text-sm font-semibold text-text">
              {submission.score === null ? "Pending" : `${submission.score}%`}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-light text-warning">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Rubric points</p>
            <p className="text-sm font-semibold text-text">
              {submission.feedbackReady ? `${earnedPoints}/${maxPoints}` : "Pending"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Submitted</p>
            <p className="text-sm font-semibold text-text">{submission.submittedAt}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card padding="none" className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Submitted code</CardTitle>
              <CardDescription>
                Read-only snapshot from attempt {submission.attempt}.
              </CardDescription>
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {submission.files.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setActiveFilePath(file.path)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    activeFile?.path === file.path
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text"
                  )}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  {file.path}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[360px] bg-[#111827]">
            {activeFile ? (
              <pre className="max-h-[560px] min-h-[360px] overflow-auto p-4 text-sm leading-6 text-gray-100">
                <code>{activeFile.content}</code>
              </pre>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
                No submitted files were found.
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>
                  {submission.feedbackReady
                    ? `Reviewed by ${submission.reviewedBy}.`
                    : "Detailed feedback will appear after review."}
                </CardDescription>
              </div>
            </div>

            {submission.feedbackReady ? (
              <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm leading-relaxed text-text-secondary">
                Placeholder feedback area ready for AI and reviewer notes. The next step can connect
                this panel to generated comments, test failures, and reviewer decisions.
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-surface px-3 py-6 text-center">
                <p className="text-sm font-medium text-text">Review pending</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  Your code snapshot is saved. The feedback section will unlock once the submission
                  is reviewed.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>Rubric preview</CardTitle>
            <div className="mt-4 space-y-3">
              {submission.rubricPreview.map((item) => (
                <div key={item.label} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-text">{item.label}</p>
                    <span className="shrink-0 text-xs font-semibold text-text-secondary">
                      {submission.feedbackReady ? `${item.points}/${item.maxPoints}` : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">{item.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
