import { TaskLibraryClient } from "@/app/(app)/tasks/task-library-client";
import { getPublishedTasks } from "@/lib/tasks/server";

export default async function TasksPage() {
  const tasks = await getPublishedTasks();

  return <TaskLibraryClient initialTasks={tasks} />;
}
