import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateSkillProgress,
  getSkillForTask,
  getSkillNeedingWork,
  getStrongestSkill,
  type ReviewedTaskScore,
} from "@/lib/progress/skills";

const reviewedTasks: ReviewedTaskScore[] = [
  {
    taskId: "python-1",
    title: "Fix broken Python CSV parser",
    category: "Python Debugging",
    tags: ["Python", "CSV"],
    status: "approved",
    reviewerScore: 90,
    aiScore: 75,
    portfolioApproved: true,
    reviewedAt: "2026-06-28T10:00:00.000Z",
  },
  {
    taskId: "docker-1",
    title: "Fix Docker build",
    category: "Docker",
    tags: ["Dockerfile"],
    status: "rejected",
    reviewerScore: 62,
    aiScore: 80,
    portfolioApproved: false,
    reviewedAt: "2026-06-29T10:00:00.000Z",
  },
  {
    taskId: "python-2",
    title: "Debug async handler",
    category: "Backend",
    tags: ["Python", "Async"],
    status: "approved",
    reviewerScore: null,
    aiScore: 82,
    portfolioApproved: false,
    reviewedAt: "2026-06-30T10:00:00.000Z",
  },
];

test("skill detection maps realistic task text to the right skill", () => {
  assert.equal(
    getSkillForTask({
      title: "Review AI-generated Dockerfile",
      category: "Code Review",
      tags: ["Docker", "Security"],
    }),
    "docker"
  );
});

test("skill progress calculates counts, averages, best score, and latest score", () => {
  const progress = calculateSkillProgress(reviewedTasks);
  const python = progress.find((item) => item.skill === "python");
  const docker = progress.find((item) => item.skill === "docker");

  assert.equal(python?.completedCount, 2);
  assert.equal(python?.approvedCount, 2);
  assert.equal(python?.portfolioCount, 1);
  assert.equal(python?.averageScore, 86);
  assert.equal(python?.bestScore, 90);
  assert.equal(python?.latestScore, 82);
  assert.equal(docker?.completedCount, 1);
  assert.equal(docker?.averageScore, 62);
});

test("strongest and weakest skill ignore untouched skills", () => {
  const progress = calculateSkillProgress(reviewedTasks);

  assert.equal(getStrongestSkill(progress)?.skill, "python");
  assert.equal(getSkillNeedingWork(progress)?.skill, "docker");
});
