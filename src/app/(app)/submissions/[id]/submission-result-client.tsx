"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createSupabaseBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
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

const maxFeedbackAttempts = 3;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getFeedbackErrorMessage(data: unknown, status: number) {
  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
    const details = "details" in data && typeof data.details === "string" ? ` ${data.details}` : "";
    return `${data.error}${details}`;
  }

  return `AI feedback failed with status ${status}.`;
}

function shouldRetryFeedbackRequest(data: unknown, status: number) {
  if (status === 429 || status === 500 || status === 503 || status === 504) return true;

  if (status !== 502) return false;

  const details =
    data && typeof data === "object" && "details" in data && typeof data.details === "string"
      ? data.details.toLowerCase()
      : "";

  return (
    !details.includes("not_found") &&
    !details.includes("not found") &&
    !details.includes('"code": 404')
  );
}

export function SubmissionResultClient({ submission }: { submission: SubmissionResult }) {
  const [activeFilePath, setActiveFilePath] = useState(submission.files[0]?.path ?? "");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackReady, setFeedbackReady] = useState(submission.feedbackReady);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackMessageTone, setFeedbackMessageTone] = useState<"success" | "error">("success");
  const [feedbackAttempt, setFeedbackAttempt] = useState(0);
  const [score, setScore] = useState(submission.score);
  const activeFile = useMemo(
    () => submission.files.find((file) => file.path === activeFilePath) ?? submission.files[0],
    [activeFilePath, submission.files]
  );

  const earnedPoints = submission.rubricPreview.reduce((total, item) => total + item.points, 0);
  const maxPoints = submission.rubricPreview.reduce((total, item) => total + item.maxPoints, 0);

  async function generateFeedback() {
    setIsGeneratingFeedback(true);
    setFeedbackMessage("");
    setFeedbackMessageTone("success");

    try {
      const supabase = createSupabaseBrowserClient();
      const { url, publishableKey } = getSupabaseBrowserConfig();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setFeedbackMessageTone("error");
        setFeedbackMessage("Sign in again before generating AI feedback.");
        return;
      }

      for (let attempt = 1; attempt <= maxFeedbackAttempts; attempt += 1) {
        setFeedbackAttempt(attempt);
        setFeedbackMessageTone("success");
        setFeedbackMessage(
          `Generating AI feedback... attempt ${attempt} of ${maxFeedbackAttempts}.`
        );

        try {
          const response = await fetch(`${url}/functions/v1/ai-feedback`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: publishableKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              submissionId: submission.id,
              visibleTestResults: "Manual app request: visible test results pending.",
            }),
          });

          const data = await response.json().catch(() => null);

          if (response.ok) {
            setScore(typeof data?.score === "number" ? data.score : score);
            setFeedbackReady(true);
            setFeedbackMessageTone("success");
            setFeedbackMessage("AI feedback generated and saved.");
            return;
          }

          const message = getFeedbackErrorMessage(data, response.status);
          const canRetry =
            attempt < maxFeedbackAttempts && shouldRetryFeedbackRequest(data, response.status);

          if (!canRetry) {
            setFeedbackMessageTone("error");
            setFeedbackMessage(message);
            return;
          }

          const retryDelaySeconds = attempt * 2;
          setFeedbackMessageTone("error");
          setFeedbackMessage(`${message} Retrying in ${retryDelaySeconds} seconds...`);
          await wait(retryDelaySeconds * 1000);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "AI feedback could not be generated.";
          const canRetry = attempt < maxFeedbackAttempts;

          if (!canRetry) {
            setFeedbackMessageTone("error");
            setFeedbackMessage(`${message} No more retry attempts left.`);
            return;
          }

          const retryDelaySeconds = attempt * 2;
          setFeedbackMessageTone("error");
          setFeedbackMessage(`${message} Retrying in ${retryDelaySeconds} seconds...`);
          await wait(retryDelaySeconds * 1000);
        }
      }
    } catch (error) {
      setFeedbackMessageTone("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "AI feedback could not be generated."
      );
    } finally {
      setIsGeneratingFeedback(false);
      setFeedbackAttempt(0);
    }
  }

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
              {score === null ? "Pending" : `${score}%`}
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
              {feedbackReady ? `${earnedPoints}/${maxPoints}` : "Pending"}
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
                  {feedbackReady
                    ? `Reviewed by ${submission.reviewedBy}.`
                    : "Detailed feedback will appear after review."}
                </CardDescription>
              </div>
            </div>

            {feedbackReady ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm leading-relaxed text-text-secondary">
                  AI feedback is ready with score cards, strengths, weaknesses, and improvement
                  suggestions.
                </div>
                <Link href="/feedback">
                  <Button variant="secondary" size="sm" className="w-full">
                    Open full feedback
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  loading={isGeneratingFeedback}
                  onClick={generateFeedback}
                >
                  {isGeneratingFeedback
                    ? `Retrying AI feedback ${feedbackAttempt}/${maxFeedbackAttempts}`
                    : "Regenerate AI feedback"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border border-dashed border-border bg-surface px-3 py-6 text-center">
                  <p className="text-sm font-medium text-text">Review pending</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    Your code snapshot is saved. Generate AI feedback from this page while signed
                    in.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  loading={isGeneratingFeedback}
                  onClick={generateFeedback}
                >
                  {isGeneratingFeedback
                    ? `Generating AI feedback ${feedbackAttempt}/${maxFeedbackAttempts}`
                    : "Generate AI feedback"}
                </Button>
              </div>
            )}
            {feedbackMessage && (
              <p
                className={cn(
                  "mt-3 text-xs leading-relaxed",
                  feedbackMessageTone === "success" ? "text-success" : "text-error"
                )}
              >
                {feedbackMessage}
              </p>
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
                      {feedbackReady ? `${item.points}/${item.maxPoints}` : "Pending"}
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
