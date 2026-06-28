import { TaskDetailClient } from "@/app/(app)/tasks/[id]/task-detail-client";
import { getTaskBySlug } from "@/lib/tasks/server";
import { notFound } from "next/navigation";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = await getTaskBySlug(id);

  if (!task) {
    notFound();
  }

  return <TaskDetailClient task={task} />;
}
