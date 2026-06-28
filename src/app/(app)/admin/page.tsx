"use client";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import {
  Users,
  FileCode,
  Send,
  ClipboardCheck,
  Plus,
  MoreHorizontal,
  Search,
  Shield,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const stats = [
  { label: "Total users", value: "1,248", icon: Users, change: "+42 this week" },
  { label: "Total tasks", value: "143", icon: FileCode, change: "12 drafts" },
  { label: "Total submissions", value: "8,672", icon: Send, change: "+318 this week" },
  { label: "Pending reviews", value: "23", icon: ClipboardCheck, change: "5 overdue" },
];

const tasks = [
  {
    id: "1",
    title: "Fix broken Python CSV parser",
    category: "Python Debugging",
    difficulty: "Intermediate",
    status: "Published",
    submissions: 245,
  },
  {
    id: "2",
    title: "Debug async Python handler",
    category: "Python Debugging",
    difficulty: "Advanced",
    status: "Published",
    submissions: 189,
  },
  {
    id: "3",
    title: "Fix Docker multi-stage build",
    category: "Docker",
    difficulty: "Intermediate",
    status: "Published",
    submissions: 156,
  },
  {
    id: "4",
    title: "Review AI-generated REST API",
    category: "Code Review",
    difficulty: "Intermediate",
    status: "Draft",
    submissions: 0,
  },
  {
    id: "5",
    title: "Fix memory leak in Node.js server",
    category: "Backend",
    difficulty: "Advanced",
    status: "Draft",
    submissions: 0,
  },
];

const users = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Developer",
    submissions: 12,
    joined: "Jan 2025",
  },
  {
    id: "2",
    name: "Alex Kim",
    email: "alex@example.com",
    role: "Developer",
    submissions: 8,
    joined: "Feb 2025",
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "Reviewer",
    submissions: 0,
    joined: "Dec 2024",
  },
  {
    id: "4",
    name: "Chen Wei",
    email: "chen@example.com",
    role: "Developer",
    submissions: 23,
    joined: "Nov 2024",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Admin",
    submissions: 0,
    joined: "Oct 2024",
  },
];

const roleBadge: Record<string, "default" | "accent" | "success"> = {
  Developer: "default",
  Reviewer: "accent",
  Admin: "success",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Admin dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Platform management and analytics.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Create task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-secondary">{stat.label}</p>
                <p className="text-xl font-semibold text-text mt-1">{stat.value}</p>
                <p className="text-xs text-text-tertiary mt-1">{stat.change}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-border flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-text-secondary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: "tasks",
            label: "Manage Tasks",
            count: tasks.length,
            content: (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>
                </div>
                <Card padding="none">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                            Title
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden sm:table-cell">
                            Category
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden md:table-cell">
                            Difficulty
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                            Status
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden sm:table-cell">
                            Submissions
                          </th>
                          <th className="text-right px-5 py-3 text-xs font-medium text-text-secondary">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-surface-hover transition-colors">
                            <td className="px-5 py-3 font-medium text-text">{task.title}</td>
                            <td className="px-5 py-3 text-text-secondary text-xs hidden sm:table-cell">
                              {task.category}
                            </td>
                            <td className="px-5 py-3 hidden md:table-cell">
                              <Badge variant="outline">{task.difficulty}</Badge>
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={task.status === "Published" ? "success" : "default"}>
                                {task.status}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 text-text-secondary tabular-nums hidden sm:table-cell">
                              {task.submissions}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-1.5 rounded-md hover:bg-surface-hover text-text-tertiary hover:text-text transition-colors cursor-pointer">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 rounded-md hover:bg-surface-hover text-text-tertiary hover:text-text transition-colors cursor-pointer">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 rounded-md hover:bg-surface-hover text-text-tertiary hover:text-error transition-colors cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ),
          },
          {
            id: "users",
            label: "Manage Users",
            count: users.length,
            content: (
              <Card padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                          Name
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden sm:table-cell">
                          Email
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary">
                          Role
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden md:table-cell">
                          Submissions
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary hidden md:table-cell">
                          Joined
                        </th>
                        <th className="text-right px-5 py-3 text-xs font-medium text-text-secondary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-surface-hover transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="font-medium text-text">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-text-secondary text-xs hidden sm:table-cell">
                            {user.email}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant={roleBadge[user.role]}>{user.role}</Badge>
                          </td>
                          <td className="px-5 py-3 text-text-secondary tabular-nums hidden md:table-cell">
                            {user.submissions}
                          </td>
                          <td className="px-5 py-3 text-text-tertiary text-xs hidden md:table-cell">
                            {user.joined}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button className="p-1.5 rounded-md hover:bg-surface-hover text-text-tertiary hover:text-text transition-colors cursor-pointer">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ),
          },
          {
            id: "analytics",
            label: "Analytics",
            content: (
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardTitle>Most popular tasks</CardTitle>
                  <div className="mt-4 space-y-3">
                    {[
                      { title: "Fix broken Python CSV parser", count: 245 },
                      { title: "Debug async Python handler", count: 189 },
                      { title: "Fix Docker multi-stage build", count: 156 },
                      { title: "Resolve Git rebase conflict", count: 134 },
                      { title: "Fix SQL injection vulnerability", count: 98 },
                    ].map((t, i) => (
                      <div key={t.title} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-text-tertiary tabular-nums w-4">
                            {i + 1}
                          </span>
                          <span className="text-sm text-text">{t.title}</span>
                        </div>
                        <span className="text-xs text-text-secondary tabular-nums">{t.count}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <CardTitle>Category distribution</CardTitle>
                  <div className="mt-4 space-y-3">
                    {[
                      { category: "Python Debugging", pct: 28 },
                      { category: "Code Review", pct: 22 },
                      { category: "Docker", pct: 15 },
                      { category: "Security", pct: 12 },
                      { category: "Git", pct: 10 },
                      { category: "Other", pct: 13 },
                    ].map((c) => (
                      <div key={c.category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-text">{c.category}</span>
                          <span className="text-xs text-text-secondary tabular-nums">{c.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${c.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
