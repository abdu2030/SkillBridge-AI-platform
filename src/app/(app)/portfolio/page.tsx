import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { getCurrentProfile } from "@/lib/auth/server";
import { getPublicPortfolio } from "@/lib/portfolio/server";
import Link from "next/link";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getScoreColor(score: number): "success" | "accent" | "warning" {
  if (score >= 85) return "success";
  if (score >= 70) return "accent";
  return "warning";
}

export default async function PortfolioPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="max-w-xl">
        <Card>
          <CardTitle>Sign in required</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Sign in to view and share your SkillBridge portfolio.
          </p>
        </Card>
      </div>
    );
  }

  const portfolio = await getPublicPortfolio(profile.id);

  if (!portfolio) {
    return (
      <div className="max-w-xl">
        <Card>
          <CardTitle>Portfolio unavailable</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Your portfolio data could not be loaded right now.
          </p>
        </Card>
      </div>
    );
  }

  const publicUrl = `/u/${profile.id}`;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Portfolio</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Share your reviewer-approved work and earned badges.
          </p>
        </div>
        <Link href={publicUrl}>
          <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover">
            View public page
          </span>
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-text-secondary">Approved tasks</p>
          <p className="mt-1 text-2xl font-semibold text-text">{portfolio.stats.approvedTasks}</p>
        </Card>
        <Card>
          <p className="text-xs text-text-secondary">Average score</p>
          <p className="mt-1 text-2xl font-semibold text-text">{portfolio.stats.averageScore}%</p>
        </Card>
        <Card>
          <p className="text-xs text-text-secondary">Earned badges</p>
          <p className="mt-1 text-2xl font-semibold text-text">{portfolio.stats.badgeCount}</p>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Skill scores</CardTitle>
          <CardDescription>Calculated from portfolio-approved reviews</CardDescription>
          {portfolio.skills.length > 0 ? (
            <div className="mt-4 space-y-4">
              {portfolio.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-sm text-text">{skill.name}</span>
                    <span className="text-xs font-medium tabular-nums text-text-secondary">
                      {skill.score}% - {skill.completedCount} approved
                    </span>
                  </div>
                  <Progress value={skill.score} color={getScoreColor(skill.score)} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No portfolio skills yet"
              description="Ask a reviewer to mark strong approved work as portfolio evidence."
            />
          )}
        </Card>

        <Card>
          <CardTitle>Earned badges</CardTitle>
          <CardDescription>Milestones that can appear on your public page</CardDescription>
          {portfolio.badges.length > 0 ? (
            <div className="mt-4 space-y-3">
              {portfolio.badges.slice(0, 4).map((badge) => (
                <div key={`${badge.name}-${badge.earnedAt}`} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                    <span className="text-xs font-semibold">BD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{badge.name}</p>
                    <p className="text-xs text-text-secondary">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No badges earned yet"
              description="Badges appear after reviewed progress is awarded."
            />
          )}
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-text">Approved submissions</h2>
        {portfolio.items.length > 0 ? (
          <div className="space-y-3">
            {portfolio.items.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{item.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-xs text-text-tertiary">
                        {formatDate(item.approvedAt)}
                      </span>
                    </div>
                    {item.reviewerComment && (
                      <p className="mt-3 rounded-lg border-l-2 border-accent bg-gray-50 px-3 py-2 text-xs leading-5 text-text-secondary">
                        "{item.reviewerComment}"
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-semibold tabular-nums text-text">{item.score}%</p>
                    <Badge variant="success">Approved</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              title="No portfolio-approved submissions yet"
              description="Approved submissions appear here after a reviewer marks them for portfolio use."
            />
          </Card>
        )}
      </section>
    </div>
  );
}
