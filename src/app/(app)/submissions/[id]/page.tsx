import { SubmissionResultClient } from "@/app/(app)/submissions/[id]/submission-result-client";
import { getSubmissionResult } from "@/lib/submissions/data";
import { notFound } from "next/navigation";

interface SubmissionResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubmissionResultPage({ params }: SubmissionResultPageProps) {
  const { id } = await params;
  const submission = getSubmissionResult(id);

  if (!submission) {
    notFound();
  }

  return <SubmissionResultClient submission={submission} />;
}
