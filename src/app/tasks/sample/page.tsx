"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight, FileCode, CheckCircle2, BookOpen, Code2 } from "lucide-react";
import Link from "next/link";

const rubric = [
  { label: "Correctness", points: 40 },
  { label: "Edge cases", points: 20 },
  { label: "Readability", points: 15 },
  { label: "Maintainability", points: 15 },
  { label: "Explanation quality", points: 10 },
];

export default function SampleTaskPage() {
  return (
    <div className="min-h-screen bg-bg">
      <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-text">SkillBridge AI</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
          >
            Start practicing
          </Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <Badge variant="accent" className="mb-3">
            Sample task
          </Badge>
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
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-text-secondary" />
            <CardTitle>Task instructions</CardTitle>
          </div>
          <div className="text-sm text-text-secondary space-y-3">
            <p>
              You are given a CSV parser that works for simple files but fails on edge cases. Fix
              the parser so it handles:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Empty rows should be skipped, not cause errors</li>
              <li>Fields containing commas should be wrapped in quotes and parsed correctly</li>
              <li>Missing headers should raise a clear ValueError</li>
              <li>Trailing newlines should not create phantom empty rows</li>
              <li>The parser should handle both \n and \r\n line endings</li>
            </ul>
          </div>
        </Card>
        <Card>
          <CardTitle>Scoring rubric</CardTitle>
          <p className="text-xs text-text-secondary mt-1 mb-4">Total: 100 points</p>
          <div className="space-y-3">
            {rubric.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-text">{item.label}</span>
                <span className="text-xs font-semibold text-text tabular-nums">
                  {item.points} pts
                </span>
              </div>
            ))}
          </div>
        </Card>
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-sm font-medium text-text mb-1">Ready to try this task?</p>
          <p className="text-sm text-text-secondary mb-4">
            Create a free account to open the workspace and get AI feedback.
          </p>
          <Link href="/register">
            <Button>
              Create free account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
