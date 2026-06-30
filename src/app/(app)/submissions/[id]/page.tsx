import { SubmissionResultClient } from "@/app/(app)/submissions/[id]/submission-result-client";
import { getSubmissionResult, type SubmissionResult } from "@/lib/submissions/data";
import { getSubmissionResultFromSupabase } from "@/lib/submissions/server";

export const dynamic = "force-dynamic";

interface SubmissionResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

function createFallbackSubmission(id: string): SubmissionResult {
  return {
    id,
    task: "Submitted solution",
    category: "Task",
    status: "Pending",
    score: null,
    attempt: 1,
    submittedAt: "Submitted",
    reviewedBy: null,
    feedbackReady: false,
    summary:
      "The app could not load this submission snapshot on the server. You can still generate AI feedback while signed in.",
    files: [],
    rubricPreview: [
      {
        label: "Correctness",
        points: 0,
        maxPoints: 100,
        note: "Generated feedback will fill this score.",
      },
      {
        label: "Maintainability",
        points: 0,
        maxPoints: 100,
        note: "Generated feedback will fill this score.",
      },
      {
        label: "Security",
        points: 0,
        maxPoints: 100,
        note: "Generated feedback will fill this score.",
      },
    ],
  };
}

export default async function SubmissionResultPage({ params }: SubmissionResultPageProps) {
  const { id } = await params;
  const submission =
    getSubmissionResult(id) ??
    (await getSubmissionResultFromSupabase(id)) ??
    createFallbackSubmission(id);

  return <SubmissionResultClient submission={submission} />;
}
