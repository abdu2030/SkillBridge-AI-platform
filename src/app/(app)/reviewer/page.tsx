"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Send,
  Eye,
} from "lucide-react";
import { useState } from "react";

const pendingSubmissions = [
  {
    id: "1",
    developer: "alex_k",
    task: "Fix Docker multi-stage build",
    category: "Docker",
    difficulty: "Intermediate",
    submitted: "2h ago",
    aiScore: 78,
  },
  {
    id: "2",
    developer: "maria_s",
    task: "Debug async Python handler",
    category: "Python",
    difficulty: "Advanced",
    submitted: "5h ago",
    aiScore: 91,
  },
  {
    id: "3",
    developer: "chen_w",
    task: "Review AI-generated REST API",
    category: "Code Review",
    difficulty: "Intermediate",
    submitted: "1d ago",
    aiScore: 85,
  },
  {
    id: "4",
    developer: "jordan_l",
    task: "Fix SQL injection vulnerability",
    category: "Security",
    difficulty: "Advanced",
    submitted: "1d ago",
    aiScore: 69,
  },
  {
    id: "5",
    developer: "sam_p",
    task: "Write unit tests for auth module",
    category: "Backend",
    difficulty: "Intermediate",
    submitted: "2d ago",
    aiScore: 82,
  },
];

const selectedSubmission = {
  developer: "alex_k",
  task: "Fix Docker multi-stage build",
  aiScore: 78,
  aiBreakdown: [
    { label: "Correctness", score: 30, max: 40 },
    { label: "Edge cases", score: 14, max: 20 },
    { label: "Readability", score: 12, max: 15 },
    { label: "Maintainability", score: 13, max: 15 },
    { label: "Explanation", score: 9, max: 10 },
  ],
  aiSummary:
    "The build stages are correctly separated, but the COPY --from reference uses an incorrect stage name. The final image is reduced from 1.2GB to 350MB which is good, but the builder stage still includes dev dependencies.",
  code: `FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
};

export default function ReviewerPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [approveForPortfolio, setApproveForPortfolio] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Reviewer dashboard</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Review developer submissions, score against rubrics, and approve for portfolios.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Pending review</p>
          <p className="text-xl font-semibold text-text mt-1">5</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Reviewed today</p>
          <p className="text-xl font-semibold text-text mt-1">3</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Approved this week</p>
          <p className="text-xl font-semibold text-text mt-1">12</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Avg review time</p>
          <p className="text-xl font-semibold text-text mt-1">8 min</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Submissions Table */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-text">Pending submissions</p>
            </div>
            <div className="divide-y divide-border">
              {pendingSubmissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  className={`w-full text-left px-5 py-3 transition-colors cursor-pointer ${
                    selectedId === sub.id ? "bg-accent-light" : "hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text truncate">{sub.task}</span>
                    <span className="text-xs font-semibold tabular-nums text-text-secondary ml-2">
                      AI: {sub.aiScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <User className="w-3 h-3" />
                    <span>{sub.developer}</span>
                    <span>·</span>
                    <span>{sub.category}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{sub.submitted}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>{selectedSubmission.task}</CardTitle>
                <p className="text-xs text-text-secondary mt-0.5">
                  by {selectedSubmission.developer}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-text tabular-nums">
                  {selectedSubmission.aiScore}
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
                    <div className="bg-[#1e1e2e] rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs font-mono text-gray-300 leading-6">
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
                      <p className="text-sm text-text-secondary">{selectedSubmission.aiSummary}</p>
                      <div className="space-y-3">
                        {selectedSubmission.aiBreakdown.map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-text-secondary">{item.label}</span>
                              <span className="text-xs font-medium text-text tabular-nums">
                                {item.score}/{item.max}
                              </span>
                            </div>
                            <Progress value={item.score} max={item.max} color="accent" size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          {/* Rubric Scoring */}
          <Card>
            <CardTitle>Your review</CardTitle>
            <div className="mt-4 space-y-4">
              {selectedSubmission.aiBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text">{item.label}</span>
                    <span className="text-xs text-text-tertiary">Max: {item.max}</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={item.max}
                    defaultValue={item.score}
                    className="w-20 px-3 py-1.5 text-sm border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent tabular-nums"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Comment */}
          <Card>
            <CardTitle>Reviewer comment</CardTitle>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write feedback for the developer. This will appear on their submission and portfolio if approved."
              className="w-full mt-3 h-24 text-sm border border-border rounded-lg p-3 bg-bg placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
            />
          </Card>

          {/* Actions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={approveForPortfolio}
                    onChange={(e) => setApproveForPortfolio(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent"
                  />
                  <span className="text-sm text-text">Approve for portfolio</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary">
                <ThumbsUp className="w-4 h-4" />
                Submit review
              </Button>
              <Button variant="outline">
                <ThumbsDown className="w-4 h-4" />
                Needs improvement
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
