"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import {
  taskCategories,
  taskDifficulties,
  tasks as sampleTasks,
  type TaskDifficulty,
} from "@/lib/tasks/data";
import {
  ClipboardCheck,
  Eye,
  FileCode,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type AdminTaskStatus = "Draft" | "Published" | "Archived";

interface AdminTask {
  id: string;
  title: string;
  category: string;
  difficulty: TaskDifficulty;
  estimatedMinutes: number;
  tags: string[];
  status: AdminTaskStatus;
  summary: string;
  instructions: string;
  starterCode: string;
  submissions: number;
}

interface TaskFormState {
  title: string;
  category: string;
  difficulty: TaskDifficulty;
  estimatedMinutes: string;
  tags: string;
  status: AdminTaskStatus;
  summary: string;
  instructions: string;
  starterCode: string;
}

const categoryOptions = taskCategories.filter((category) => category !== "All");
const difficultyOptions = taskDifficulties.filter((difficulty) => difficulty !== "All");

const emptyForm: TaskFormState = {
  title: "",
  category: "Python Debugging",
  difficulty: "Intermediate",
  estimatedMinutes: "30",
  tags: "",
  status: "Draft",
  summary: "",
  instructions: "",
  starterCode: "",
};

const initialAdminTasks: AdminTask[] = sampleTasks.slice(0, 4).map((task, index) => ({
  id: task.id,
  title: task.title,
  category: task.category,
  difficulty: task.difficulty,
  estimatedMinutes: task.estimatedMinutes,
  tags: task.skills,
  status: index === 3 ? "Draft" : "Published",
  summary: task.summary,
  instructions: task.instructions.join("\n"),
  starterCode: `# ${task.starterFiles[0]?.name ?? "starter file"}\n# Starter code will be stored here.`,
  submissions: [245, 156, 134, 0][index] ?? 0,
}));

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

const statusBadge: Record<AdminTaskStatus, "default" | "success" | "warning"> = {
  Draft: "default",
  Published: "success",
  Archived: "warning",
};

function createSlug(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `task-${Date.now()}`
  );
}

function formFromTask(task: AdminTask): TaskFormState {
  return {
    title: task.title,
    category: task.category,
    difficulty: task.difficulty,
    estimatedMinutes: String(task.estimatedMinutes),
    tags: task.tags.join(", "),
    status: task.status,
    summary: task.summary,
    instructions: task.instructions,
    starterCode: task.starterCode,
  };
}

export default function AdminPage() {
  const [adminTasks, setAdminTasks] = useState(initialAdminTasks);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<TaskFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return adminTasks;

    return adminTasks.filter((task) =>
      [task.title, task.category, task.difficulty, task.status, ...task.tags]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [adminTasks, search]);

  const stats = [
    { label: "Total users", value: "1,248", icon: Users, change: "+42 this week" },
    {
      label: "Total tasks",
      value: String(adminTasks.length),
      icon: FileCode,
      change: `${adminTasks.filter((task) => task.status === "Draft").length} drafts`,
    },
    {
      label: "Total submissions",
      value: adminTasks.reduce((total, task) => total + task.submissions, 0).toLocaleString(),
      icon: Send,
      change: "+318 this week",
    },
    { label: "Pending reviews", value: "23", icon: ClipboardCheck, change: "5 overdue" },
  ];

  function updateForm<K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormMessage("");
  }

  function startCreate() {
    setActiveTab("tasks");
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setFormMessage("New task form is ready.");
  }

  function startEdit(task: AdminTask) {
    setActiveTab("tasks");
    setEditingId(task.id);
    setForm(formFromTask(task));
    setFormOpen(true);
    setFormMessage(`Editing ${task.title}.`);
  }

  function deleteTask(taskId: string) {
    setAdminTasks((current) => current.filter((task) => task.id !== taskId));
    if (editingId === taskId) startCreate();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTask: AdminTask = {
      id: editingId ?? createSlug(form.title),
      title: form.title.trim(),
      category: form.category,
      difficulty: form.difficulty,
      estimatedMinutes: Number(form.estimatedMinutes) || 30,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: form.status,
      summary: form.summary.trim(),
      instructions: form.instructions.trim(),
      starterCode: form.starterCode,
      submissions: editingId
        ? (adminTasks.find((task) => task.id === editingId)?.submissions ?? 0)
        : 0,
    };

    setAdminTasks((current) => {
      if (editingId) {
        return current.map((task) => (task.id === editingId ? nextTask : task));
      }

      return [nextTask, ...current.filter((task) => task.id !== nextTask.id)];
    });

    setEditingId(nextTask.id);
    setForm(formFromTask(nextTask));
    setFormMessage(editingId ? "Task updated." : "Task created.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Admin dashboard</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Platform management and analytics.</p>
        </div>
        <Button size="sm" onClick={startCreate}>
          <Plus className="h-4 w-4" />
          Create task
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-secondary">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold text-text">{stat.value}</p>
                <p className="mt-1 text-xs text-text-tertiary">{stat.change}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-gray-50">
                <stat.icon className="h-4 w-4 text-text-secondary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            id: "tasks",
            label: "Manage Tasks",
            count: adminTasks.length,
            content: (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                {formOpen && (
                  <Card className="order-1 xl:order-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{editingId ? "Edit task" : "Create task"}</CardTitle>
                          <p className="mt-1 text-xs text-text-secondary">
                            {editingId ? "Update task content." : "Add a task draft."}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormOpen(false)}
                          className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text"
                          aria-label="Close task form"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <Input
                        label="Title"
                        required
                        value={form.title}
                        onChange={(event) => updateForm("title", event.target.value)}
                      />

                      <Input
                        label="Summary"
                        required
                        value={form.summary}
                        onChange={(event) => updateForm("summary", event.target.value)}
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="space-y-1.5 text-sm font-medium text-text">
                          Category
                          <select
                            value={form.category}
                            onChange={(event) => updateForm("category", event.target.value)}
                            className="w-full rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          >
                            {categoryOptions.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-1.5 text-sm font-medium text-text">
                          Difficulty
                          <select
                            value={form.difficulty}
                            onChange={(event) =>
                              updateForm("difficulty", event.target.value as TaskDifficulty)
                            }
                            className="w-full rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          >
                            {difficultyOptions.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          label="Estimated minutes"
                          type="number"
                          min={1}
                          required
                          value={form.estimatedMinutes}
                          onChange={(event) => updateForm("estimatedMinutes", event.target.value)}
                        />

                        <label className="space-y-1.5 text-sm font-medium text-text">
                          Status
                          <select
                            value={form.status}
                            onChange={(event) =>
                              updateForm("status", event.target.value as AdminTaskStatus)
                            }
                            className="w-full rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </label>
                      </div>

                      <Input
                        label="Tags"
                        value={form.tags}
                        placeholder="Python, File I/O, Error Handling"
                        onChange={(event) => updateForm("tags", event.target.value)}
                      />

                      <label className="space-y-1.5 text-sm font-medium text-text">
                        Instructions
                        <textarea
                          required
                          rows={5}
                          value={form.instructions}
                          onChange={(event) => updateForm("instructions", event.target.value)}
                          className="w-full resize-none rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </label>

                      <label className="space-y-1.5 text-sm font-medium text-text">
                        Starter code
                        <textarea
                          required
                          rows={7}
                          value={form.starterCode}
                          onChange={(event) => updateForm("starterCode", event.target.value)}
                          className="w-full resize-none rounded-lg border border-border bg-[#1e1e2e] px-3 py-2 font-mono text-xs leading-6 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </label>

                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-success">{formMessage}</p>
                        <Button type="submit">
                          <Save className="h-4 w-4" />
                          {editingId ? "Save changes" : "Create task"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="order-2 space-y-4 xl:order-1">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                    <Input
                      aria-label="Search admin tasks"
                      placeholder="Search tasks..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <Card padding="none">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                              Title
                            </th>
                            <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary sm:table-cell">
                              Category
                            </th>
                            <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary md:table-cell">
                              Difficulty
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                              Status
                            </th>
                            <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary sm:table-cell">
                              Submissions
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-medium text-text-secondary">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-surface-hover transition-colors">
                              <td className="px-5 py-3">
                                <p className="font-medium text-text">{task.title}</p>
                                <p className="mt-0.5 text-xs text-text-tertiary">
                                  {task.estimatedMinutes} min / {task.tags.slice(0, 2).join(", ")}
                                </p>
                              </td>
                              <td className="hidden px-5 py-3 text-xs text-text-secondary sm:table-cell">
                                {task.category}
                              </td>
                              <td className="hidden px-5 py-3 md:table-cell">
                                <Badge variant="outline">{task.difficulty}</Badge>
                              </td>
                              <td className="px-5 py-3">
                                <Badge variant={statusBadge[task.status]}>{task.status}</Badge>
                              </td>
                              <td className="hidden px-5 py-3 tabular-nums text-text-secondary sm:table-cell">
                                {task.submissions}
                              </td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Link
                                    href={`/tasks/${task.id}`}
                                    className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text"
                                    aria-label={`View ${task.title}`}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => startEdit(task)}
                                    className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text"
                                    aria-label={`Edit ${task.title}`}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteTask(task.id)}
                                    className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-error"
                                    aria-label={`Delete ${task.title}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
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
                        <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                          Name
                        </th>
                        <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary sm:table-cell">
                          Email
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary">
                          Role
                        </th>
                        <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary md:table-cell">
                          Submissions
                        </th>
                        <th className="hidden px-5 py-3 text-left text-xs font-medium text-text-secondary md:table-cell">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-surface-hover transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                                {user.name
                                  .split(" ")
                                  .map((name) => name[0])
                                  .join("")}
                              </div>
                              <span className="font-medium text-text">{user.name}</span>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3 text-xs text-text-secondary sm:table-cell">
                            {user.email}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant={roleBadge[user.role]}>{user.role}</Badge>
                          </td>
                          <td className="hidden px-5 py-3 tabular-nums text-text-secondary md:table-cell">
                            {user.submissions}
                          </td>
                          <td className="hidden px-5 py-3 text-xs text-text-tertiary md:table-cell">
                            {user.joined}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardTitle>Most popular tasks</CardTitle>
                  <div className="mt-4 space-y-3">
                    {adminTasks
                      .slice()
                      .sort((a, b) => b.submissions - a.submissions)
                      .slice(0, 5)
                      .map((task, index) => (
                        <div key={task.id} className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="w-4 shrink-0 text-xs font-semibold tabular-nums text-text-tertiary">
                              {index + 1}
                            </span>
                            <span className="truncate text-sm text-text">{task.title}</span>
                          </div>
                          <span className="text-xs tabular-nums text-text-secondary">
                            {task.submissions}
                          </span>
                        </div>
                      ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>Category distribution</CardTitle>
                  <div className="mt-4 space-y-3">
                    {categoryOptions.slice(0, 6).map((category) => {
                      const count = adminTasks.filter((task) => task.category === category).length;
                      const pct = Math.round((count / Math.max(adminTasks.length, 1)) * 100);

                      return (
                        <div key={category}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm text-text">{category}</span>
                            <span className="text-xs tabular-nums text-text-secondary">{pct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
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
