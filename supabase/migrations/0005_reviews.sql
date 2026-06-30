create type public.review_status as enum (
  'draft',
  'approved',
  'rejected'
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  status public.review_status not null default 'draft',
  reviewer_score integer not null check (reviewer_score >= 0),
  max_score integer not null check (max_score > 0),
  reviewer_percent integer not null check (reviewer_percent >= 0 and reviewer_percent <= 100),
  rubric_scores jsonb not null default '[]'::jsonb,
  reviewer_comment text not null default '',
  portfolio_approved boolean not null default false,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_rubric_scores_array check (jsonb_typeof(rubric_scores) = 'array'),
  constraint reviews_submitted_at_required check (
    status = 'draft'::public.review_status or submitted_at is not null
  )
);

create index reviews_submission_id_idx on public.reviews(submission_id);
create index reviews_task_id_idx on public.reviews(task_id);
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_reviewer_id_idx on public.reviews(reviewer_id);
create index reviews_status_idx on public.reviews(status);
create index reviews_portfolio_approved_idx on public.reviews(portfolio_approved);

create trigger touch_reviews_updated_at
  before update on public.reviews
  for each row execute function public.touch_updated_at();

alter table public.reviews enable row level security;

create policy "Users can read reviews for their submissions"
  on public.reviews
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Reviewers can read reviews"
  on public.reviews
  for select
  to authenticated
  using (public.can_review_tasks());

create policy "Reviewers can create reviews"
  on public.reviews
  for insert
  to authenticated
  with check (
    public.can_review_tasks()
    and reviewer_id = auth.uid()
  );

create policy "Reviewers can update reviews"
  on public.reviews
  for update
  to authenticated
  using (public.can_review_tasks())
  with check (public.can_review_tasks());
