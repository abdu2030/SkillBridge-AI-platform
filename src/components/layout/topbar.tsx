"use client";
import { Search, Bell, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import { usePathname } from "next/navigation";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: Library },
  { href: "/workspace", label: "Workspace", icon: Code2 },
  { href: "/submissions", label: "Submissions", icon: Send },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/portfolio", label: "Portfolio", icon: Globe },
  { href: "/badges", label: "Badges", icon: Award },
  { href: "/reviewer", label: "Reviewer", icon: ClipboardCheck },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Topbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-text-secondary cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold">SkillBridge</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search tasks, submissions..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-bg placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary border border-border rounded px-1.5 py-0.5 hidden lg:inline">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-hover transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="w-8 h-8 bg-accent/10 border border-border rounded-full flex items-center justify-center ml-1">
              <span className="text-xs font-semibold text-accent">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-bg-card border-r border-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold">SkillBridge</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-0.5">
              {mobileNavItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-accent-light text-accent"
                        : "text-text-secondary hover:text-text hover:bg-surface-hover"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
