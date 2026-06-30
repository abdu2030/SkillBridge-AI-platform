"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreTone, sampleFeedback } from "@/lib/feedback/data";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const feedback = sampleFeedback;

export default function FeedbackPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href="/submissions" className="hover:text-text transition-colors">
            Submissions
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Feedback</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="accent">{feedback.status}</Badge>
              <Badge variant="outline">{feedback.category}</Badge>
              <Badge variant="outline">Generated {feedback.generatedAt}</Badge>
            </div>
            <h1 className="text-xl font-semibold text-text">{feedback.taskTitle}</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Submitted {feedback.submittedAt}. AI feedback is organized by engineering quality
              categories so the next revision is easier to plan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/submissions/${feedback.submissionId}`}>
              <Button variant="secondary">View result</Button>
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

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-semibold tabular-nums text-text">
            {feedback.overallScore}
          </div>
          <p className="mt-1 text-sm text-text-tertiary">Overall score</p>
          <Badge variant={getScoreTone(feedback.overallScore)} className="mt-4">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready for revision
          </Badge>
          <p className="mt-4 text-xs leading-relaxed text-text-secondary">
            This score combines code review, visible test evidence, and rubric alignment.
          </p>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Summary comments</CardTitle>
              <CardDescription>High-level review from the AI feedback engine.</CardDescription>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">{feedback.summary}</p>
          <div className="mt-4 rounded-lg border border-border bg-surface px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Visible test assessment
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {feedback.visibleTestAssessment}
            </p>
          </div>
        </Card>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-text">Score cards</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Each category is scored from 0 to 100 with a short reason.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {feedback.categoryScores.map((category) => (
            <Card key={category.key}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{category.label}</CardTitle>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    {category.reason}
                  </p>
                </div>
                <span className="shrink-0 text-lg font-semibold tabular-nums text-text">
                  {category.score}
                </span>
              </div>
              <Progress value={category.score} color={getScoreTone(category.score)} size="sm" />
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <CardTitle>Strengths</CardTitle>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <CardTitle>Weaknesses</CardTitle>
          </div>
          <ul className="space-y-2">
            {feedback.weaknesses.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            <CardTitle>Improvement suggestions</CardTitle>
          </div>
          <ul className="space-y-2">
            {feedback.improvementSuggestions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border-accent/20 bg-accent-light/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Next steps</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {feedback.nextSteps.map((step) => (
                <Badge key={step} variant="outline">
                  {step}
                </Badge>
              ))}
            </div>
          </div>
          <Link href="/workspace">
            <Button>
              Revise solution
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
