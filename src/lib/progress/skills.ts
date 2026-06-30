export type SkillArea =
  "python" | "docker" | "git" | "code_review" | "frontend" | "backend" | "database";

export interface SkillDefinition {
  key: SkillArea;
  label: string;
  keywords: string[];
}

export interface ReviewedTaskScore {
  taskId: string;
  title: string;
  category: string;
  tags: string[];
  status: string;
  reviewerScore: number | null;
  aiScore: number | null;
  portfolioApproved: boolean;
  reviewedAt: string | null;
}

export interface CalculatedSkillProgress {
  skill: SkillArea;
  label: string;
  completedCount: number;
  approvedCount: number;
  portfolioCount: number;
  averageScore: number;
  bestScore: number;
  latestScore: number | null;
  lastActivityAt: string | null;
}

export const skillDefinitions: SkillDefinition[] = [
  {
    key: "python",
    label: "Python",
    keywords: ["python", "csv", "async", "pytest", "debugging"],
  },
  {
    key: "docker",
    label: "Docker",
    keywords: ["docker", "dockerfile", "container", "image", "ci/cd", "build"],
  },
  {
    key: "git",
    label: "Git",
    keywords: ["git", "rebase", "merge", "conflict", "version control"],
  },
  {
    key: "code_review",
    label: "Code review",
    keywords: ["code review", "review", "ai evaluation", "feedback", "security finding"],
  },
  {
    key: "frontend",
    label: "Frontend",
    keywords: ["frontend", "react", "next.js", "ui", "css", "accessibility"],
  },
  {
    key: "backend",
    label: "Backend",
    keywords: ["backend", "api", "server", "auth", "node", "request handler"],
  },
  {
    key: "database",
    label: "Database",
    keywords: ["database", "sql", "postgres", "supabase", "migration", "query"],
  },
];

const fallbackSkill: SkillArea = "backend";

function normalize(value: string) {
  return value.toLowerCase().replace(/[_-]/g, " ");
}

function getTaskSearchText(task: Pick<ReviewedTaskScore, "title" | "category" | "tags">) {
  return normalize([task.title, task.category, ...task.tags].join(" "));
}

export function getSkillForTask(task: Pick<ReviewedTaskScore, "title" | "category" | "tags">) {
  const searchText = getTaskSearchText(task);
  const match = skillDefinitions.find((skill) =>
    skill.keywords.some((keyword) => searchText.includes(normalize(keyword)))
  );

  return match?.key ?? fallbackSkill;
}

function getUsableScore(task: ReviewedTaskScore) {
  return task.reviewerScore ?? task.aiScore;
}

function createEmptyProgress(skill: SkillDefinition): CalculatedSkillProgress {
  return {
    skill: skill.key,
    label: skill.label,
    completedCount: 0,
    approvedCount: 0,
    portfolioCount: 0,
    averageScore: 0,
    bestScore: 0,
    latestScore: null,
    lastActivityAt: null,
  };
}

export function calculateSkillProgress(tasks: ReviewedTaskScore[]) {
  const grouped = new Map<SkillArea, ReviewedTaskScore[]>();

  skillDefinitions.forEach((skill) => grouped.set(skill.key, []));
  tasks.forEach((task) => {
    const skill = getSkillForTask(task);
    grouped.get(skill)?.push(task);
  });

  return skillDefinitions.map((skill) => {
    const skillTasks = grouped.get(skill.key) ?? [];
    if (skillTasks.length === 0) return createEmptyProgress(skill);

    const scoredTasks = skillTasks
      .map((task) => ({ task, score: getUsableScore(task) }))
      .filter((entry): entry is { task: ReviewedTaskScore; score: number } => entry.score !== null);
    const latestTask = [...skillTasks]
      .filter((task) => task.reviewedAt)
      .sort((a, b) => Date.parse(b.reviewedAt ?? "") - Date.parse(a.reviewedAt ?? ""))[0];
    const totalScore = scoredTasks.reduce((total, entry) => total + entry.score, 0);
    const averageScore = scoredTasks.length > 0 ? Math.round(totalScore / scoredTasks.length) : 0;

    return {
      skill: skill.key,
      label: skill.label,
      completedCount: skillTasks.length,
      approvedCount: skillTasks.filter((task) => task.status === "approved").length,
      portfolioCount: skillTasks.filter((task) => task.portfolioApproved).length,
      averageScore,
      bestScore: scoredTasks.length > 0 ? Math.max(...scoredTasks.map((entry) => entry.score)) : 0,
      latestScore: latestTask ? getUsableScore(latestTask) : null,
      lastActivityAt: latestTask?.reviewedAt ?? null,
    } satisfies CalculatedSkillProgress;
  });
}

export function getStrongestSkill(progress: CalculatedSkillProgress[]) {
  return [...progress]
    .filter((item) => item.completedCount > 0)
    .sort((a, b) => b.averageScore - a.averageScore || b.completedCount - a.completedCount)[0];
}

export function getSkillNeedingWork(progress: CalculatedSkillProgress[]) {
  return [...progress]
    .filter((item) => item.completedCount > 0)
    .sort((a, b) => a.averageScore - b.averageScore || b.completedCount - a.completedCount)[0];
}
