import { ReviewSubmissionClient } from "@/app/(app)/reviewer/[id]/review-submission-client";
import { Card, CardTitle } from "@/components/ui/card";
import { requireReviewerProfile } from "@/lib/auth/server";
import { getReviewerReviewData } from "@/lib/reviewer/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ReviewerSubmissionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewerSubmissionPage({ params }: ReviewerSubmissionPageProps) {
  const reviewer = await requireReviewerProfile();

  if (!reviewer) {
    return (
      <div className="max-w-xl">
        <Card>
          <CardTitle>Reviewer access required</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            This area is restricted to reviewer and admin accounts. Sign in with the correct role to
            review submitted solutions.
          </p>
        </Card>
      </div>
    );
  }

  const { id } = await params;
  const review = await getReviewerReviewData(id);

  if (!review) {
    notFound();
  }

  return <ReviewSubmissionClient review={review} />;
}
