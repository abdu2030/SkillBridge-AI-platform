"use server";

import { requireReviewerProfile } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewDecision = "draft" | "approved" | "rejected";

export interface ReviewScoreInput {
  rubricItemId: string;
  label: string;
  score: number;
  maxScore: number;
  checked: boolean;
}

export interface SaveReviewInput {
  submissionId: string;
  decision: ReviewDecision;
  reviewerScore: number;
  maxScore: number;
  reviewerPercent: number;
  comment: string;
  portfolioApproved: boolean;
  rubricScores: ReviewScoreInput[];
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalizeRubricScores(scores: ReviewScoreInput[]) {
  return scores.map((item) => {
    const maxScore = Math.max(1, Math.round(Number(item.maxScore)));
    return {
      rubricItemId: item.rubricItemId,
      label: item.label,
      score: clamp(Number(item.score), 0, maxScore),
      maxScore,
      checked: Boolean(item.checked),
    };
  });
}

export async function saveManualReview(input: SaveReviewInput) {
  const reviewer = await requireReviewerProfile();
  if (!reviewer) return { ok: false, message: "Reviewer access is required." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select("id, task_id, user_id, status")
    .eq("id", input.submissionId)
    .neq("status", "draft")
    .maybeSingle();

  if (submissionError || !submission) {
    return { ok: false, message: submissionError?.message ?? "Submission was not found." };
  }

  const rubricScores = normalizeRubricScores(input.rubricScores);
  const maxScore = Math.max(
    1,
    rubricScores.reduce((total, item) => total + item.maxScore, 0)
  );
  const reviewerScore = clamp(
    rubricScores.reduce((total, item) => total + item.score, 0),
    0,
    maxScore
  );
  const reviewerPercent = clamp((reviewerScore / maxScore) * 100, 0, 100);
  const submittedAt = input.decision === "draft" ? null : new Date().toISOString();
  const reviewerComment = input.comment.trim();

  const { error: reviewError } = await supabase.from("reviews").upsert(
    {
      submission_id: submission.id,
      task_id: submission.task_id,
      user_id: submission.user_id,
      reviewer_id: reviewer.id,
      status: input.decision,
      reviewer_score: reviewerScore,
      max_score: maxScore,
      reviewer_percent: reviewerPercent,
      rubric_scores: rubricScores,
      reviewer_comment: reviewerComment,
      portfolio_approved: input.decision === "approved" && input.portfolioApproved,
      submitted_at: submittedAt,
    },
    { onConflict: "submission_id" }
  );

  if (reviewError) {
    return { ok: false, message: reviewError.message };
  }

  const nextSubmissionStatus =
    input.decision === "approved"
      ? "approved"
      : input.decision === "rejected"
        ? "rejected"
        : "in_review";

  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      status: nextSubmissionStatus,
      score: reviewerPercent,
      reviewer_id: reviewer.id,
      reviewed_at: submittedAt ?? new Date().toISOString(),
      reviewer_feedback: reviewerComment || null,
    })
    .eq("id", submission.id);

  if (updateError) {
    return { ok: false, message: updateError.message };
  }

  revalidatePath("/reviewer");
  revalidatePath(`/reviewer/${submission.id}`);
  revalidatePath("/submissions");
  revalidatePath(`/submissions/${submission.id}`);
  revalidatePath("/portfolio");

  return {
    ok: true,
    message:
      input.decision === "draft"
        ? "Review draft saved."
        : input.decision === "approved"
          ? "Submission approved."
          : "Submission marked as needs improvement.",
    status: nextSubmissionStatus,
    reviewerScore,
    reviewerPercent,
  };
}
