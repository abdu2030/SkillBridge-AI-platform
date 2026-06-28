"use client";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { UserProfile } from "@/lib/auth/types";
import type { ReactNode } from "react";

export function DashboardLayout({
  children,
  profile,
}: {
  children: ReactNode;
  profile: UserProfile | null;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={profile?.role ?? "developer"} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar profile={profile} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
