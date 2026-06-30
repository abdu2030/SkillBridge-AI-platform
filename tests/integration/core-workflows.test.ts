import assert from "node:assert/strict";
import test from "node:test";
import { validateLoginForm, validateRegisterForm } from "@/lib/auth/validators";
import { calculateSkillProgress } from "@/lib/progress/skills";
import { getTaskById, tasks, type Task } from "@/lib/tasks/data";
import { filterTasks } from "@/lib/tasks/filters";

interface FakeUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface FakeSubmission {
  id: string;
  userId: string;
  taskId: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  code: string;
  feedbackScore: number | null;
  reviewerScore: number | null;
  portfolioApproved: boolean;
}

function registerUser(input: { name: string; email: string; password: string; confirm: string }) {
  const errors = validateRegisterForm(input);
  if (Object.keys(errors).length > 0) return { user: null, errors };

  return {
    errors,
    user: {
      id: "user-1",
      name: input.name,
      email: input.email,
      password: input.password,
    },
  };
}

function loginUser(user: FakeUser, input: { email: string; password: string }) {
  const errors = validateLoginForm(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: user.email === input.email && user.password === input.password,
    errors: {},
  };
}

function openTask(taskId: string): Task {
  const task = getTaskById(taskId);
  assert.ok(task, `Expected task ${taskId} to exist`);
  return task;
}

function saveDraft(user: FakeUser, task: Task, code: string): FakeSubmission {
  return {
    id: "submission-1",
    userId: user.id,
    taskId: task.id,
    status: "draft",
    code,
    feedbackScore: null,
    reviewerScore: null,
    portfolioApproved: false,
  };
}

function submitSolution(submission: FakeSubmission): FakeSubmission {
  return { ...submission, status: "submitted" };
}

function attachFeedback(submission: FakeSubmission, score: number): FakeSubmission {
  return { ...submission, feedbackScore: score };
}

function approveSubmission(
  submission: FakeSubmission,
  reviewerScore: number,
  portfolioApproved: boolean
): FakeSubmission {
  return {
    ...submission,
    status: "approved",
    reviewerScore,
    portfolioApproved,
  };
}

test("register and login workflow accepts a valid developer account", () => {
  const { user, errors } = registerUser({
    name: "Jane Developer",
    email: "jane@example.com",
    password: "StrongPass1!",
    confirm: "StrongPass1!",
  });

  assert.deepEqual(errors, {});
  assert.ok(user);
  assert.deepEqual(loginUser(user, { email: "jane@example.com", password: "StrongPass1!" }), {
    ok: true,
    errors: {},
  });
});

test("task opening workflow finds published tasks through filters and loads details", () => {
  const pythonTasks = filterTasks(tasks, { search: "csv", category: "Python Debugging" });
  const task = openTask(pythonTasks[0].id);

  assert.equal(task.id, "csv-parser");
  assert.ok(task.instructions.length > 0);
  assert.ok(task.starterFiles.length > 0);
  assert.ok(task.rubric.length > 0);
});

test("submission and feedback workflow preserves code and records AI score", () => {
  const { user } = registerUser({
    name: "Jane Developer",
    email: "jane@example.com",
    password: "StrongPass1!",
    confirm: "StrongPass1!",
  });
  assert.ok(user);

  const task = openTask("csv-parser");
  const draft = saveDraft(user, task, "def parse_csv(source):\n    return []\n");
  const submitted = submitSolution(draft);
  const withFeedback = attachFeedback(submitted, 84);

  assert.equal(withFeedback.status, "submitted");
  assert.equal(withFeedback.code, draft.code);
  assert.equal(withFeedback.feedbackScore, 84);
});

test("reviewer approval workflow updates progress and portfolio evidence", () => {
  const { user } = registerUser({
    name: "Jane Developer",
    email: "jane@example.com",
    password: "StrongPass1!",
    confirm: "StrongPass1!",
  });
  assert.ok(user);

  const task = openTask("csv-parser");
  const approved = approveSubmission(
    attachFeedback(submitSolution(saveDraft(user, task, "fixed code")), 82),
    91,
    true
  );
  const progress = calculateSkillProgress([
    {
      taskId: approved.taskId,
      title: task.title,
      category: task.category,
      tags: task.skills,
      status: approved.status,
      reviewerScore: approved.reviewerScore,
      aiScore: approved.feedbackScore,
      portfolioApproved: approved.portfolioApproved,
      reviewedAt: "2026-06-30T10:00:00.000Z",
    },
  ]);
  const python = progress.find((item) => item.skill === "python");

  assert.equal(approved.status, "approved");
  assert.equal(approved.portfolioApproved, true);
  assert.equal(python?.completedCount, 1);
  assert.equal(python?.approvedCount, 1);
  assert.equal(python?.portfolioCount, 1);
  assert.equal(python?.averageScore, 91);
});
