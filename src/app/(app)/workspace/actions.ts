"use server";

import { getCurrentProfile } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface WorkspaceFileSnapshot {
  name: string;
  content: string;
}

interface WorkspaceDraftInput {
  taskSlug: string;
  files: WorkspaceFileSnapshot[];
}

async function getTaskId(taskSlug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, taskId: null, error: "Supabase is not configured." };

  const { data: task, error } = await supabase
    .from("tasks")
    .select("id")
    .eq("slug", taskSlug)
    .maybeSingle();

  if (error || !task?.id) {
    return { supabase, taskId: null, error: error?.message ?? "Task was not found." };
  }

  return { supabase, taskId: task.id as string, error: null };
}

export async function saveWorkspaceDraft(input: WorkspaceDraftInput) {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: "Sign in to save your draft." };

  const { supabase, taskId, error } = await getTaskId(input.taskSlug);
  if (!supabase || !taskId) return { ok: false, message: error ?? "Could not save draft." };

  const { data: existingDraft, error: draftLookupError } = await supabase
    .from("submissions")
    .select("id")
    .eq("task_id", taskId)
    .eq("user_id", profile.id)
    .eq("status", "draft")
    .maybeSingle();

  if (draftLookupError) return { ok: false, message: draftLookupError.message };

  const payload = {
    task_id: taskId,
    user_id: profile.id,
    status: "draft",
    file_snapshot: input.files,
  };

  const query = existingDraft?.id
    ? supabase
        .from("submissions")
        .update({ file_snapshot: input.files })
        .eq("id", existingDraft.id)
        .select("id, updated_at")
        .single()
    : supabase.from("submissions").insert(payload).select("id, updated_at").single();

  const { data, error: saveError } = await query;
  if (saveError || !data) {
    return { ok: false, message: saveError?.message ?? "Could not save draft." };
  }

  revalidatePath("/workspace");

  return {
    ok: true,
    message: "Draft saved.",
    submissionId: data.id as string,
    savedAt: data.updated_at as string,
  };
}

export async function submitWorkspaceSolution(input: WorkspaceDraftInput) {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: "Sign in to submit your solution." };

  const { supabase, taskId, error } = await getTaskId(input.taskSlug);
  if (!supabase || !taskId) return { ok: false, message: error ?? "Could not submit solution." };

  const { data: existingDraft, error: draftLookupError } = await supabase
    .from("submissions")
    .select("id")
    .eq("task_id", taskId)
    .eq("user_id", profile.id)
    .eq("status", "draft")
    .maybeSingle();

  if (draftLookupError) return { ok: false, message: draftLookupError.message };

  const submittedAt = new Date().toISOString();

  const query = existingDraft?.id
    ? supabase
        .from("submissions")
        .update({
          status: "submitted",
          file_snapshot: input.files,
          submitted_at: submittedAt,
        })
        .eq("id", existingDraft.id)
        .select("id, status, submitted_at")
        .single()
    : supabase
        .from("submissions")
        .insert({
          task_id: taskId,
          user_id: profile.id,
          status: "submitted",
          file_snapshot: input.files,
          submitted_at: submittedAt,
        })
        .select("id, status, submitted_at")
        .single();

  const { data, error: submitError } = await query;
  if (submitError || !data) {
    return { ok: false, message: submitError?.message ?? "Could not submit solution." };
  }

  revalidatePath("/workspace");
  revalidatePath("/submissions");

  return {
    ok: true,
    message: "Solution submitted.",
    submissionId: data.id as string,
    status: data.status as string,
    submittedAt: data.submitted_at as string,
  };
}
