import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/auth/types";

export interface CurrentProfile {
  id: string;
  fullName: string;
  role: AppRole;
  email: string | null;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    fullName:
      profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
    role: (profile?.role ?? "developer") as AppRole,
    email: user.email ?? null,
  };
}

export async function requireAdminProfile() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin" ? profile : null;
}
