"use client";

import { cn } from "@/lib/utils";
import type { AppRole } from "@/lib/auth/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Code2,
  Send,
  MessageSquare,
  Globe,
  Award,
  Settings,
  Shield,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: Library },
  { href: "/workspace", label: "Workspace", icon: Code2 },
  { href: "/submissions", label: "Submissions", icon: Send },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/portfolio", label: "Portfolio", icon: Globe },
  { href: "/badges", label: "Badges", icon: Award },
];

const bottomItems = [
  { href: "/reviewer", label: "Reviewer", icon: ClipboardCheck, roles: ["reviewer", "admin"] },
  { href: "/admin", label: "Admin", icon: Shield, roles: ["admin"] },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    roles: ["developer", "reviewer", "admin"],
  },
] satisfies Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: AppRole[];
}>;

export function Sidebar({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const visibleBottomItems = bottomItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r border-border bg-bg-card transition-all duration-200 sticky top-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-text">SkillBridge</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center mx-auto">
            <Code2 className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-text-tertiary hover:text-text transition-colors cursor-pointer",
            collapsed && "mx-auto mt-2"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent-light text-accent"
                  : "text-text-secondary hover:text-text hover:bg-surface-hover",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="py-3 px-2 border-t border-border space-y-0.5">
        {visibleBottomItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent-light text-accent"
                  : "text-text-secondary hover:text-text hover:bg-surface-hover",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
