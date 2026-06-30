"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import type { ReviewerDashboardData } from "@/lib/reviewer/server";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusVariant: Record<string, "default" | "accent" | "success" | "warning"> = {
  submitted: "warning",
  in_review: "accent",
  approved: "success",
};

export function ReviewerClient({ dashboard }: { dashboard: ReviewerDashboardData }) {
  const [selectedId, setSelectedId] = useState(dashboard.pendingSubmissions[0]?.id ?? "");
  const [approveForPortfolio, setApproveForPortfolio] = useState(false);
  const [comment, setComment] = useState("");

  const selectedSubmission = useMemo(
    () =>
      dashboard.pendingSubmissions.find((submission) => submission.id === selectedId) ??
      dashboard.pendingSubmissions[0],
    [dashboard.pendingSubmissions, selectedId]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Reviewer dashboard</h1>
        <p className="mt-0.5 text-sm text-text-secondary">
          Review developer submissions, compare AI scores, and prepare manual rubric decisions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Pending review</p>
          <p className="mt-1 text-xl font-semibold text-text">{dashboard.stats.pendingReview}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Reviewed today</p>
          <p className="mt-1 text-xl font-semibold text-text">{dashboard.stats.reviewedToday}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Approved this week</p>
          <p className="mt-1 text-xl font-semibold text-text">{dashboard.stats.approvedThisWeek}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Avg review time</p>
          <p className="mt-1 text-xl font-semibold text-text">
            {dashboard.stats.averageReviewTime}
          </p>
        </Card>
      </div>

      {dashboard.pendingSubmissions.length === 0 ? (
        <Card className="max-w-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>No pending submissions</CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Submitted and AI-reviewed work will appear here when developers send solutions for
                review.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card padding="none">
              <div className="border-b border-border px-5 py-3">
                <p className="text-sm font-semibold text-text">Pending submissions</p>
              </div>
              <div className="divide-y divide-border">
                {dashboard.pendingSubmissions.map((submission) => (
                  <button
                    key={submission.id}
                    type="button"
                    onClick={() => setSelectedId(submission.id)}
                    className={`w-full cursor-pointer px-5 py-3 text-left transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? "bg-accent-light"
                        : "hover:bg-surface-hover"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <span className="line-clamp-2 text-sm font-medium text-text">
                          {submission.task}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <Badge variant="outline">{submission.category}</Badge>
                          <Badge variant={statusVariant[submission.status] || "default"}>
                            {submission.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-text-secondary">
                        AI: {submission.aiScore ?? "Pending"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                      <User className="h-3 w-3" />
                      <span>{submission.developer}</span>
                      <span>/</span>
                      <span>{submission.difficulty}</span>
                      <span>/</span>
                      <Clock className="h-3 w-3" />
                      <span>{submission.submitted}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-3">
            {selectedSubmission && (
              <>
                <Card>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{selectedSubmission.category}</Badge>
                        <Badge variant="outline">{selectedSubmission.difficulty}</Badge>
                      </div>
                      <CardTitle>{selectedSubmission.task}</CardTitle>
                      <p className="mt-1 text-xs text-text-secondary">
                        by {selectedSubmission.developer} / submitted {selectedSubmission.submitted}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold tabular-nums text-text">
                        {selectedSubmission.aiScore ?? "--"}
                      </p>
                      <p className="text-xs text-text-tertiary">AI score</p>
                    </div>
                  </div>

                  <Tabs
                    tabs={[
                      {
                        id: "code",
                        label: "Code",
                        content: (
                          <div className="rounded-lg bg-[#111827] p-4">
                            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs leading-6 text-gray-100">
                              {selectedSubmission.code}
                            </pre>
                          </div>
                        ),
                      },
                      {
                        id: "ai-feedback",
                        label: "AI Feedback",
                        content: (
                          <div className="space-y-4">
                            <p className="text-sm leading-relaxed text-text-secondary">
                              {selectedSubmission.aiSummary}
                            </p>
                            <div className="space-y-3">
                              {selectedSubmission.aiBreakdown.map((item) => (
                                <div key={item.label}>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">
                                      {item.label}
                                    </span>
                                    <span className="text-xs font-medium tabular-nums text-text">
                                      {item.score}/{item.max}
                                    </span>
                                  </div>
                                  <Progress
                                    value={item.score}
                                    max={item.max}
                                    color={item.score >= 70 ? "accent" : "warning"}
                                    size="sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      },
                    ]}
                  />
                </Card>

                <Card>
                  <CardTitle>Manual rubric review</CardTitle>
                  <div className="mt-4 space-y-4">
                    {selectedSubmission.aiBreakdown.map((item) => (
                      <div key={item.label}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm text-text">{item.label}</span>
                          <span className="text-xs text-text-tertiary">Max: {item.max}</span>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={item.max}
                          defaultValue={item.score}
                          className="w-20 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm tabular-nums focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>Reviewer comment</CardTitle>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Write feedback for the developer. This will appear on their submission and portfolio if approved."
                    className="mt-3 h-24 w-full resize-none rounded-lg border border-border bg-bg p-3 text-sm placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </Card>

                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={approveForPortfolio}
                        onChange={(event) => setApproveForPortfolio(event.target.checked)}
                        className="h-4 w-4 rounded border-border accent-accent focus:ring-accent"
                      />
                      <span className="text-sm text-text">Approve for portfolio</span>
                    </label>
                    <Link href={`/reviewer/${selectedSubmission.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        Open submission
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">
                      <ThumbsUp className="h-4 w-4" />
                      Submit review
                    </Button>
                    <Button variant="outline">
                      <ThumbsDown className="h-4 w-4" />
                      Needs improvement
                    </Button>
                    <Button variant="secondary">
                      <Send className="h-4 w-4" />
                      Save draft
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      <Card className="border-warning/20 bg-warning-light/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm leading-relaxed text-text-secondary">
            Day 2 dashboard review actions are prepared for manual scoring. Persisting reviewer
            decisions comes next when the manual review tables/actions are added.
          </p>
        </div>
      </Card>
    </div>
  );
}
