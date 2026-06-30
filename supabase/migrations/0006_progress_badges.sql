create type public.skill_area as enum (
  'python',
  'docker',
  'git',
  'code_review',
  'frontend',
  'backend',
  'database'
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill public.skill_area not null,
  completed_count integer not null default 0 check (completed_count >= 0),
  approved_count integer not null default 0 check (approved_count >= 0),
  portfolio_count integer not null default 0 check (portfolio_count >= 0),
  average_score integer not null default 0 check (average_score >= 0 and average_score <= 100),
  best_score integer not null default 0 check (best_score >= 0 and best_score <= 100),
  latest_score integer check (latest_score is null or (latest_score >= 0 and latest_score <= 100)),
  last_activity_at timestamptz,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_progress_unique_skill unique (user_id, skill),
  constraint user_progress_counts_valid check (
    approved_count <= completed_count
    and portfolio_count <= approved_count
  )
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  category text not null default 'achievement',
  icon text not null default 'award',
  points integer not null default 0 check (points >= 0),
  criteria jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint badges_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint badges_criteria_object check (jsonb_typeof(criteria) = 'object')
);

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz,
  progress_current integer not null default 0 check (progress_current >= 0),
  progress_target integer not null default 1 check (progress_target > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_badges_unique_badge unique (user_id, badge_id),
  constraint user_badges_progress_valid check (progress_current <= progress_target),
  constraint user_badges_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create index user_progress_user_id_idx on public.user_progress(user_id);
create index user_progress_skill_idx on public.user_progress(skill);
create index user_progress_average_score_idx on public.user_progress(average_score desc);
create index badges_active_sort_idx on public.badges(is_active, sort_order);
create index badges_category_idx on public.badges(category);
create index user_badges_user_id_idx on public.user_badges(user_id);
create index user_badges_badge_id_idx on public.user_badges(badge_id);
create index user_badges_earned_at_idx on public.user_badges(earned_at desc);

create trigger touch_user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.touch_updated_at();

create trigger touch_badges_updated_at
  before update on public.badges
  for each row execute function public.touch_updated_at();

create trigger touch_user_badges_updated_at
  before update on public.user_badges
  for each row execute function public.touch_updated_at();

alter table public.user_progress enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

create policy "Users can read their own progress"
  on public.user_progress
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Reviewers can read user progress"
  on public.user_progress
  for select
  to authenticated
  using (public.can_review_tasks());

create policy "Users can upsert their own progress"
  on public.user_progress
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own progress"
  on public.user_progress
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Active badges are readable"
  on public.badges
  for select
  to authenticated
  using (is_active or public.can_review_tasks());

create policy "Admins can manage badges"
  on public.badges
  for all
  to authenticated
  using (public.is_task_admin())
  with check (public.is_task_admin());

create policy "Users can read their own badges"
  on public.user_badges
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Reviewers can read user badges"
  on public.user_badges
  for select
  to authenticated
  using (public.can_review_tasks());

create policy "Users can upsert their own badge progress"
  on public.user_badges
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own badge progress"
  on public.user_badges
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

insert into public.badges (slug, name, description, category, icon, points, criteria, sort_order)
values
  (
    'first-submission',
    'First Submission',
    'Submit your first solution.',
    'milestone',
    'send',
    10,
    '{"type": "completed_count", "target": 1}'::jsonb,
    10
  ),
  (
    'python-proficient',
    'Python Proficient',
    'Complete 5 Python tasks with reviewer approval.',
    'skill',
    'code',
    40,
    '{"type": "skill_approved_count", "skill": "python", "target": 5}'::jsonb,
    20
  ),
  (
    'docker-expert',
    'Docker Expert',
    'Complete 10 Docker tasks.',
    'skill',
    'shield',
    60,
    '{"type": "skill_completed_count", "skill": "docker", "target": 10}'::jsonb,
    30
  ),
  (
    'reviewer-approved',
    'Reviewer Approved',
    'Get 3 submissions approved for portfolio evidence.',
    'portfolio',
    'star',
    50,
    '{"type": "portfolio_count", "target": 3}'::jsonb,
    40
  ),
  (
    'high-scorer',
    'High Scorer',
    'Score 90 or higher on any reviewed task.',
    'performance',
    'target',
    25,
    '{"type": "best_score", "target": 90}'::jsonb,
    50
  ),
  (
    'perfect-score',
    'Perfect Score',
    'Score 100 on any reviewed task.',
    'performance',
    'award',
    75,
    '{"type": "best_score", "target": 100}'::jsonb,
    60
  ),
  (
    'full-stack',
    'Full Stack',
    'Earn progress in all seven SkillBridge skill areas.',
    'skill',
    'layers',
    100,
    '{"type": "skill_coverage", "target": 7}'::jsonb,
    70
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
