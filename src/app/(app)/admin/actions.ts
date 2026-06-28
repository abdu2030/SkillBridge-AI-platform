"use server";

import { requireAdminProfile } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type PublishStatus = "draft" | "published" | "archived";

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
