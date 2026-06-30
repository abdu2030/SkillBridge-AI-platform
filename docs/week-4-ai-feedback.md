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

## Local Invocation Shape

```powershell
supabase functions invoke ai-feedback --body '{ "submissionId": "submission-uuid", "visibleTestResults": "2 passed, 1 failed" }'
```

The request must include a valid user session token when called from the app or API client.
