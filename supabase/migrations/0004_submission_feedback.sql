create table public.submission_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  ai_model text not null,
  overall_score integer not null check (overall_score >= 0 and overall_score <= 100),
  correctness_score integer not null check (correctness_score >= 0 and correctness_score <= 100),
  efficiency_score integer not null check (efficiency_score >= 0 and efficiency_score <= 100),
  readability_score integer not null check (readability_score >= 0 and readability_score <= 100),
  edge_cases_score integer not null check (edge_cases_score >= 0 and edge_cases_score <= 100),
  maintainability_score integer not null check (maintainability_score >= 0 and maintainability_score <= 100),
  security_score integer not null check (security_score >= 0 and security_score <= 100),
  summary text not null,
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  improvement_suggestions text[] not null default '{}',
  next_steps text[] not null default '{}',
  visible_test_assessment text,
  rubric_scores jsonb not null default '[]'::jsonb,
  raw_feedback jsonb not null,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submission_feedback_raw_object check (jsonb_typeof(raw_feedback) = 'object'),
  constraint submission_feedback_rubric_array check (jsonb_typeof(rubric_scores) = 'array')
);

create index submission_feedback_user_id_idx on public.submission_feedback(user_id);
create index submission_feedback_task_id_idx on public.submission_feedback(task_id);
create index submission_feedback_generated_at_idx on public.submission_feedback(generated_at desc);
create index submission_feedback_overall_score_idx on public.submission_feedback(overall_score desc);

create trigger touch_submission_feedback_updated_at
  before update on public.submission_feedback
  for each row execute function public.touch_updated_at();

alter table public.submission_feedback enable row level security;

create policy "Users can read their own submission feedback"
  on public.submission_feedback
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Reviewers can read submission feedback"
  on public.submission_feedback
  for select
  to authenticated
  using (public.can_review_tasks());

create policy "Reviewers can update submission feedback"
  on public.submission_feedback
  for update
  to authenticated
  using (public.can_review_tasks())
  with check (public.can_review_tasks());
