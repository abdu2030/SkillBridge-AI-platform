import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PublicPortfolioItem } from "@/lib/portfolio/server";

interface PortfolioItemCardProps {
  item: PublicPortfolioItem;
  showReviewerComment?: boolean;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function PortfolioItemCard({ item, showReviewerComment = true }: PortfolioItemCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{item.summary}</p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-lg font-semibold tabular-nums text-text">{item.score}%</p>
              <Badge variant="success">Approved</Badge>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{item.category}</Badge>
            {item.skills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
            <span className="text-xs text-text-tertiary">{formatDate(item.approvedAt)}</span>
          </div>

          {showReviewerComment && item.reviewerComment && (
            <div className="mt-4 rounded-lg border-l-2 border-accent bg-gray-50 px-3 py-2">
              <p className="text-xs leading-5 text-text-secondary">"{item.reviewerComment}"</p>
              <p className="mt-1 text-xs text-text-tertiary">Reviewer comment</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
