import assert from "node:assert/strict";
import test from "node:test";
import { getBadgeProgress } from "@/lib/progress/badges";
import type { CalculatedSkillProgress } from "@/lib/progress/skills";

const progress: CalculatedSkillProgress[] = [
  {
    skill: "python",
    label: "Python",
    completedCount: 3,
    approvedCount: 2,
    portfolioCount: 1,
    averageScore: 88,
    bestScore: 95,
    latestScore: 90,
    lastActivityAt: "2026-06-30T10:00:00.000Z",
  },
  {
    skill: "docker",
    label: "Docker",
    completedCount: 1,
    approvedCount: 1,
    portfolioCount: 0,
    averageScore: 72,
    bestScore: 72,
    latestScore: 72,
    lastActivityAt: "2026-06-29T10:00:00.000Z",
  },
  {
    skill: "git",
    label: "Git",
    completedCount: 0,
    approvedCount: 0,
    portfolioCount: 0,
    averageScore: 0,
    bestScore: 0,
    latestScore: null,
    lastActivityAt: null,
  },
];

test("badge progress counts total completed work", () => {
  assert.deepEqual(getBadgeProgress({ type: "completed_count", target: 4 }, progress), {
    current: 4,
    target: 4,
  });
});

test("badge progress counts skill-specific completions", () => {
  assert.deepEqual(
    getBadgeProgress({ type: "skill_completed_count", skill: "python", target: 1 }, progress),
    { current: 3, target: 1 }
  );
});

test("badge progress counts portfolio approvals and best score", () => {
  assert.deepEqual(getBadgeProgress({ type: "portfolio_count", target: 2 }, progress), {
    current: 1,
    target: 2,
  });
  assert.deepEqual(getBadgeProgress({ type: "best_score", target: 90 }, progress), {
    current: 95,
    target: 90,
  });
});

test("badge progress counts only touched skills for coverage", () => {
  assert.deepEqual(getBadgeProgress({ type: "skill_coverage", target: 7 }, progress), {
    current: 2,
    target: 7,
  });
});
