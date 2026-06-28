"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, Search, Filter, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TaskStatus = "Not started" | "In progress" | "Submitted" | "Approved";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Task {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  time: string;
  skills: string[];
  status: TaskStatus;
  description: string;
}

const tasks: Task[] = [
  {
    id: "csv-parser",
    title: "Fix broken Python CSV parser",
    category: "Python Debugging",
    difficulty: "Intermediate",
    time: "35 min",
    skills: ["Python", "File I/O", "Error Handling"],
    status: "Not started",
    description:
      "The parser works for simple files but fails on empty rows, quoted commas, and missing headers.",
  },
  {
    id: "docker-multistage",
    title: "Fix Docker multi-stage build",
    category: "Docker",
    difficulty: "Intermediate",
    time: "30 min",
    skills: ["Docker", "CI/CD", "Build Optimization"],
    status: "Not started",
    description:
      "The Dockerfile builds locally but fails in CI. Fix the multi-stage build and reduce the final image size.",
  },
  {
    id: "async-handler",
    title: "Debug async Python request handler",
    category: "Python Debugging",
    difficulty: "Advanced",
    time: "45 min",
    skills: ["Python", "Async/Await", "HTTP"],
    status: "Submitted",
    description:
      "The async handler drops connections under load. Find the race condition and fix the connection pool logic.",
  },
  {
    id: "ai-dockerfile-review",
    title: "Review AI-generated Dockerfile",
    category: "Code Review",
    difficulty: "Intermediate",
    time: "25 min",
    skills: ["Docker", "Security", "Code Review"],
    status: "In progress",
    description:
      "Review an AI-generated Dockerfile and identify security issues, inefficiencies, and best practice violations.",
  },
  {
    id: "git-rebase",
    title: "Resolve Git rebase conflict",
    category: "Git",
    difficulty: "Beginner",
    time: "20 min",
    skills: ["Git", "Version Control"],
    status: "Approved",
    description:
      "A feature branch has conflicts after rebasing onto main. Resolve the conflicts and maintain both changes.",
  },
  {
    id: "sql-injection",
    title: "Fix SQL injection vulnerability",
    category: "Security",
    difficulty: "Advanced",
    time: "40 min",
    skills: ["SQL", "Security", "Backend"],
    status: "Not started",
    description:
      "The user search endpoint is vulnerable to SQL injection. Fix the query construction without breaking existing functionality.",
  },
  {
    id: "rest-api-integration",
    title: "Integrate third-party REST API",
    category: "API Integration",
    difficulty: "Intermediate",
    time: "40 min",
    skills: ["REST API", "Error Handling", "TypeScript"],
    status: "Not started",
    description:
      "Connect to an external weather API, handle rate limiting, retries, and transform the response into the app schema.",
  },
  {
    id: "react-state-bug",
    title: "Fix React state management bug",
    category: "Frontend",
    difficulty: "Intermediate",
    time: "30 min",
    skills: ["React", "State Management", "Hooks"],
    status: "Not started",
    description:
      "The shopping cart component loses items when navigating between pages. Fix the state persistence issue.",
  },
  {
    id: "unit-test-coverage",
    title: "Write unit tests for auth module",
    category: "Backend",
    difficulty: "Intermediate",
    time: "35 min",
    skills: ["Testing", "Jest", "Authentication"],
    status: "Not started",
    description:
      "The authentication module has 0% test coverage. Write comprehensive tests for login, registration, and token refresh.",
  },
];

const allCategories = [
  "All",
  "Python Debugging",
  "Docker",
  "Code Review",
  "Git",
  "Security",
  "API Integration",
  "Frontend",
  "Backend",
  "Database",
  "JavaScript Debugging",
  "AI Response Evaluation",
];

const difficultyColors: Record<Difficulty, string> = {
  Beginner: "bg-success-light text-success",
  Intermediate: "bg-warning-light text-warning",
  Advanced: "bg-error-light text-error",
};

const statusConfig: Record<
  TaskStatus,
  { variant: "default" | "success" | "warning" | "accent"; label: string }
> = {
  "Not started": { variant: "default", label: "Not started" },
  "In progress": { variant: "accent", label: "In progress" },
  Submitted: { variant: "warning", label: "Submitted" },
  Approved: { variant: "success", label: "Approved" },
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && t.category !== category) return false;
    if (difficulty !== "All" && t.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Task library</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Browse {tasks.length} real-world engineering tasks across 11 categories.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border transition-colors cursor-pointer",
            showFilters
              ? "bg-accent-light text-accent border-accent/30"
              : "bg-bg-card text-text-secondary hover:bg-surface-hover"
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {(category !== "All" || difficulty !== "All") && (
            <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
              {(category !== "All" ? 1 : 0) + (difficulty !== "All" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <Card padding="md">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-text-secondary mb-2">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
                      category === cat
                        ? "bg-accent text-white"
                        : "bg-gray-50 text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary mb-2">Difficulty</p>
              <div className="flex gap-1.5">
                {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
                      difficulty === d
                        ? "bg-accent text-white"
                        : "bg-gray-50 text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {(category !== "All" || difficulty !== "All") && (
              <button
                onClick={() => {
                  setCategory("All");
                  setDifficulty("All");
                }}
                className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text cursor-pointer"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Results */}
      <p className="text-xs text-text-tertiary">
        {filtered.length} task{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((task) => (
          <Card
            key={task.id}
            padding="none"
            className="flex flex-col hover:border-border-strong transition-colors"
          >
            <div className="p-5 flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text leading-snug">{task.title}</h3>
                <Badge variant={statusConfig[task.status].variant}>
                  {statusConfig[task.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span>{task.category}</span>
                <span>·</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    difficultyColors[task.difficulty]
                  )}
                >
                  {task.difficulty}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {task.time}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{task.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {task.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <Link href={`/tasks/${task.id}`}>
                <Button
                  size="sm"
                  variant={task.status === "In progress" ? "primary" : "secondary"}
                  className="w-full"
                >
                  {task.status === "Not started"
                    ? "Start task"
                    : task.status === "In progress"
                      ? "Continue"
                      : "View submission"}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-text">No tasks match your filters</p>
          <p className="text-sm text-text-secondary mt-1">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setDifficulty("All");
            }}
            className="text-sm text-accent hover:underline mt-3 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
