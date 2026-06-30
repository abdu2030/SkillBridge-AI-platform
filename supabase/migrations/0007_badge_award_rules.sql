drop policy if exists "Reviewers can create calculated progress" on public.user_progress;
drop policy if exists "Reviewers can update calculated progress" on public.user_progress;
drop policy if exists "Reviewers can create badge progress" on public.user_badges;
drop policy if exists "Reviewers can update badge progress" on public.user_badges;

create policy "Reviewers can create calculated progress"
  on public.user_progress
  for insert
  to authenticated
  with check (public.can_review_tasks());

create policy "Reviewers can update calculated progress"
  on public.user_progress
  for update
  to authenticated
  using (public.can_review_tasks())
  with check (public.can_review_tasks());

create policy "Reviewers can create badge progress"
  on public.user_badges
  for insert
  to authenticated
  with check (public.can_review_tasks());

create policy "Reviewers can update badge progress"
  on public.user_badges
  for update
  to authenticated
  using (public.can_review_tasks())
  with check (public.can_review_tasks());

insert into public.badges (slug, name, description, category, icon, points, criteria, sort_order)
values
  (
    'python-debugger',
    'Python Debugger',
    'Complete your first reviewed Python task.',
    'skill',
    'code',
    20,
    '{"type": "skill_completed_count", "skill": "python", "target": 1}'::jsonb,
    15
  ),
  (
    'docker-fixer',
    'Docker Fixer',
    'Complete your first reviewed Docker task.',
    'skill',
    'shield',
    20,
    '{"type": "skill_completed_count", "skill": "docker", "target": 1}'::jsonb,
    25
  ),
  (
    'code-review-starter',
    'Code Review Starter',
    'Complete your first reviewed code review task.',
    'skill',
    'badge-check',
    20,
    '{"type": "skill_completed_count", "skill": "code_review", "target": 1}'::jsonb,
    35
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  icon = excluded.icon,
  points = excluded.points,
  criteria = excluded.criteria,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();
