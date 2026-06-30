import type { CalculatedSkillProgress } from "@/lib/progress/skills";

export function getBadgeProgress(
  criteria: Record<string, unknown>,
  progress: CalculatedSkillProgress[]
) {
  const type = criteria.type;
  const target = Math.max(1, Number(criteria.target) || 1);
  const skill = typeof criteria.skill === "string" ? criteria.skill : null;
  const totalCompleted = progress.reduce((total, item) => total + item.completedCount, 0);
  const totalPortfolio = progress.reduce((total, item) => total + item.portfolioCount, 0);
  const bestScore = progress.reduce((best, item) => Math.max(best, item.bestScore), 0);
  const skillProgress = skill ? progress.find((item) => item.skill === skill) : null;

  if (type === "completed_count") return { current: totalCompleted, target };
  if (type === "portfolio_count") return { current: totalPortfolio, target };
  if (type === "best_score") return { current: bestScore, target };
  if (type === "skill_coverage") {
    return { current: progress.filter((item) => item.completedCount > 0).length, target };
  }
  if (type === "skill_completed_count") {
    return { current: skillProgress?.completedCount ?? 0, target };
  }
  if (type === "skill_approved_count") {
    return { current: skillProgress?.approvedCount ?? 0, target };
  }

  return { current: 0, target };
}
