import {
  calculateSkillProgress,
  getSkillLabel,
  getSkillNeedingWork,
  getStrongestSkill,
  type CalculatedSkillProgress,
  type ReviewedTaskScore,
} from "@/lib/progress/skills";
import type { DashboardProgressData, WeeklyActivityPoint } from "@/lib/progress/types";
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

interface ProgressRow {
  skill: CalculatedSkillProgress["skill"];
  completed_count: number;
  approved_count: number;
  portfolio_count: number;
  average_score: number;
  best_score: number;
  latest_score: number | null;
  last_activity_at: string | null;
}

interface BadgeRow {
  id: string;
  slug: string;
  criteria: Record<string, unknown>;
}

interface RecentSubmissionRow {
  id: string;
  status: string;
  score: number | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  tasks?: {
    title: string;
  } | null;
}

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatRelativeTime(value: string | null) {
  if (!value) return "Not submitted";

  const elapsedMinutes = Math.max(1, Math.round((Date.now() - Date.parse(value)) / 60000));
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedMinutes < 1440) return `${Math.round(elapsedMinutes / 60)}h ago`;
  return `${Math.round(elapsedMinutes / 1440)}d ago`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getWeekStart(date = new Date()) {
  const start = startOfDay(date);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  return start;
}

function buildEmptyWeeklyActivity(): WeeklyActivityPoint[] {
  const weekStart = getWeekStart();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    return {
      day: day.toLocaleDateString("en", { weekday: "short" }),
      tasks: 0,
    };
  });
}

function calculateCurrentStreak(dates: string[]) {
  const activeDays = new Set(dates.map((value) => startOfDay(new Date(value)).toDateString()));
  let cursor = startOfDay(new Date());
  let streak = 0;

  if (!activeDays.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (activeDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getFallbackDashboardData(): DashboardProgressData {
  return {
    completedTasks: 12,
    averageScore: 84,
    strongestSkill: "Python",
    weakestSkill: "Docker",
    currentStreak: 5,
    pendingFeedback: 2,
    weeklyActivity: [
      { day: "Mon", tasks: 2 },
      { day: "Tue", tasks: 3 },
      { day: "Wed", tasks: 1 },
      { day: "Thu", tasks: 4 },
      { day: "Fri", tasks: 2 },
      { day: "Sat", tasks: 0 },
      { day: "Sun", tasks: 1 },
    ],
    categoryPerformance: [
      { skill: "Python", score: 88, completedCount: 6 },
      { skill: "Docker", score: 64, completedCount: 3 },
      { skill: "Git", score: 82, completedCount: 2 },
      { skill: "Code review", score: 91, completedCount: 4 },
      { skill: "Frontend", score: 70, completedCount: 1 },
      { skill: "Backend", score: 76, completedCount: 2 },
      { skill: "Database", score: 72, completedCount: 1 },
    ],
    scoreHistory: [
      { label: "CSV parser", score: 84 },
      { label: "Async handler", score: 91 },
      { label: "Docker review", score: 72 },
      { label: "Git rebase", score: 95 },
      { label: "Docker build", score: 84 },
    ],
    recentSubmissions: [
      {
        id: "sample-1",
        task: "Fix broken Python CSV parser",
        score: 84,
        status: "Reviewed",
        time: "42m ago",
      },
      {
        id: "sample-2",
        task: "Debug async request handler",
        score: 91,
        status: "Approved",
        time: "2h ago",
      },
      {
        id: "sample-3",
        task: "Review AI-generated Dockerfile",
        score: 72,
        status: "Needs improvement",
        time: "1d ago",
      },
    ],
  };
}

function getEmptyDashboardData(): DashboardProgressData {
  return {
    completedTasks: 0,
    averageScore: 0,
    strongestSkill: "No skill yet",
    weakestSkill: "No skill yet",
    currentStreak: 0,
    pendingFeedback: 0,
    weeklyActivity: buildEmptyWeeklyActivity(),
    categoryPerformance: [],
    scoreHistory: [],
    recentSubmissions: [],
  };
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

  await awardUserBadges(userId, progress);

  return { ok: true, progress };
}

function getBadgeProgress(criteria: Record<string, unknown>, progress: CalculatedSkillProgress[]) {
  const type = criteria.type;
  const target = Math.max(1, Number(criteria.target) || 1);
  const skill = typeof criteria.skill === "string" ? criteria.skill : null;
  const totalCompleted = progress.reduce((total, item) => total + item.completedCount, 0);
  const totalPortfolio = progress.reduce((total, item) => total + item.portfolioCount, 0);
  const bestScore = progress.reduce((best, item) => Math.max(best, item.bestScore), 0);
  const skillProgress = skill ? progress.find((item) => item.skill === skill) : null;

  if (type === "completed_count") return { current: totalCompleted, target };
  if (type === "portfolio_count") return { current: totalPortfolio, target };
  if (type === "best_score") return { current: bestScore, target };
  if (type === "skill_coverage") {
    return { current: progress.filter((item) => item.completedCount > 0).length, target };
  }
  if (type === "skill_completed_count") {
    return { current: skillProgress?.completedCount ?? 0, target };
  }
  if (type === "skill_approved_count") {
    return { current: skillProgress?.approvedCount ?? 0, target };
  }

  return { current: 0, target };
}

export async function awardUserBadges(userId: string, progress?: CalculatedSkillProgress[]) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const skillProgress = progress ?? (await calculateUserSkillProgress(userId));

  const { data: badges, error } = await supabase
    .from("badges")
    .select("id, slug, criteria")
    .eq("is_active", true);

  if (error || !badges) return { ok: false, message: error?.message ?? "Badges were not found." };

  const rows = (badges as BadgeRow[]).map((badge) => {
    const badgeProgress = getBadgeProgress(badge.criteria, skillProgress);
    const earned = badgeProgress.current >= badgeProgress.target;

    return {
      user_id: userId,
      badge_id: badge.id,
      earned_at: earned ? new Date().toISOString() : null,
      progress_current: Math.min(badgeProgress.current, badgeProgress.target),
      progress_target: badgeProgress.target,
      metadata: {
        slug: badge.slug,
        criteria: badge.criteria,
      },
    };
  });

  const { error: upsertError } = await supabase.from("user_badges").upsert(rows, {
    onConflict: "user_id,badge_id",
  });

  if (upsertError) return { ok: false, message: upsertError.message };
  return { ok: true };
}

export async function getProgressDashboardData(userId: string): Promise<DashboardProgressData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getFallbackDashboardData();

  const [progressResult, reviewsResult, pendingResult, recentResult] = await Promise.all([
    supabase
      .from("user_progress")
      .select(
        "skill, completed_count, approved_count, portfolio_count, average_score, best_score, latest_score, last_activity_at"
      )
      .eq("user_id", userId),
    supabase
      .from("reviews")
      .select(
        `
          status,
          reviewer_percent,
          submitted_at,
          portfolio_approved,
          tasks (
            title,
            category,
            tags
          )
        `
      )
      .eq("user_id", userId)
      .in("status", ["approved", "rejected"])
      .order("submitted_at", { ascending: true }),
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["submitted", "in_review"]),
    supabase
      .from("submissions")
      .select(
        `
          id,
          status,
          score,
          submitted_at,
          reviewed_at,
          tasks (
            title
          )
        `
      )
      .eq("user_id", userId)
      .neq("status", "draft")
      .order("submitted_at", { ascending: false })
      .limit(5),
  ]);

  if (progressResult.error) return getEmptyDashboardData();

  let progress = (progressResult.data as ProgressRow[] | null)?.map(
    (item): CalculatedSkillProgress => ({
      skill: item.skill,
      label: getSkillLabel(item.skill),
      completedCount: item.completed_count,
      approvedCount: item.approved_count,
      portfolioCount: item.portfolio_count,
      averageScore: item.average_score,
      bestScore: item.best_score,
      latestScore: item.latest_score,
      lastActivityAt: item.last_activity_at,
    })
  );

  if (!progress || progress.every((item) => item.completedCount === 0)) {
    progress = await calculateUserSkillProgress(userId);
  }

  if (progress.length === 0) {
    const emptyData = getEmptyDashboardData();
    return {
      ...emptyData,
      pendingFeedback: pendingResult.count ?? 0,
      recentSubmissions: ((recentResult.data as unknown as RecentSubmissionRow[] | null) ?? []).map(
        (submission) => {
          const task = firstRelation(submission.tasks);
          return {
            id: submission.id,
            task: task?.title ?? "Submitted task",
            score: submission.score,
            status: submission.status.replace("_", " "),
            time: formatRelativeTime(submission.reviewed_at ?? submission.submitted_at),
          };
        }
      ),
    };
  }

  const completedTasks = progress.reduce((total, item) => total + item.completedCount, 0);
  const weightedScoreTotal = progress.reduce(
    (total, item) => total + item.averageScore * item.completedCount,
    0
  );
  const averageScore = completedTasks > 0 ? Math.round(weightedScoreTotal / completedTasks) : 0;
  const strongest = getStrongestSkill(progress);
  const weakest = getSkillNeedingWork(progress);
  const weekStart = getWeekStart();
  const weeklyActivity = buildEmptyWeeklyActivity();
  const reviewRows = (reviewsResult.data as unknown as ReviewRow[] | null) ?? [];
  const reviewDates = reviewRows
    .map((review) => review.submitted_at)
    .filter((value): value is string => Boolean(value));

  reviewDates.forEach((dateValue) => {
    const reviewedAt = new Date(dateValue);
    const dayIndex = Math.floor(
      (startOfDay(reviewedAt).getTime() - weekStart.getTime()) / 86400000
    );
    if (dayIndex >= 0 && dayIndex < weeklyActivity.length) weeklyActivity[dayIndex].tasks += 1;
  });

  const scoreHistory = reviewRows.slice(-8).map((review) => {
    const task = firstRelation(review.tasks);
    return {
      label: task?.title?.slice(0, 18) || "Review",
      score: review.reviewer_percent,
    };
  });

  const recentSubmissions = (
    (recentResult.data as unknown as RecentSubmissionRow[] | null) ?? []
  ).map((submission) => {
    const task = firstRelation(submission.tasks);
    return {
      id: submission.id,
      task: task?.title ?? "Submitted task",
      score: submission.score,
      status: submission.status.replace("_", " "),
      time: formatRelativeTime(submission.reviewed_at ?? submission.submitted_at),
    };
  });

  return {
    completedTasks,
    averageScore,
    strongestSkill: strongest?.label ?? "No skill yet",
    weakestSkill: weakest?.label ?? "No skill yet",
    currentStreak: calculateCurrentStreak(reviewDates),
    pendingFeedback: pendingResult.count ?? 0,
    weeklyActivity,
    categoryPerformance: progress.map((item) => ({
      skill: item.label,
      score: item.averageScore,
      completedCount: item.completedCount,
    })),
    scoreHistory,
    recentSubmissions,
  };
}
