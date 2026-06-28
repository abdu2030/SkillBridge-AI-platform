# Week 1: Foundation, UX Direction, and Core Setup

## Day 1: Product Requirements

Status: complete.

Confirmed product direction:

- SkillBridge AI helps developers practice real production-style engineering tasks instead of only algorithm problems.
- The platform supports three primary roles: Developer, Reviewer, and Admin.
- The GitHub repository target is `abdu2030/SkillBridge-AI-platform.git`.
- The first MVP prioritizes the core learner loop before deeper admin and reviewer expansion.

Core MVP flow:

1. Developer creates an account or logs in.
2. Developer browses task categories and selects a task.
3. Developer works in a task workspace with instructions, files, rubric, visible tests, and notes.
4. Developer submits a solution.
5. AI feedback scores the solution against the rubric.
6. Reviewer can verify the submission and approve it for the developer portfolio.
7. Developer dashboard, submissions, feedback, badges, and portfolio reflect real progress.

Out of initial MVP scope:

- Full code sandbox isolation beyond an internal service boundary.
- Advanced organization/team billing.
- Marketplace-style public task authoring.
- Deep analytics beyond basic admin and learner progress metrics.

## Day 2: Core Setup

Status: complete where already present, gaps filled where missing.

Already present:

- Next.js App Router structure under `src/app`.
- TypeScript configuration with strict mode and `@/*` path aliases.
- Tailwind CSS v4 setup through PostCSS and `src/app/globals.css`.
- ESLint flat config using Next core web vitals.
- Reusable shadcn-style UI components under `src/components/ui`.
- PostgreSQL and Drizzle dependencies/configuration.
- Initial UX prototype screens for landing, auth, dashboard, tasks, workspace, feedback, submissions, reviewer, admin, and portfolio.

Added foundation gaps:

- Project README with repository target, roles, stack, and MVP scope.
- Week 1 foundation documentation.
- Git ignore rules for Next.js, dependencies, environment files, logs, and build output.
- Prettier configuration and package scripts.
- Production project package name.

Do not redo:

- Do not reinitialize the Next.js project.
- Do not reinstall Tailwind, TypeScript, ESLint, or existing app dependencies if already installed.
- Do not replace existing UI components unless a feature requires it.
