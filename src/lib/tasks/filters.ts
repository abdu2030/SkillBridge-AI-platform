import type { Task } from "@/lib/tasks/data";

export interface TaskFilterInput {
  search?: string;
  category?: string;
  difficulty?: string;
}

export function filterTasks(tasks: Task[], filters: TaskFilterInput) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  const category = filters.category ?? "All";
  const difficulty = filters.difficulty ?? "All";

  return tasks.filter((task) => {
    const searchable = [task.title, task.summary, task.category, task.difficulty, ...task.skills]
      .join(" ")
      .toLowerCase();

    if (query && !searchable.includes(query)) return false;
    if (category !== "All" && task.category !== category) return false;
    if (difficulty !== "All" && task.difficulty !== difficulty) return false;
    return true;
  });
}
