"use server";

import { getCurrentProfile } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePortfolioPrivacy(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const isPublic = formData.get("portfolio_is_public") === "true";
  const { error } = await supabase
    .from("profiles")
    .update({ portfolio_is_public: isPublic })
    .eq("id", profile.id);

  if (error) return;

  revalidatePath("/portfolio");
  revalidatePath(`/u/${profile.id}`);
}
