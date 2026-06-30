# Week 6 Progress, Badges, and Skill Analytics

## Day 1 Tables

Migration `supabase/migrations/0006_progress_badges.sql` adds:

- `user_progress`
- `badges`
- `user_badges`
- `skill_area` enum
- badge seed records
- row-level security policies

Run the migration before testing persisted progress:

```powershell
supabase.cmd db push
```

If you apply migrations manually, run `0006_progress_badges.sql` in the Supabase SQL editor.

## Day 2 Skill Calculations

Skill scoring is implemented in:

```text
src/lib/progress/skills.ts
src/lib/progress/server.ts
```

Supported skill areas:

- Python
- Docker
- Git
- Code review
- Frontend
- Backend
- Database

Scores are calculated from completed manual reviews. The calculation uses reviewer percent first,
then AI/submission score as fallback. It tracks:

- completed count
- approved count
- portfolio-approved count
- average score
- best score
- latest score
- last activity date

After a reviewer saves an approval or rejection, the app refreshes `user_progress` for that
developer.

## Test Workflow

1. Apply migration `0006_progress_badges.sql`.
2. Sign in as reviewer/admin.
3. Open `/reviewer`.
4. Open a submitted solution.
5. Enter rubric scores and approve or reject it.
6. Check `reviews` for the saved review.
7. Check `user_progress` for updated skill rows.
8. Check `badges` for seeded badge definitions.
9. Check `user_badges` is ready for badge-award logic in the next steps.
