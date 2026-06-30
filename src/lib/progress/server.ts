import { calculateSkillProgress, type ReviewedTaskScore } from "@/lib/progress/skills";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ReviewRow {
  task_id: string;
  user_id: string;
  status: string;
  reviewer_percent: number;
  portfolio_approved: boolean;
  submitted_at: string | null;
  submissions?: {
    id: string;
    score: number | null;
    reviewed_at: string | null;
  } | null;
  tasks?: {
    id: string;
    title: string;
    category: string;
    tags: string[];
  } | null;
}

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function calculateUserSkillProgress(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
        task_id,
        user_id,
        status,
        reviewer_percent,
        portfolio_approved,
        submitted_at,
        submissions (
          id,
          score,
          reviewed_at
        ),
        tasks (
          id,
          title,
          category,
          tags
        )
      `
    )
    .eq("user_id", userId)
    .in("status", ["approved", "rejected"]);

  if (error || !data) return [];

  const reviewedTasks = (data as unknown as ReviewRow[]).map((review): ReviewedTaskScore => {
    const task = firstRelation(review.tasks);
    const submission = firstRelation(review.submissions);

    return {
      taskId: task?.id ?? review.task_id,
      title: task?.title ?? "Reviewed task",
      category: task?.category ?? "Task",
      tags: task?.tags ?? [],
      status: review.status,
      reviewerScore: review.reviewer_percent,
      aiScore: submission?.score ?? null,
      portfolioApproved: review.portfolio_approved,
      reviewedAt: review.submitted_at ?? submission?.reviewed_at ?? null,
    };
  });

  return calculateSkillProgress(reviewedTasks);
}

export async function refreshUserSkillProgress(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const progress = await calculateUserSkillProgress(userId);
  const rows = progress.map((item) => ({
    user_id: userId,
    skill: item.skill,
    completed_count: item.completedCount,
    approved_count: item.approvedCount,
    portfolio_count: item.portfolioCount,
    average_score: item.averageScore,
    best_score: item.bestScore,
    latest_score: item.latestScore,
    last_activity_at: item.lastActivityAt,
    calculated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("user_progress").upsert(rows, {
    onConflict: "user_id,skill",
  });

  if (error) return { ok: false, message: error.message };

  return { ok: true, progress };
}
