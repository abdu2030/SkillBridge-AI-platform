import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");

function readMigrations() {
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => fs.readFileSync(path.join(migrationsDir, file), "utf8"))
    .join("\n")
    .toLowerCase();
}

const sql = readMigrations();

function assertRlsEnabled(table: string) {
  assert.match(sql, new RegExp(`alter table public\\.${table}\\s+enable row level security`));
}

function assertPolicy(table: string, phrase: string) {
  assert.ok(
    sql.includes(`on public.${table}`) && sql.includes(phrase.toLowerCase()),
    `Expected ${table} policy phrase: ${phrase}`
  );
}

test("profiles RLS protects owner data and public portfolio profile names", () => {
  assertRlsEnabled("profiles");
  assertPolicy("profiles", "Users can read their own profile");
  assertPolicy("profiles", "Users can update their own profile");
  assertPolicy("profiles", "Public can read portfolio profile names");
  assert.match(sql, /profiles\.portfolio_is_public/);
});

test("tasks RLS allows published reads and admin-only task management", () => {
  assertRlsEnabled("tasks");
  assertPolicy("tasks", "Published tasks are readable by signed-in users");
  assertPolicy("tasks", "Admins can create tasks");
  assertPolicy("tasks", "Admins can update tasks");
  assertPolicy("tasks", "Admins can delete tasks");
});

test("submissions RLS separates developer drafts from reviewer access", () => {
  assertRlsEnabled("submissions");
  assertPolicy("submissions", "Users can read their own submissions");
  assertPolicy("submissions", "Users can update their own drafts");
  assertPolicy("submissions", "Reviewers can read submitted work");
  assertPolicy("submissions", "Reviewers can update submitted work");
});

test("submission feedback RLS exposes feedback to owners and reviewers only", () => {
  assertRlsEnabled("submission_feedback");
  assertPolicy("submission_feedback", "Users can read their own submission feedback");
  assertPolicy("submission_feedback", "Reviewers can read submission feedback");
  assertPolicy("submission_feedback", "Reviewers can update submission feedback");
});

test("reviews RLS limits manual review writes to reviewer roles", () => {
  assertRlsEnabled("reviews");
  assertPolicy("reviews", "Users can read reviews for their submissions");
  assertPolicy("reviews", "Reviewers can read reviews");
  assertPolicy("reviews", "Reviewers can create reviews");
  assertPolicy("reviews", "Reviewers can update reviews");
});

test("portfolio item RLS requires public profile and public item visibility", () => {
  assertRlsEnabled("portfolio_items");
  assertPolicy("portfolio_items", "Public portfolio items are readable");
  assertPolicy("portfolio_items", "Users can read their own portfolio items");
  assertPolicy("portfolio_items", "Users can hide their own portfolio items");
  assert.match(sql, /portfolio_items\.is_public/);
  assert.match(sql, /profiles\.portfolio_is_public/);
});
