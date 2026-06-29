"use server";

import { requireAdminProfile } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type PublishStatus = "draft" | "published" | "archived";
type TaskDifficulty = "beginner" | "intermediate" | "advanced";

interface SaveAdminTaskInput {
  taskId?: string | null;
  slug: string;
  title: string;
  summary: string;
  instructions: string;
  category: string;
  difficulty: TaskDifficulty;
  estimatedMinutes: number;
  tags: string[];
  status: PublishStatus;
  starterCode: string;
}

async function ensureDefaultRubric(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  taskId: string
) {
  const { data: existingRubric } = await supabase
    .from("rubrics")
    .select("id")
    .eq("task_id", taskId)
    .maybeSingle();

  if (existingRubric?.id) return;

  const { data: rubric, error: rubricError } = await supabase
    .from("rubrics")
    .insert({
      task_id: taskId,
      title: "Scoring rubric",
      description: "Scores correctness, edge cases, code quality, tests, and explanation quality.",
      total_points: 100,
    })
    .select("id")
    .single();

  if (rubricError || !rubric?.id) {
    throw new Error(rubricError?.message ?? "Could not create rubric.");
  }

  const { error: itemsError } = await supabase.from("rubric_items").insert([
    {
      rubric_id: rubric.id,
      position: 1,
      label: "Correctness",
      description: "The solution satisfies the required behavior.",
      max_points: 40,
    },
    {
      rubric_id: rubric.id,
      position: 2,
      label: "Edge cases",
      description: "The solution handles realistic boundary and failure cases.",
      max_points: 20,
    },
    {
      rubric_id: rubric.id,
      position: 3,
      label: "Code quality",
      description: "The implementation is simple, readable, and maintainable.",
      max_points: 20,
    },
    {
      rubric_id: rubric.id,
      position: 4,
      label: "Testing",
      description: "The solution adds or updates useful tests.",
      max_points: 10,
    },
    {
      rubric_id: rubric.id,
      position: 5,
      label: "Explanation",
      description: "The submission explains the approach and assumptions.",
      max_points: 10,
    },
  ]);

  if (itemsError) {
    throw new Error(itemsError.message);
  }
}

export async function saveAdminTask(input: SaveAdminTaskInput) {
  const admin = await requireAdminProfile();

  if (!admin) {
    return { ok: false, message: "Only admins can create or edit tasks." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const taskPayload = {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    instructions: input.instructions,
    category: input.category,
    difficulty: input.difficulty,
    estimated_minutes: input.estimatedMinutes,
    tags: input.tags,
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  };

  const { data: task, error: taskError } = input.taskId
    ? await supabase
        .from("tasks")
        .update(taskPayload)
        .eq("id", input.taskId)
        .select("id, slug")
        .single()
    : await supabase
        .from("tasks")
        .insert({
          ...taskPayload,
          created_by: admin.id,
        })
        .select("id, slug")
        .single();

  if (taskError || !task?.id) {
    return { ok: false, message: taskError?.message ?? "Could not save task." };
  }

  const { error: fileError } = await supabase.from("task_files").upsert(
    {
      task_id: task.id,
      file_path: "starter.txt",
      language: "Text",
      file_role: "starter",
      content: input.starterCode,
      sort_order: 1,
    },
    { onConflict: "task_id,file_path" }
  );

  if (fileError) {
    return { ok: false, message: fileError.message };
  }

  try {
    await ensureDefaultRubric(supabase, task.id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not create default rubric.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${task.slug}`);

  return {
    ok: true,
    message: input.taskId ? "Task updated in Supabase." : "Task created in Supabase.",
    taskId: task.id,
    slug: task.slug,
  };
}

export async function updateTaskPublishStatus(taskId: string, status: PublishStatus) {
  const admin = await requireAdminProfile();

  if (!admin) {
    return { ok: false, message: "Only admins can change task publishing status." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .select("slug")
    .single();

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/tasks");
  if (data?.slug) revalidatePath(`/tasks/${data.slug}`);

  return {
    ok: true,
    message: status === "published" ? "Task published." : "Task unpublished.",
    status,
  };
}
