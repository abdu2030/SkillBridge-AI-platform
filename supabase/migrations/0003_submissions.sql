create type public.submission_status as enum (
  'draft',
  'submitted',
  'in_review',
  'approved',
  'rejected'
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.submission_status not null default 'draft',
  file_snapshot jsonb not null default '[]'::jsonb,
  notes text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewer_id uuid references public.profiles(id) on delete set null,
  score integer check (score is null or (score >= 0 and score <= 100)),
  reviewer_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_submitted_at_required check (
    status = 'draft'::public.submission_status or submitted_at is not null
  )
);

create unique index submissions_one_draft_per_task_user_idx
  on public.submissions(user_id, task_id)
  where status = 'draft'::public.submission_status;

create index submissions_user_id_idx on public.submissions(user_id);
create index submissions_task_id_idx on public.submissions(task_id);
create index submissions_status_idx on public.submissions(status);
create index submissions_submitted_at_idx on public.submissions(submitted_at desc);

create trigger touch_submissions_updated_at
  before update on public.submissions
  for each row execute function public.touch_updated_at();

alter table public.submissions enable row level security;

create policy "Users can read their own submissions"
  on public.submissions
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Reviewers can read submitted work"
  on public.submissions
  for select
  to authenticated
  using (
    public.can_review_tasks()
    and status <> 'draft'::public.submission_status
  );

create policy "Users can create their own submissions"
  on public.submissions
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own drafts"
  on public.submissions
  for update
  to authenticated
  using (
    user_id = auth.uid()
    and status = 'draft'::public.submission_status
  )
  with check (
    user_id = auth.uid()
    and status in ('draft'::public.submission_status, 'submitted'::public.submission_status)
  );

create policy "Users can delete their own drafts"
  on public.submissions
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    and status = 'draft'::public.submission_status
  );

create policy "Reviewers can update submitted work"
  on public.submissions
  for update
  to authenticated
  using (
    public.can_review_tasks()
    and status <> 'draft'::public.submission_status
  )
  with check (
    public.can_review_tasks()
    and status <> 'draft'::public.submission_status
  );
