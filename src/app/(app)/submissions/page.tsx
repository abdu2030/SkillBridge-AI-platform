"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { submissionResults } from "@/lib/submissions/data";
import { Eye } from "lucide-react";
import Link from "next/link";

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
        <p className="mt-0.5 text-sm text-text-secondary">
          Your submitted solutions and their review status.
        </p>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                  Task
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary sm:table-cell">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                  Score
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                  Status
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary md:table-cell">
                  Submitted
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-text-secondary">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissionResults.map((submission) => (
                <tr key={submission.id} className="transition-colors hover:bg-surface-hover">
                  <td className="px-5 py-3">
                    <p className="font-medium text-text">{submission.task}</p>
                    <p className="mt-1 text-xs text-text-tertiary sm:hidden">
                      Attempt {submission.attempt}
                    </p>
                  </td>
                  <td className="hidden px-5 py-3 sm:table-cell">
                    <span className="text-xs text-text-secondary">{submission.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    {submission.score !== null ? (
                      <span className="font-semibold tabular-nums text-text">
                        {submission.score}%
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={statusBadge[submission.status] || "default"}>
                      {submission.status}
                    </Badge>
                  </td>
                  <td className="hidden px-5 py-3 text-xs text-text-tertiary md:table-cell">
                    {submission.submittedAt}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/submissions/${submission.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3.5 w-3.5" />
                        View result
                      </Button>
                    </Link>
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
