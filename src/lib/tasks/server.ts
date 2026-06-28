import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultRubric,
  tasks as fallbackTasks,
  type RubricItem,
  type Task,
  type TaskDifficulty,
  type TaskFile,
  type TaskTest,
} from "@/lib/tasks/data";

type DbTaskStatus = "draft" | "published" | "archived";
type DbTaskDifficulty = "beginner" | "intermediate" | "advanced";
type DbTaskFileRole =
  "starter" | "visible_test" | "hidden_test" | "solution_reference" | "supporting";

interface DbTaskRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  instructions: string;
  category: string;
  difficulty: DbTaskDifficulty;
  estimated_minutes: number;
  tags: string[] | null;
  status: DbTaskStatus;
  task_files?: DbTaskFileRow[] | null;
  rubrics?: DbRubricRow[] | DbRubricRow | null;
}

interface DbTaskFileRow {
  file_path: string;
  language: string;
  file_role: DbTaskFileRole;
  content?: string | null;
  sort_order?: number | null;
}

interface DbRubricRow {
  total_points: number;
  rubric_items?: DbRubricItemRow[] | null;
}

interface DbRubricItemRow {
  position: number;
  label: string;
  description: string;
  max_points: number;
}

const difficultyLabels: Record<DbTaskDifficulty, TaskDifficulty> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const fileRoleLabels: Record<DbTaskFileRole, TaskFile["role"]> = {
  starter: "Starter",
  visible_test: "Visible test",
  hidden_test: "Hidden test",
  solution_reference: "Supporting",
  supporting: "Supporting",
};

function splitInstructions(instructions: string) {
  return instructions
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapTaskFiles(rows: DbTaskFileRow[] | null | undefined): TaskFile[] {
  return (rows ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .filter((file) => file.file_role !== "solution_reference")
    .map((file) => ({
      name: file.file_path,
      lines: Math.max((file.content ?? "").split("\n").length, 1),
      language: file.language,
      role: fileRoleLabels[file.file_role],
    }));
}

function mapTests(rows: DbTaskFileRow[] | null | undefined): TaskTest[] {
  return (rows ?? [])
    .filter((file) => file.file_role === "visible_test" || file.file_role === "hidden_test")
    .map((file) => ({
      name: file.file_path,
      description:
        file.file_role === "hidden_test"
          ? "Private evaluator test used after submission."
          : "Visible test learners can inspect before submitting.",
      visibility: file.file_role === "hidden_test" ? "hidden" : "visible",
    }));
}

function mapRubric(row: DbTaskRow): RubricItem[] {
  const rubric = Array.isArray(row.rubrics) ? row.rubrics[0] : row.rubrics;
  const items = rubric?.rubric_items ?? [];

  if (!items.length) return defaultRubric;

  return items
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      label: item.label,
      points: item.max_points,
      description: item.description,
    }));
}

function mapDbTask(row: DbTaskRow): Task {
  const taskFiles = mapTaskFiles(row.task_files);
  const tests = mapTests(row.task_files);

  return {
    id: row.slug,
    title: row.title,
    category: row.category,
    difficulty: difficultyLabels[row.difficulty],
    estimatedMinutes: row.estimated_minutes,
    skills: row.tags ?? [],
    status: "Not started",
    summary: row.summary,
    instructions: splitInstructions(row.instructions),
    expectedBehavior: [
      "Complete the requested behavior without changing unrelated functionality.",
      "Keep the implementation readable and easy to review.",
      "Run the visible tests and explain the important changes.",
    ],
    starterFiles: taskFiles.length ? taskFiles : [],
    tests,
    rubric: mapRubric(row),
  };
}

export async function getPublishedTasks() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackTasks;

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, slug, title, summary, instructions, category, difficulty, estimated_minutes, tags, status"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return fallbackTasks;

  return (data as DbTaskRow[]).map(mapDbTask);
}

export async function getTaskBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackTasks.find((task) => task.id === slug) ?? null;

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      id,
      slug,
      title,
      summary,
      instructions,
      category,
      difficulty,
      estimated_minutes,
      tags,
      status,
      task_files(file_path, language, file_role, content, sort_order),
      rubrics(total_points, rubric_items(position, label, description, max_points))
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) return fallbackTasks.find((task) => task.id === slug) ?? null;
  if (!data) return null;

  return mapDbTask(data as DbTaskRow);
}
