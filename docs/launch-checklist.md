# Launch Checklist

## Product QA

- Landing page loads without unstyled content.
- Register, login, logout, and forgot password pages show useful errors.
- Developer dashboard shows empty states for new accounts.
- Task Library filters by category, difficulty, status, and search.
- Task Detail pages show instructions, files, tests, tags, estimated time, and rubric preview.
- Workspace works on mobile, tablet, and desktop.
- Save, autosave, visible tests, and final submission show clear status messages.
- Submission result page displays submitted code and feedback state.
- AI feedback retry flow shows loading and error states.
- Reviewer dashboard lists pending submissions.
- Reviewer page saves rubric scores, comments, status, and portfolio approval.
- Progress dashboard updates after reviewed work.
- Portfolio privacy prevents private profiles from being visible publicly.
- Copy-link buttons copy the full public URL.

## Security QA

- Developers can only read and write their own submissions.
- Reviewers can read pending submissions but cannot manage admin-only task publishing.
- Admin-only task creation and publishing routes reject developer accounts.
- Private portfolio items are not visible from `/u/[id]`.
- Supabase RLS is enabled for profiles, tasks, submissions, feedback, reviews, and portfolio items.
- Service role keys are not exposed in client bundles.

## Release Checks

- `npm run test`
- `npm run format:check`
- `npm run build`
- `npm run typecheck`

## Screenshots To Capture

- Landing page
- Login page
- Developer dashboard
- Task Library with filters
- Task Detail page
- Workspace desktop and mobile layouts
- Submission result with AI feedback
- Reviewer dashboard
- Reviewer rubric review page
- Progress dashboard
- Public portfolio page
- Admin task form

## Production Setup

- Vercel environment variables are set.
- Supabase Site URL points to the production domain.
- Supabase Redirect URLs include production and local callback URLs.
- Supabase Edge Function secrets are set.
- `ai-feedback` Edge Function is deployed.
- Database migrations and seed data are applied.
- A developer, reviewer, and admin account exist for final smoke testing.
