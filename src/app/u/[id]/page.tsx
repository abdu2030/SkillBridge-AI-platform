import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CopyProfileLink } from "@/components/portfolio/copy-profile-link";
import { PortfolioItemCard } from "@/components/portfolio/portfolio-item-card";
import { Progress } from "@/components/ui/progress";
import { getPublicPortfolio } from "@/lib/portfolio/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PublicPortfolioPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function generateMetadata({ params }: PublicPortfolioPageProps): Promise<Metadata> {
  const { id } = await params;
  const portfolio = await getPublicPortfolio(id);

  if (!portfolio) {
    return {
      title: "Private portfolio | SkillBridge AI",
      description: "This SkillBridge AI portfolio is private.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `${getSiteUrl()}/u/${portfolio.profile.id}`;
  const title = `${portfolio.profile.fullName} | SkillBridge AI Portfolio`;
  const description =
    portfolio.items.length > 0
      ? `${portfolio.profile.fullName} has ${portfolio.stats.approvedTasks} reviewer-approved SkillBridge tasks with an average score of ${portfolio.stats.averageScore}%.`
      : `${portfolio.profile.fullName}'s public SkillBridge AI developer portfolio.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      siteName: "SkillBridge AI",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const { id } = await params;
  const portfolio = await getPublicPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  const { profile, stats, skills, badges, items } = portfolio;
  const publicUrl = `${getSiteUrl()}/u/${profile.id}`;

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <section className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-light text-lg font-bold text-accent">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(profile.fullName)
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-text">{profile.fullName}</h1>
                <Badge variant="success">Reviewer verified</Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                Public SkillBridge portfolio of reviewed engineering tasks, verified skill evidence,
                reviewer comments, and earned badges.
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-text-tertiary">
                Member since {formatDate(profile.joinedAt)}
              </p>
            </div>
          </div>
          <CopyProfileLink url={publicUrl} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs text-text-secondary">Approved tasks</p>
            <p className="mt-1 text-2xl font-semibold text-text">{stats.approvedTasks}</p>
          </Card>
          <Card>
            <p className="text-xs text-text-secondary">Average score</p>
            <p className="mt-1 text-2xl font-semibold text-text">{stats.averageScore}%</p>
          </Card>
          <Card>
            <p className="text-xs text-text-secondary">Earned badges</p>
            <p className="mt-1 text-2xl font-semibold text-text">{stats.badgeCount}</p>
          </Card>
          <Card>
            <p className="text-xs text-text-secondary">Strongest skill</p>
            <p className="mt-1 truncate text-lg font-semibold text-text">{stats.strongestSkill}</p>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardTitle>Skill evidence</CardTitle>
            <CardDescription>Average score by approved portfolio category</CardDescription>
            {skills.length > 0 ? (
              <div className="mt-4 space-y-4">
                {skills.map((skill) => (
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
                title="No public skill evidence yet"
                description="Approved portfolio submissions will appear here."
              />
            )}
          </Card>

          <Card>
            <CardTitle>Earned badges</CardTitle>
            <CardDescription>Verified milestones from reviewed work</CardDescription>
            {badges.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {badges.map((badge) => (
                  <div
                    key={`${badge.name}-${badge.earnedAt}`}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                        <span className="text-xs font-semibold">BD</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">{badge.name}</p>
                        <p className="mt-0.5 text-xs leading-5 text-text-secondary">
                          {badge.description}
                        </p>
                        <p className="mt-1 text-xs text-text-tertiary">
                          {badge.points} pts - {formatDate(badge.earnedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No public badges yet"
                description="Earned badges will appear after reviewed progress is awarded."
              />
            )}
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <h2 className="text-sm font-semibold text-text">Approved portfolio work</h2>
          </div>
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <PortfolioItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                title="No approved public work yet"
                description="Portfolio-approved reviews will appear here once the developer has verified work to share."
              />
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
