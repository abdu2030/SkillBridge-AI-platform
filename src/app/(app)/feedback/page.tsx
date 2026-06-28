"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const scoreBreakdown = [
  { label: "Correctness", score: 36, max: 40, color: "success" as const },
  { label: "Efficiency", score: 8, max: 10, color: "success" as const },
  { label: "Edge cases", score: 14, max: 20, color: "warning" as const },
  { label: "Readability", score: 13, max: 15, color: "success" as const },
  { label: "Maintainability", score: 12, max: 15, color: "success" as const },
  { label: "Security", score: 5, max: 5, color: "success" as const },
  { label: "Explanation quality", score: 7, max: 10, color: "accent" as const },
];

const testResults = [
  { name: "test_basic_csv", status: "pass" },
  { name: "test_empty_file", status: "pass" },
  { name: "test_quoted_commas", status: "pass" },
  { name: "test_missing_headers", status: "pass" },
  { name: "test_unicode_chars", status: "pass" },
  { name: "test_empty_rows", status: "fail" },
  { name: "test_mixed_line_endings", status: "pass" },
  { name: "test_large_file", status: "fail" },
];

const totalScore = scoreBreakdown.reduce((sum, item) => sum + item.score, 0);

export default function FeedbackPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary mb-3">
          <Link href="/submissions" className="hover:text-text transition-colors">
            Submissions
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Feedback</span>
        </div>
        <h1 className="text-lg font-semibold text-text">Submission feedback</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Fix broken Python CSV parser · Submitted 42 minutes ago
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-1 flex flex-col items-center justify-center py-8">
          <div className="text-4xl font-bold text-text tabular-nums">{totalScore}</div>
          <div className="text-sm text-text-tertiary mt-1">/115</div>
          <Badge variant="success" className="mt-3">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Passed
          </Badge>
          <p className="text-xs text-text-secondary mt-3">Reviewer feedback pending</p>
        </Card>

        <Card className="sm:col-span-2">
          <CardTitle>Score breakdown</CardTitle>
          <div className="mt-4 space-y-3">
            {scoreBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">{item.label}</span>
                  <span className="text-xs font-medium text-text tabular-nums">
                    {item.score}/{item.max}
                  </span>
                </div>
                <Progress value={item.score} max={item.max} color={item.color} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Test results</CardTitle>
          <Badge
            variant={
              testResults.filter((t) => t.status === "fail").length > 0 ? "warning" : "success"
            }
          >
            {testResults.filter((t) => t.status === "pass").length}/{testResults.length} passed
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {testResults.map((test) => (
            <div
              key={test.name}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-border"
            >
              {test.status === "pass" ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-error shrink-0" />
              )}
              <span className="text-xs font-mono text-text">{test.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Review */}
      <Card>
        <CardTitle>AI review summary</CardTitle>
        <p className="text-sm text-text-secondary leading-relaxed mt-3">
          Your solution handles normal CSV files correctly and includes proper file handling with a
          context manager. The function signature is preserved and the code is well-structured.
          However, it does not handle empty rows consistently when they appear between data rows,
          and the large file test timed out due to the string concatenation approach in the inner
          loop. Consider using a list and joining at the end for better performance with large
          datasets.
        </p>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <CardTitle>Strengths</CardTitle>
          </div>
          <ul className="space-y-2">
            {[
              "Clean function structure with proper docstring",
              "Good variable naming throughout",
              "Proper file handling with context manager",
              "Header validation with descriptive error message",
              "Whitespace stripping on headers and values",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <CardTitle>Areas for improvement</CardTitle>
          </div>
          <ul className="space-y-2">
            {[
              "Empty rows between data rows cause index errors",
              "No handling of BOM characters in UTF-8 files",
              "String concatenation in inner loop causes O(n²) with large files",
              "Missing type hints on helper variables",
              "Explanation could be more detailed about edge case handling",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="w-4 h-4 shrink-0 mt-0.5 text-warning flex items-center justify-center">
                  •
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-accent" />
          <CardTitle>Suggestions</CardTitle>
        </div>
        <div className="space-y-3 text-sm text-text-secondary">
          <p>
            <strong className="text-text">1. Handle empty rows defensively:</strong> Check for empty
            or whitespace-only rows before processing. The current check works for some cases but
            misses rows with only delimiters.
          </p>
          <p>
            <strong className="text-text">
              2. Use list appending instead of string concatenation:
            </strong>{" "}
            When building strings in a loop, use a list and{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">str.join()</code> at the end.
            This changes the complexity from O(n²) to O(n).
          </p>
          <p>
            <strong className="text-text">3. Consider BOM handling:</strong> Files saved with UTF-8
            BOM will have the BOM character in the first header. Use{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              encoding=&apos;utf-8-sig&apos;
            </code>{" "}
            when opening the file.
          </p>
        </div>
      </Card>

      {/* Next Task */}
      <Card className="border-accent/20 bg-accent-light/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recommended next task</CardTitle>
            <p className="text-sm text-text-secondary mt-1">Debug async Python request handler</p>
            <p className="text-xs text-text-tertiary mt-1">Python · Advanced · 45 min</p>
          </div>
          <Link href="/tasks/async-handler">
            <Button>
              Start next task <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
