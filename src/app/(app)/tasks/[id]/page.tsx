"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight, FileCode, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";

const rubric = [
  {
    label: "Correctness",
    points: 40,
    description: "Does the solution produce correct output for all inputs?",
  },
  {
    label: "Edge cases",
    points: 20,
    description: "Handles empty inputs, special characters, and boundary values",
  },
  { label: "Readability", points: 15, description: "Clean code structure, naming, and comments" },
  {
    label: "Maintainability",
    points: 15,
    description: "Modular design, DRY principles, error handling",
  },
  {
    label: "Explanation quality",
    points: 10,
    description: "Clear explanation of approach and decisions made",
  },
];

const starterFiles = [
  { name: "parser.py", lines: 48, language: "Python" },
  { name: "test_parser.py", lines: 32, language: "Python" },
  { name: "sample_data.csv", lines: 15, language: "CSV" },
];

const visibleTests = [
  {
    name: "test_basic_csv",
    description: "Parses a simple 3-row CSV with headers",
    status: "visible",
  },
  {
    name: "test_empty_file",
    description: "Returns empty list for an empty file",
    status: "visible",
  },
  {
    name: "test_quoted_commas",
    description: "Handles commas inside quoted fields",
    status: "visible",
  },
  {
    name: "Hidden tests (5)",
    description: "Additional edge cases revealed after submission",
    status: "hidden",
  },
];

export default function TaskDetailPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary mb-3">
          <Link href="/tasks" className="hover:text-text transition-colors">
            Tasks
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Fix broken Python CSV parser</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text">Fix broken Python CSV parser</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
              <Badge variant="outline">Python Debugging</Badge>
              <span className="px-1.5 py-0.5 rounded bg-warning-light text-warning text-xs font-medium">
                Intermediate
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 35 min
              </span>
            </div>
          </div>
          <Link href="/workspace">
            <Button>
              Start task <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Skills tested */}
      <div className="flex flex-wrap gap-1.5">
        {["Python", "File I/O", "Error Handling", "String Parsing", "Edge Cases"].map((skill) => (
          <Badge key={skill} variant="accent">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-text-secondary" />
          <CardTitle>Task instructions</CardTitle>
        </div>
        <div className="prose prose-sm max-w-none text-sm text-text-secondary space-y-3">
          <p>
            You are given a CSV parser that works for simple files but fails on several edge cases.
            Your job is to fix the parser so it handles all of the following correctly:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Empty rows should be skipped, not cause errors</li>
            <li>Fields containing commas should be wrapped in quotes and parsed correctly</li>
            <li>
              Missing headers should raise a clear{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">ValueError</code> with a
              descriptive message
            </li>
            <li>Trailing newlines should not create phantom empty rows</li>
            <li>
              The parser should handle both{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">\n</code> and{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">\r\n</code> line endings
            </li>
          </ul>
          <p>After fixing the code, write a brief explanation of the changes you made and why.</p>
        </div>
      </Card>

      {/* Starter Files */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <FileCode className="w-4 h-4 text-text-secondary" />
          <CardTitle>Starter files</CardTitle>
        </div>
        <div className="space-y-2">
          {starterFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 p-3 rounded-lg border border-border text-sm"
            >
              <div className="w-8 h-8 rounded-md bg-gray-50 border border-border flex items-center justify-center shrink-0">
                <FileCode className="w-4 h-4 text-text-tertiary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text font-mono text-xs">{file.name}</p>
                <p className="text-xs text-text-tertiary">
                  {file.lines} lines · {file.language}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rubric */}
      <Card>
        <CardTitle>Scoring rubric</CardTitle>
        <p className="text-xs text-text-secondary mt-1 mb-4">
          Your submission will be scored on these criteria. Total: 100 points.
        </p>
        <div className="space-y-4">
          {rubric.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text">{item.label}</span>
                <span className="text-xs font-semibold text-text tabular-nums">
                  {item.points} pts
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-2">{item.description}</p>
              <Progress value={item.points} max={40} color="accent" size="sm" />
            </div>
          ))}
        </div>
      </Card>

      {/* Visible Tests */}
      <Card>
        <CardTitle>Test cases</CardTitle>
        <p className="text-xs text-text-secondary mt-1 mb-4">
          3 visible tests + 5 hidden tests revealed after submission.
        </p>
        <div className="space-y-2">
          {visibleTests.map((test) => (
            <div
              key={test.name}
              className="flex items-center gap-3 p-3 rounded-lg border border-border text-sm"
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${test.status === "hidden" ? "text-text-tertiary" : "text-text-secondary"}`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-mono text-xs ${test.status === "hidden" ? "text-text-tertiary" : "font-medium text-text"}`}
                >
                  {test.name}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">{test.description}</p>
              </div>
              {test.status === "hidden" && <Badge variant="default">Hidden</Badge>}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Link href="/workspace">
          <Button size="lg">
            Open workspace <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
