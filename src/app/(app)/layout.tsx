import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const { data: profile } =
    supabase && user
      ? await supabase
          .from("profiles")
          .select("id, full_name, role, avatar_url")
          .eq("id", user.id)
          .maybeSingle()
      : { data: null };

  const userProfile = user
    ? {
        id: user.id,
        fullName:
          profile?.full_name ??
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ??
          "Developer",
        role: profile?.role ?? "developer",
        avatarUrl: profile?.avatar_url ?? null,
        email: user.email ?? null,
      }
    : null;

  return <DashboardLayout profile={userProfile}>{children}</DashboardLayout>;
}
