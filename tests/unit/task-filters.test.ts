import assert from "node:assert/strict";
import test from "node:test";
import { tasks } from "@/lib/tasks/data";
import { filterTasks } from "@/lib/tasks/filters";

test("task filters search title, category, summary, difficulty, and skills", () => {
  const results = filterTasks(tasks, { search: "quoted commas" });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, "csv-parser");
});

test("task filters combine category and difficulty", () => {
  const results = filterTasks(tasks, {
    category: "Docker",
    difficulty: "Intermediate",
  });

  assert.ok(results.length > 0);
  assert.ok(results.every((task) => task.category === "Docker"));
  assert.ok(results.every((task) => task.difficulty === "Intermediate"));
});

test("task filters return all tasks when filters are empty", () => {
  assert.equal(filterTasks(tasks, {}).length, tasks.length);
});
