"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ReviewerReviewData } from "@/lib/reviewer/server";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileCode,
  MessageSquare,
  Save,
  Send,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ScoreState = Record<string, number>;
type ChecklistState = Record<string, boolean>;

function clampScore(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.round(value)));
}

function getInitialScores(review: ReviewerReviewData) {
  return Object.fromEntries(
    review.rubricItems.map((item) => [item.id, clampScore(item.initialScore, item.maxPoints)])
  ) as ScoreState;
}

function getInitialChecklist(review: ReviewerReviewData) {
  return Object.fromEntries(review.rubricItems.map((item) => [item.id, false])) as ChecklistState;
}

export function ReviewSubmissionClient({ review }: { review: ReviewerReviewData }) {
  const [activeFilePath, setActiveFilePath] = useState(review.files[0]?.path ?? "");
  const [scores, setScores] = useState<ScoreState>(() => getInitialScores(review));
  const [checkedItems, setCheckedItems] = useState<ChecklistState>(() =>
    getInitialChecklist(review)
  );
  const [comment, setComment] = useState("");

  const activeFile = useMemo(
    () => review.files.find((file) => file.path === activeFilePath) ?? review.files[0],
    [activeFilePath, review.files]
  );

  const maxScore = review.rubricItems.reduce((total, item) => total + item.maxPoints, 0);
  const reviewerScore = review.rubricItems.reduce(
    (total, item) => total + clampScore(scores[item.id] ?? 0, item.maxPoints),
    0
  );
  const reviewerPercent = maxScore > 0 ? Math.round((reviewerScore / maxScore) * 100) : 0;
  const checkedCount = review.rubricItems.filter((item) => checkedItems[item.id]).length;

  function updateScore(itemId: string, value: string, max: number) {
    setScores((current) => ({
      ...current,
      [itemId]: clampScore(Number(value), max),
    }));
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href="/reviewer" className="hover:text-text transition-colors">
            Reviewer dashboard
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{review.task.title}</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="outline">{review.task.category}</Badge>
              <Badge variant="outline">{review.task.difficulty}</Badge>
              <Badge variant="accent">{review.status.replace("_", " ")}</Badge>
            </div>
            <h1 className="text-xl font-semibold text-text">{review.task.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Submitted by {review.developer} / {review.submitted}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/reviewer">
              <Button variant="secondary">Back to dashboard</Button>
            </Link>
            <Button>
              Submit review
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Reviewer score</p>
            <p className="text-sm font-semibold text-text">
              {reviewerScore}/{maxScore} ({reviewerPercent}%)
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-light text-success">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Checklist</p>
            <p className="text-sm font-semibold text-text">
              {checkedCount}/{review.rubricItems.length} items reviewed
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-light text-warning">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">AI score</p>
            <p className="text-sm font-semibold text-text">
              {review.aiScore === null ? "Pending" : `${review.aiScore}%`}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Task instructions</CardTitle>
                <CardDescription>{review.task.summary}</CardDescription>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {review.task.instructions}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {review.task.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Submitted code</CardTitle>
                <CardDescription>Review the exact files sent by the developer.</CardDescription>
              </div>
              <div className="flex gap-1 overflow-x-auto scrollbar-none">
                {review.files.map((file) => (
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
            <div className="min-h-[380px] bg-[#111827]">
              {activeFile ? (
                <pre className="max-h-[620px] min-h-[380px] overflow-auto p-4 text-sm leading-6 text-gray-100">
                  <code>{activeFile.content}</code>
                </pre>
              ) : (
                <div className="flex min-h-[380px] items-center justify-center text-sm text-text-tertiary">
                  No submitted files are available.
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-light text-success">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>AI feedback</CardTitle>
                <CardDescription>
                  Use this as a starting point, not the final decision.
                </CardDescription>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">{review.aiSummary}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {review.aiBreakdown.map((item) => (
                <div key={item.label} className="rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-text">{item.label}</p>
                    <span className="text-xs font-semibold tabular-nums text-text-secondary">
                      {item.score}/{item.max}
                    </span>
                  </div>
                  <Progress value={item.score} max={item.max} size="sm" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardTitle>Rubric checklist</CardTitle>
            <CardDescription>Enter manual points. The reviewer score updates live.</CardDescription>
            <div className="mt-4 space-y-3">
              {review.rubricItems.map((item) => {
                const itemScore = clampScore(scores[item.id] ?? 0, item.maxPoints);
                return (
                  <div key={item.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(checkedItems[item.id])}
                        onChange={(event) =>
                          setCheckedItems((current) => ({
                            ...current,
                            [item.id]: event.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 rounded border-border accent-accent"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-text">{item.label}</p>
                            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={item.maxPoints}
                              value={itemScore}
                              onChange={(event) =>
                                updateScore(item.id, event.target.value, item.maxPoints)
                              }
                              className="w-16 rounded-lg border border-border bg-bg px-2 py-1 text-right text-sm tabular-nums focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            <span className="text-xs text-text-tertiary">/{item.maxPoints}</span>
                          </div>
                        </div>
                        <Progress
                          value={itemScore}
                          max={item.maxPoints}
                          color={itemScore / item.maxPoints >= 0.7 ? "accent" : "warning"}
                          size="sm"
                          className="mt-3"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardTitle>Reviewer score</CardTitle>
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold tabular-nums text-text">
                    {reviewerPercent}%
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {reviewerScore} of {maxScore} points
                  </p>
                </div>
                <Badge variant={reviewerPercent >= 70 ? "success" : "warning"}>
                  {reviewerPercent >= 70 ? "Passing review" : "Needs improvement"}
                </Badge>
              </div>
              <Progress value={reviewerScore} max={maxScore} className="mt-4" showLabel />
            </div>
          </Card>

          <Card>
            <CardTitle>Reviewer comment</CardTitle>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write feedback for the developer."
              className="mt-3 h-28 w-full resize-none rounded-lg border border-border bg-bg p-3 text-sm placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </Card>

          <Card>
            <div className="flex flex-col gap-2">
              <Button>
                Save review draft
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="secondary">
                Submit manual review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
