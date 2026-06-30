import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicPortfolioSkill {
  name: string;
  score: number;
  completedCount: number;
}

export interface PublicPortfolioBadge {
  name: string;
  description: string;
  category: string;
  points: number;
  earnedAt: string;
}

export interface PublicPortfolioItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  skills: string[];
  score: number;
  reviewerComment: string;
  approvedAt: string;
}

export interface PublicPortfolioData {
  profile: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    joinedAt: string;
    isPublic: boolean;
  };
  stats: {
    approvedTasks: number;
    averageScore: number;
    badgeCount: number;
    strongestSkill: string;
  };
  skills: PublicPortfolioSkill[];
  badges: PublicPortfolioBadge[];
  items: PublicPortfolioItem[];
}

interface ProfileRow {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  portfolio_is_public: boolean;
}

interface PortfolioItemRow {
  id: string;
  title: string;
  summary: string;
  category: string;
  skills: string[] | null;
  score: number;
  reviewer_comment: string;
  approved_at: string;
}

interface UserBadgeRow {
  earned_at: string;
  badges?: {
    name: string;
    description: string;
    category: string;
    points: number;
  } | null;
}

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function calculateSkills(items: PublicPortfolioItem[]) {
  const grouped = new Map<string, { total: number; count: number }>();

  items.forEach((item) => {
    const current = grouped.get(item.category) ?? { total: 0, count: 0 };
    grouped.set(item.category, {
      total: current.total + item.score,
      count: current.count + 1,
    });
  });

  return Array.from(grouped.entries())
    .map(([name, value]) => ({
      name,
      score: Math.round(value.total / value.count),
      completedCount: value.count,
    }))
    .sort((a, b) => b.score - a.score || b.completedCount - a.completedCount);
}

function getFallbackPortfolio(userId: string): PublicPortfolioData {
  const items: PublicPortfolioItem[] = [
    {
      id: "sample-portfolio-1",
      title: "Fix broken Python CSV parser",
      summary: "Handled quoted commas, empty rows, malformed headers, and mixed line endings.",
      category: "Python Debugging",
      skills: ["Python", "Edge cases", "Testing"],
      score: 91,
      reviewerComment: "Clean fix with strong edge-case coverage and a clear explanation.",
      approvedAt: new Date().toISOString(),
    },
  ];
  const skills = calculateSkills(items);

  return {
    profile: {
      id: userId,
      fullName: "SkillBridge Developer",
      avatarUrl: null,
      joinedAt: new Date().toISOString(),
      isPublic: true,
    },
    stats: {
      approvedTasks: items.length,
      averageScore: 91,
      badgeCount: 1,
      strongestSkill: skills[0]?.name ?? "Portfolio evidence",
    },
    skills,
    badges: [
      {
        name: "First Submission",
        description: "Submitted and reviewed a first solution.",
        category: "milestone",
        points: 10,
        earnedAt: new Date().toISOString(),
      },
    ],
    items,
  };
}

async function getPortfolioData(userId: string, options: { requirePublic: boolean }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getFallbackPortfolio(userId);

  const itemsQuery = supabase
    .from("portfolio_items")
    .select("id, title, summary, category, skills, score, reviewer_comment, approved_at")
    .eq("user_id", userId)
    .order("approved_at", { ascending: false });

  if (options.requirePublic) {
    itemsQuery.eq("is_public", true);
  }

  const [profileResult, itemsResult, badgesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url, created_at, portfolio_is_public")
      .eq("id", userId)
      .maybeSingle(),
    itemsQuery,
    supabase
      .from("user_badges")
      .select("earned_at, badges(name, description, category, points)")
      .eq("user_id", userId)
      .not("earned_at", "is", null)
      .order("earned_at", { ascending: false }),
  ]);

  if (profileResult.error || itemsResult.error || !profileResult.data) return null;

  const profile = profileResult.data as ProfileRow;
  if (options.requirePublic && !profile.portfolio_is_public) return null;

  const items = ((itemsResult.data as PortfolioItemRow[] | null) ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: item.category,
    skills: item.skills ?? [],
    score: item.score,
    reviewerComment: item.reviewer_comment,
    approvedAt: item.approved_at,
  }));
  const skills = calculateSkills(items);
  const averageScore =
    items.length > 0
      ? Math.round(items.reduce((total, item) => total + item.score, 0) / items.length)
      : 0;
  const badges = ((badgesResult.data as unknown as UserBadgeRow[] | null) ?? [])
    .map((badgeRow) => {
      const badge = firstRelation(badgeRow.badges);
      if (!badge) return null;

      return {
        name: badge.name,
        description: badge.description,
        category: badge.category,
        points: badge.points,
        earnedAt: badgeRow.earned_at,
      };
    })
    .filter((badge): badge is PublicPortfolioBadge => Boolean(badge));

  return {
    profile: {
      id: profile.id,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      joinedAt: profile.created_at,
      isPublic: profile.portfolio_is_public,
    },
    stats: {
      approvedTasks: items.length,
      averageScore,
      badgeCount: badges.length,
      strongestSkill: skills[0]?.name ?? "No public skill yet",
    },
    skills,
    badges,
    items,
  } satisfies PublicPortfolioData;
}

export async function getPublicPortfolio(userId: string) {
  return getPortfolioData(userId, { requirePublic: true });
}

export async function getOwnerPortfolio(userId: string) {
  return getPortfolioData(userId, { requirePublic: false });
}
