# Week 4 AI Feedback Setup

## Supabase Edge Function

The AI feedback function lives at:

```text
supabase/functions/ai-feedback
```

It expects an authenticated request with a submitted submission ID:

```json
{
  "submissionId": "submission-uuid",
  "visibleTestResults": "Optional visible test output from the runner"
}
```

## Required Secrets

Set these in Supabase before deploying or serving the function:

```powershell
supabase secrets set GEMINI_API_KEY="your-gemini-api-key"
supabase secrets set GEMINI_MODEL="gemini-3.5-flash"
```

Supabase normally provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions. For local function serving, also provide
those values in your local Supabase environment.

## What The Function Does

1. Verifies the logged-in user from the `Authorization` header.
2. Loads the submitted solution, task instructions, visible tests, and rubric.
3. Builds a structured AI review prompt.
4. Calls Gemini with JSON-only response instructions.
5. Stores the score and structured feedback in `submission_feedback`.
6. Updates the submission with the latest overall score and review status.

## App Retry Behavior

The submission result page calls the deployed `ai-feedback` function from the logged-in browser
session. Failed requests show the real Edge Function error response instead of a generic failure.

The app retries transient failures up to three times:

- rate limit responses
- temporary server errors
- temporary Gemini gateway failures
- network failures

The app does not retry permanent errors such as missing sessions, draft submissions, missing
submissions, missing database tables, missing secrets, or unsupported Gemini model names.

## Stored Feedback Shape

The Edge Function asks Gemini for JSON with:

- `score`
- `category_scores.correctness`
- `category_scores.efficiency`
- `category_scores.readability`
- `category_scores.edge_cases`
- `category_scores.maintainability`
- `category_scores.security`
- `summary`
- `strengths`
- `weaknesses`
- `improvement_suggestions`
- `visible_test_assessment`
- `rubric_scores`
- `next_steps`

Run this migration before testing stored feedback:

```powershell
supabase db push
```

## Testing From The App

Some Supabase CLI versions do not support `supabase functions invoke`. Test feedback generation
from the app instead:

1. Run `npm run dev`.
2. Sign in as a normal developer.
3. Open one of the sample tasks.
4. Start the task, make a small edit, save, and submit.
5. Open the submission result page.
6. Click `Generate AI feedback`.
7. Confirm `submission_feedback` has a new row.
8. Confirm the related `submissions` row has `score`, `reviewer_feedback`, `reviewed_at`, and
   `status = in_review`.

Run this workflow for the Week 4 sample tasks:

- Python: `csv-parser`
- Docker: `docker-multistage`
- Git: `git-rebase`
- Code review: `ai-dockerfile-review`
