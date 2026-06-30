create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  review_id uuid not null unique references public.reviews(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  title text not null,
  summary text not null,
  category text not null,
  skills text[] not null default '{}',
  score integer not null check (score >= 0 and score <= 100),
  reviewer_comment text not null default '',
  approved_at timestamptz not null default now(),
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_items_user_id_idx on public.portfolio_items(user_id);
create index portfolio_items_task_id_idx on public.portfolio_items(task_id);
create index portfolio_items_public_approved_idx
  on public.portfolio_items(is_public, approved_at desc);

create trigger touch_portfolio_items_updated_at
  before update on public.portfolio_items
  for each row execute function public.touch_updated_at();

alter table public.portfolio_items enable row level security;

create policy "Public portfolio items are readable"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (is_public);

create policy "Users can read their own portfolio items"
  on public.portfolio_items
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Reviewers can read portfolio items"
  on public.portfolio_items
  for select
  to authenticated
  using (public.can_review_tasks());

create policy "Reviewers can create portfolio items"
  on public.portfolio_items
  for insert
  to authenticated
  with check (public.can_review_tasks());

create policy "Reviewers can update portfolio items"
  on public.portfolio_items
  for update
  to authenticated
  using (public.can_review_tasks())
  with check (public.can_review_tasks());

create policy "Users can hide their own portfolio items"
  on public.portfolio_items
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Public can read portfolio profile names"
  on public.profiles
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.portfolio_items
      where portfolio_items.user_id = profiles.id
        and portfolio_items.is_public
    )
  );

create policy "Public can read active portfolio badges"
  on public.badges
  for select
  to anon, authenticated
  using (is_active);

create policy "Public can read earned portfolio badges"
  on public.user_badges
  for select
  to anon, authenticated
  using (
    earned_at is not null
    and exists (
      select 1
      from public.portfolio_items
      where portfolio_items.user_id = user_badges.user_id
        and portfolio_items.is_public
    )
  );

create or replace function public.sync_portfolio_item_from_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved'::public.review_status and new.portfolio_approved then
    insert into public.portfolio_items (
      user_id,
      submission_id,
      review_id,
      task_id,
      title,
      summary,
      category,
      skills,
      score,
      reviewer_comment,
      approved_at,
      is_public
    )
    select
      new.user_id,
      new.submission_id,
      new.id,
      new.task_id,
      tasks.title,
      tasks.summary,
      tasks.category,
      tasks.tags,
      new.reviewer_percent,
      new.reviewer_comment,
      coalesce(new.submitted_at, now()),
      true
    from public.tasks
    where tasks.id = new.task_id
    on conflict (review_id) do update set
      title = excluded.title,
      summary = excluded.summary,
      category = excluded.category,
      skills = excluded.skills,
      score = excluded.score,
      reviewer_comment = excluded.reviewer_comment,
      approved_at = excluded.approved_at,
      is_public = true,
      updated_at = now();
  else
    update public.portfolio_items
    set is_public = false,
        updated_at = now()
    where review_id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_review_portfolio_item on public.reviews;
create trigger sync_review_portfolio_item
  after insert or update of status, portfolio_approved, reviewer_percent, reviewer_comment, submitted_at
  on public.reviews
  for each row execute function public.sync_portfolio_item_from_review();

insert into public.portfolio_items (
  user_id,
  submission_id,
  review_id,
  task_id,
  title,
  summary,
  category,
  skills,
  score,
  reviewer_comment,
  approved_at,
  is_public
)
select
  reviews.user_id,
  reviews.submission_id,
  reviews.id,
  reviews.task_id,
  tasks.title,
  tasks.summary,
  tasks.category,
  tasks.tags,
  reviews.reviewer_percent,
  reviews.reviewer_comment,
  coalesce(reviews.submitted_at, reviews.updated_at, now()),
  true
from public.reviews
join public.tasks on tasks.id = reviews.task_id
where reviews.status = 'approved'::public.review_status
  and reviews.portfolio_approved
on conflict (review_id) do update set
  title = excluded.title,
  summary = excluded.summary,
  category = excluded.category,
  skills = excluded.skills,
  score = excluded.score,
  reviewer_comment = excluded.reviewer_comment,
  approved_at = excluded.approved_at,
  is_public = true,
  updated_at = now();
