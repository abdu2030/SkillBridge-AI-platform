# SkillBridge AI Platform

SkillBridge AI is a production-oriented learning platform where developers practice real engineering tasks, submit solutions, receive AI-assisted rubric feedback, and build a verified portfolio.

## Confirmed Foundation

- Repository target: `abdu2030/SkillBridge-AI-platform.git`
- Framework: Next.js with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI direction: shadcn-style reusable components in `src/components/ui`
- Database stack: PostgreSQL with Drizzle ORM
- Main roles: Developer, Reviewer, Admin

## MVP Scope

The first MVP focuses on the core learner loop:

1. Developers sign in and access protected app pages.
2. Developers browse real-world engineering tasks.
3. Developers open a workspace, edit/save a draft, and submit a solution.
4. The platform evaluates submissions with rubric-based AI feedback.
5. Reviewers verify submissions and approve strong work for portfolios.
6. Developers can show approved submissions on a public portfolio.

Admin tools, analytics, and expanded content management come after the learner loop is stable.

## Local Development

Install dependencies, configure environment variables, and run the development server:

```bash
npm install
npm run dev
```

Before committing feature work, run the relevant checks:

```bash
npm run lint
npm run typecheck
npm run build
```
