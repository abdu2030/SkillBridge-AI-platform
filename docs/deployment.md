# Deployment Guide

Use this checklist when moving SkillBridge AI from local development to Vercel.

## Vercel Setup

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as Next.js.
3. Use these commands:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave blank
4. Add these Vercel environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL=https://hublhjnslzyxguavwpsn.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key`
   - `DATABASE_URL=your_supabase_postgres_connection_string`
   - `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`

Do not put the Supabase service role key in browser code. It is only for server-side operations.

## Supabase Auth URLs

In Supabase, open Authentication > URL Configuration.

Set Site URL to:

```text
https://your-vercel-domain.vercel.app
```

Add Redirect URLs:

```text
https://your-vercel-domain.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Keep the localhost callback while you are still testing locally.

## Supabase Edge Function Secrets

Gemini secrets belong in Supabase, not Vercel:

```bash
supabase secrets set GEMINI_API_KEY="your_key"
supabase secrets set GEMINI_MODEL="gemini-2.5-flash"
```

If PowerShell blocks `supabase`, use:

```bash
supabase.cmd secrets set GEMINI_API_KEY="your_key"
supabase.cmd secrets set GEMINI_MODEL="gemini-2.5-flash"
```

Then deploy the function:

```bash
supabase.cmd functions deploy ai-feedback --project-ref hublhjnslzyxguavwpsn
```

## Production Smoke Test

1. Open the deployed Vercel URL.
2. Register a new developer account.
3. Confirm the auth callback returns to the app.
4. Open the Task Library and view a published task.
5. Open the workspace, edit a file, save a draft, and submit.
6. Generate AI feedback on the result page.
7. Sign in as reviewer, review the submission, and approve it for portfolio evidence.
8. Open Portfolio, make it public, copy the full public URL, and test it in a private browser window.
