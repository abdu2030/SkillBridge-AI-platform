# Week 5 Reviewer Workflow

## What Is Implemented

- Reviewer/admin permission check for `/reviewer` and `/reviewer/[id]`.
- Reviewer dashboard with pending submissions, task type, submitted date, user, status, and AI score.
- Submission review page with task instructions, submitted code, AI feedback, and rubric checklist.
- Manual scoring with live reviewer score calculation.
- Reviewer written comments.
- Approval/rejection status.
- Portfolio approval checkbox.
- `reviews` table storage.
- Submission status update after review.

## Database Migration

Run the reviews migration before testing persistence:

```powershell
supabase.cmd db push
```

If you already apply migrations manually in Supabase, run `supabase/migrations/0005_reviews.sql`.

## Full Test Workflow

1. Sign in as a developer.
2. Open a sample task and submit a solution.
3. Generate AI feedback from the submission result page.
4. Change your profile role to `reviewer` or `admin`.
5. Open `/reviewer`.
6. Confirm the submitted solution appears in the pending queue.
7. Click `Open submission`.
8. Review task instructions, submitted code, and AI feedback.
9. Check each rubric item and adjust manual scores.
10. Confirm the reviewer score updates live.
11. Write a reviewer comment.
12. Check `Approve for portfolio`.
13. Click `Approve submission`.
14. Confirm `reviews` has a row for the submission.
15. Confirm `submissions.status` is `approved`.
16. Confirm `submissions.reviewer_feedback`, `reviewer_id`, `reviewed_at`, and `score` are updated.

Rejection path:

1. Open another pending submission.
2. Enter lower rubric scores.
3. Write improvement feedback.
4. Click `Needs improvement`.
5. Confirm `reviews.status` is `rejected`.
6. Confirm `submissions.status` is `rejected`.
