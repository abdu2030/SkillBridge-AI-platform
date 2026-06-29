# Supabase Setup

Create a Supabase project from the Supabase dashboard, then copy these values into `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Authentication providers to enable:

- Email/password
- Google OAuth, when Google credentials are ready

Redirect URLs:

- `http://localhost:3000/auth/callback`
- Production site URL plus `/auth/callback`

Run SQL migrations from `supabase/migrations` in order before testing auth-dependent features:

1. `0001_foundation.sql`
2. `0002_task_library.sql`
3. `0003_submissions.sql`

After at least one admin user exists, run `supabase/seed.sql` to add the sample Python debugging,
Dockerfile fixing, Git workflow, and AI code review tasks.
