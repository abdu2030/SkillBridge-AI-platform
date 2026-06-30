import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ReviewerSubmission {
  id: string;
  developer: string;
  task: string;
  category: string;
  difficulty: string;
  submitted: string;
  aiScore: number | null;
  status: string;
  code: string;
  aiSummary: string;
  aiBreakdown: Array<{
    label: string;
    score: number;
    max: number;
  }>;
}

export interface ReviewerDashboardData {
  pendingSubmissions: ReviewerSubmission[];
  stats: {
    pendingReview: number;
    reviewedToday: number;
    approvedThisWeek: number;
    averageReviewTime: string;
  };
}

export interface ReviewerReviewFile {
  path: string;
  content: string;
}

export interface ReviewerRubricItem {
  id: string;
  label: string;
  description: string;
  maxPoints: number;
  initialScore: number;
}

export interface ReviewerReviewData {
  id: string;
  developer: string;
  status: string;
  submitted: string;
  notes: string | null;
  task: {
    title: string;
    summary: string;
    instructions: string;
    category: string;
    difficulty: string;
    estimatedMinutes: number;
    tags: string[];
  };
  files: ReviewerReviewFile[];
  aiScore: number | null;
  aiSummary: string;
  aiBreakdown: Array<{
    label: string;
    score: number;
    max: number;
  }>;
  rubricItems: ReviewerRubricItem[];
}

interface SubmissionRow {
  id: string;
  task_id: string;
  user_id: string;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  score: number | null;
  file_snapshot: unknown;
  notes?: string | null;
}

interface TaskRow {
  id: string;
  title: string;
  summary?: string;
  instructions?: string;
  category: string;
  difficulty: string;
  estimated_minutes?: number;
  tags?: string[];
}

interface ProfileRow {
  id: string;
  full_name: string | null;
}

interface FeedbackRow {
  submission_id: string;
  overall_score: number;
  summary: string;
  correctness_score: number;
  efficiency_score: number;
  readability_score: number;
  edge_cases_score: number;
  maintainability_score: number;
  security_score: number;
}

interface RubricItemRow {
  id: string;
  label: string;
  description: string;
  max_points: number;
  position: number;
}

interface SnapshotFile {
  name?: string;
  path?: string;
  file_path?: string;
  content?: string;
}

const fallbackSubmissions: ReviewerSubmission[] = [
  {
    id: "sample-docker",
    developer: "alex_k",
    task: "Fix Docker multi-stage build",
    category: "Docker",
    difficulty: "Intermediate",
    submitted: "2h ago",
    aiScore: 78,
    status: "submitted",
    code: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]`,
    aiSummary:
      "The build stages are separated clearly, but the runtime image still includes more dependencies than necessary.",
    aiBreakdown: [
      { label: "Correctness", score: 78, max: 100 },
      { label: "Efficiency", score: 74, max: 100 },
      { label: "Readability", score: 86, max: 100 },
      { label: "Edge cases", score: 70, max: 100 },
      { label: "Maintainability", score: 80, max: 100 },
      { label: "Security", score: 72, max: 100 },
    ],
  },
  {
    id: "sample-git",
    developer: "maria_s",
    task: "Resolve Git rebase conflict",
    category: "Git",
    difficulty: "Beginner",
    submitted: "5h ago",
    aiScore: 88,
    status: "in_review",
    code: "Resolution notes: preserved validation behavior and kept the new user-facing error message.",
    aiSummary: "The conflict resolution keeps both important changes and explains the final state.",
    aiBreakdown: [
      { label: "Correctness", score: 90, max: 100 },
      { label: "Efficiency", score: 85, max: 100 },
      { label: "Readability", score: 88, max: 100 },
      { label: "Edge cases", score: 82, max: 100 },
      { label: "Maintainability", score: 90, max: 100 },
      { label: "Security", score: 92, max: 100 },
    ],
  },
];

function formatSubmittedAt(value: string | null) {
  if (!value) return "Not submitted";

  const submittedAt = new Date(value);
  const elapsedMs = Date.now() - submittedAt.getTime();
  const elapsedMinutes = Math.max(1, Math.round(elapsedMs / 60000));

  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedMinutes < 1440) return `${Math.round(elapsedMinutes / 60)}h ago`;
  return `${Math.round(elapsedMinutes / 1440)}d ago`;
}

function formatDifficulty(value?: string) {
  if (!value) return "Task";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getSubmittedCode(snapshot: unknown) {
  const files = getSubmittedFiles(snapshot);
  if (files.length === 0) return "No submitted code snapshot is available.";

  return files.map((file) => `// ${file.path}\n${file.content}`).join("\n\n");
}

function getSubmittedFiles(snapshot: unknown): ReviewerReviewFile[] {
  if (!Array.isArray(snapshot) || snapshot.length === 0) {
    return [];
  }

  return snapshot.map((file: SnapshotFile, index) => {
    const path = file.path ?? file.name ?? file.file_path ?? `submitted-file-${index + 1}`;
    return {
      path,
      content: file.content ?? "",
    };
  });
}

function getBreakdown(feedback?: FeedbackRow | null) {
  if (!feedback) {
    return [
      { label: "Correctness", score: 0, max: 100 },
      { label: "Efficiency", score: 0, max: 100 },
      { label: "Readability", score: 0, max: 100 },
      { label: "Edge cases", score: 0, max: 100 },
      { label: "Maintainability", score: 0, max: 100 },
      { label: "Security", score: 0, max: 100 },
    ];
  }

  return [
    { label: "Correctness", score: feedback.correctness_score, max: 100 },
    { label: "Efficiency", score: feedback.efficiency_score, max: 100 },
    { label: "Readability", score: feedback.readability_score, max: 100 },
    { label: "Edge cases", score: feedback.edge_cases_score, max: 100 },
    { label: "Maintainability", score: feedback.maintainability_score, max: 100 },
    { label: "Security", score: feedback.security_score, max: 100 },
  ];
}

function buildFallbackDashboard(): ReviewerDashboardData {
  return {
    pendingSubmissions: fallbackSubmissions,
    stats: {
      pendingReview: fallbackSubmissions.length,
      reviewedToday: 0,
      approvedThisWeek: 0,
      averageReviewTime: "8 min",
    },
  };
}

function getFallbackReviewData(id: string): ReviewerReviewData | null {
  const submission = fallbackSubmissions.find((item) => item.id === id) ?? fallbackSubmissions[0];
  if (!submission) return null;

  return {
    id: submission.id,
    developer: submission.developer,
    status: submission.status,
    submitted: submission.submitted,
    notes: "Fallback review data for local development.",
    task: {
      title: submission.task,
      summary: "Review the submitted solution against the rubric and AI feedback.",
      instructions:
        "Read the task requirements, inspect the submitted code, compare the AI feedback with your judgment, and enter manual rubric scores.",
      category: submission.category,
      difficulty: submission.difficulty,
      estimatedMinutes: 30,
      tags: [submission.category, submission.difficulty],
    },
    files: [
      {
        path: "submission.txt",
        content: submission.code,
      },
    ],
    aiScore: submission.aiScore,
    aiSummary: submission.aiSummary,
    aiBreakdown: submission.aiBreakdown,
    rubricItems: [
      {
        id: "correctness",
        label: "Correctness",
        description: "The solution satisfies the required behavior.",
        maxPoints: 40,
        initialScore: Math.round(((submission.aiScore ?? 0) / 100) * 40),
      },
      {
        id: "edge-cases",
        label: "Edge cases",
        description: "The solution handles realistic boundary and failure cases.",
        maxPoints: 20,
        initialScore: Math.round(((submission.aiScore ?? 0) / 100) * 20),
      },
      {
        id: "code-quality",
        label: "Code quality",
        description: "The implementation is simple, readable, and maintainable.",
        maxPoints: 20,
        initialScore: Math.round(((submission.aiScore ?? 0) / 100) * 20),
      },
      {
        id: "testing",
        label: "Testing",
        description: "The solution adds or updates useful tests.",
        maxPoints: 10,
        initialScore: Math.round(((submission.aiScore ?? 0) / 100) * 10),
      },
      {
        id: "explanation",
        label: "Explanation",
        description: "The submission explains the approach and assumptions.",
        maxPoints: 10,
        initialScore: Math.round(((submission.aiScore ?? 0) / 100) * 10),
      },
    ],
  };
}

function getAiBreakdownScore(label: string, feedback: FeedbackRow | null | undefined) {
  if (!feedback) return null;

  const normalized = label.toLowerCase();
  if (normalized.includes("correct")) return feedback.correctness_score;
  if (normalized.includes("edge")) return feedback.edge_cases_score;
  if (normalized.includes("read")) return feedback.readability_score;
  if (normalized.includes("maintain")) return feedback.maintainability_score;
  if (normalized.includes("security")) return feedback.security_score;
  if (normalized.includes("efficient")) return feedback.efficiency_score;
  if (normalized.includes("quality")) {
    return Math.round((feedback.readability_score + feedback.maintainability_score) / 2);
  }

  return feedback.overall_score;
}

function mapRubricItems(items: RubricItemRow[], feedback: FeedbackRow | null | undefined) {
  if (items.length === 0) {
    return getFallbackReviewData("sample-docker")?.rubricItems ?? [];
  }

  return items
    .sort((a, b) => a.position - b.position)
    .map((item) => {
      const aiScore = getAiBreakdownScore(item.label, feedback);
      return {
        id: item.id,
        label: item.label,
        description: item.description,
        maxPoints: item.max_points,
        initialScore:
          aiScore === null ? 0 : Math.round((Math.min(aiScore, 100) / 100) * item.max_points),
      };
    });
}

export async function getReviewerDashboardData(): Promise<ReviewerDashboardData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return buildFallbackDashboard();

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("id, task_id, user_id, status, submitted_at, reviewed_at, score, file_snapshot")
    .in("status", ["submitted", "in_review"])
    .order("submitted_at", { ascending: true })
    .limit(25);

  if (error || !submissions) return buildFallbackDashboard();
  if (submissions.length === 0) {
    return {
      pendingSubmissions: [],
      stats: {
        pendingReview: 0,
        reviewedToday: 0,
        approvedThisWeek: 0,
        averageReviewTime: "0 min",
      },
    };
  }

  const rows = submissions as SubmissionRow[];
  const taskIds = Array.from(new Set(rows.map((row) => row.task_id)));
  const userIds = Array.from(new Set(rows.map((row) => row.user_id)));
  const submissionIds = rows.map((row) => row.id);

  const [tasksResult, profilesResult, feedbackResult, approvedResult] = await Promise.all([
    supabase.from("tasks").select("id, title, category, difficulty").in("id", taskIds),
    supabase.from("profiles").select("id, full_name").in("id", userIds),
    supabase
      .from("submission_feedback")
      .select(
        "submission_id, overall_score, summary, correctness_score, efficiency_score, readability_score, edge_cases_score, maintainability_score, security_score"
      )
      .in("submission_id", submissionIds),
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("reviewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const tasks = new Map((tasksResult.data as TaskRow[] | null)?.map((task) => [task.id, task]));
  const profiles = new Map(
    (profilesResult.data as ProfileRow[] | null)?.map((profile) => [profile.id, profile])
  );
  const feedback = new Map(
    (feedbackResult.data as FeedbackRow[] | null)?.map((item) => [item.submission_id, item])
  );

  const reviewedToday = rows.filter((row) => {
    if (!row.reviewed_at) return false;
    return new Date(row.reviewed_at).toDateString() === new Date().toDateString();
  }).length;

  return {
    pendingSubmissions: rows.map((row) => {
      const task = tasks.get(row.task_id);
      const profile = profiles.get(row.user_id);
      const aiFeedback = feedback.get(row.id);
      const aiScore = aiFeedback?.overall_score ?? row.score;

      return {
        id: row.id,
        developer: profile?.full_name || "Developer",
        task: task?.title || "Submitted task",
        category: task?.category || "Task",
        difficulty: formatDifficulty(task?.difficulty),
        submitted: formatSubmittedAt(row.submitted_at),
        aiScore,
        status: row.status,
        code: getSubmittedCode(row.file_snapshot),
        aiSummary: aiFeedback?.summary || "AI feedback has not been generated yet.",
        aiBreakdown: getBreakdown(aiFeedback),
      };
    }),
    stats: {
      pendingReview: rows.length,
      reviewedToday,
      approvedThisWeek: approvedResult.count ?? 0,
      averageReviewTime: "8 min",
    },
  };
}

export async function getReviewerReviewData(id: string): Promise<ReviewerReviewData | null> {
  if (id.startsWith("sample-")) return getFallbackReviewData(id);

  const supabase = await createSupabaseServerClient();
  if (!supabase) return getFallbackReviewData(id);

  const { data: submission, error } = await supabase
    .from("submissions")
    .select("id, task_id, user_id, status, submitted_at, reviewed_at, score, file_snapshot, notes")
    .eq("id", id)
    .neq("status", "draft")
    .maybeSingle();

  if (error || !submission) return null;

  const row = submission as SubmissionRow;

  const [taskResult, profileResult, feedbackResult, rubricResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, summary, instructions, category, difficulty, estimated_minutes, tags")
      .eq("id", row.task_id)
      .maybeSingle(),
    supabase.from("profiles").select("id, full_name").eq("id", row.user_id).maybeSingle(),
    supabase
      .from("submission_feedback")
      .select(
        "submission_id, overall_score, summary, correctness_score, efficiency_score, readability_score, edge_cases_score, maintainability_score, security_score"
      )
      .eq("submission_id", row.id)
      .maybeSingle(),
    supabase.from("rubrics").select("id").eq("task_id", row.task_id).maybeSingle(),
  ]);

  const task = taskResult.data as TaskRow | null;
  const profile = profileResult.data as ProfileRow | null;
  const feedback = feedbackResult.data as FeedbackRow | null;

  const { data: rubricItems } = rubricResult.data?.id
    ? await supabase
        .from("rubric_items")
        .select("id, label, description, max_points, position")
        .eq("rubric_id", rubricResult.data.id)
        .order("position", { ascending: true })
    : { data: [] };

  return {
    id: row.id,
    developer: profile?.full_name || "Developer",
    status: row.status,
    submitted: formatSubmittedAt(row.submitted_at),
    notes: row.notes ?? null,
    task: {
      title: task?.title || "Submitted task",
      summary: task?.summary || "Review this submitted solution.",
      instructions:
        task?.instructions || "Review the submitted code and score it against the rubric.",
      category: task?.category || "Task",
      difficulty: formatDifficulty(task?.difficulty),
      estimatedMinutes: task?.estimated_minutes ?? 30,
      tags: task?.tags ?? [],
    },
    files: getSubmittedFiles(row.file_snapshot),
    aiScore: feedback?.overall_score ?? row.score,
    aiSummary: feedback?.summary || "AI feedback has not been generated yet.",
    aiBreakdown: getBreakdown(feedback),
    rubricItems: mapRubricItems((rubricItems as RubricItemRow[] | null) ?? [], feedback),
  };
}
