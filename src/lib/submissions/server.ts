import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SubmissionResult, SubmissionStatus } from "@/lib/submissions/data";

interface SnapshotFile {
  name?: string;
  path?: string;
  file_path?: string;
  content?: string;
}

function formatSubmittedAt(value: string | null) {
  if (!value) return "Not submitted";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapStatus(status: string): SubmissionStatus {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Needs improvement";
  if (status === "in_review") return "Reviewed";
  return "Pending";
}

function normalizeFiles(files: unknown): SubmissionResult["files"] {
  if (!Array.isArray(files)) return [];

  return files.map((file: SnapshotFile, index) => ({
    path: file.path ?? file.name ?? file.file_path ?? `submitted-file-${index + 1}.txt`,
    content: file.content ?? "",
  }));
}

export async function getSubmissionResultFromSupabase(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
        id,
        status,
        file_snapshot,
        submitted_at,
        reviewed_at,
        score,
        reviewer_feedback,
        tasks (
          title,
          category
        ),
        submission_feedback (
          overall_score,
          summary,
          generated_at,
          correctness_score,
          efficiency_score,
          readability_score,
          edge_cases_score,
          maintainability_score,
          security_score
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const task = Array.isArray(data.tasks) ? data.tasks[0] : data.tasks;
  const feedback = Array.isArray(data.submission_feedback)
    ? data.submission_feedback[0]
    : data.submission_feedback;
  const score = (feedback?.overall_score ?? data.score ?? null) as number | null;
  const feedbackReady = score !== null || Boolean(feedback?.summary || data.reviewer_feedback);
  const status = mapStatus(String(data.status));

  return {
    id: data.id as string,
    task: task?.title ?? "Submitted task",
    category: task?.category ?? "Task",
    status,
    score,
    attempt: 1,
    submittedAt: formatSubmittedAt(data.submitted_at as string | null),
    reviewedBy: feedbackReady ? "SkillBridge AI" : null,
    feedbackReady,
    summary:
      feedback?.summary ?? data.reviewer_feedback ?? "This submission is waiting for AI feedback.",
    files: normalizeFiles(data.file_snapshot),
    rubricPreview: [
      {
        label: "Correctness",
        points: feedback?.correctness_score ?? 0,
        maxPoints: 100,
        note: "AI correctness score from the generated feedback.",
      },
      {
        label: "Maintainability",
        points: feedback?.maintainability_score ?? 0,
        maxPoints: 100,
        note: "AI maintainability score from the generated feedback.",
      },
      {
        label: "Security",
        points: feedback?.security_score ?? 0,
        maxPoints: 100,
        note: "AI security score from the generated feedback.",
      },
    ],
  } satisfies SubmissionResult;
}
