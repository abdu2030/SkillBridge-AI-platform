create extension if not exists pgcrypto;

create type public.task_difficulty as enum ('beginner', 'intermediate', 'advanced');
create type public.task_status as enum ('draft', 'published', 'archived');
create type public.task_file_role as enum (
  'starter',
  'visible_test',
  'hidden_test',
  'solution_reference',
  'supporting'
);

create function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.is_task_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin'::public.app_role
$$;

create function public.can_review_tasks()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('reviewer'::public.app_role, 'admin'::public.app_role)
$$;

revoke all on function public.current_user_role() from public;
revoke all on function public.is_task_admin() from public;
revoke all on function public.can_review_tasks() from public;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_task_admin() to authenticated;
grant execute on function public.can_review_tasks() to authenticated;

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  instructions text not null,
  category text not null,
  difficulty public.task_difficulty not null,
  estimated_minutes integer not null check (estimated_minutes > 0),
  tags text[] not null default '{}',
  status public.task_status not null default 'draft',
  created_by uuid not null references public.profiles(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint tasks_published_at_required check (status <> 'published' or published_at is not null)
);

create table public.task_files (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_path text not null,
  language text not null,
  file_role public.task_file_role not null default 'starter',
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint task_files_path_not_blank check (length(btrim(file_path)) > 0),
  constraint task_files_unique_path_per_task unique (task_id, file_path)
);

create table public.rubrics (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null unique references public.tasks(id) on delete cascade,
  title text not null default 'Scoring rubric',
  description text,
  total_points integer not null default 100 check (total_points > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rubric_items (
  id uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references public.rubrics(id) on delete cascade,
  position integer not null default 0,
  label text not null,
  description text not null,
  max_points integer not null check (max_points > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rubric_items_unique_position unique (rubric_id, position)
);

create index tasks_status_idx on public.tasks(status);
create index tasks_category_idx on public.tasks(category);
create index tasks_difficulty_idx on public.tasks(difficulty);
create index tasks_tags_idx on public.tasks using gin(tags);
create index task_files_task_id_idx on public.task_files(task_id);
create index task_files_role_idx on public.task_files(file_role);
create index rubric_items_rubric_id_idx on public.rubric_items(rubric_id);

create trigger touch_tasks_updated_at
  before update on public.tasks
  for each row execute function public.touch_updated_at();

create trigger touch_task_files_updated_at
  before update on public.task_files
  for each row execute function public.touch_updated_at();

create trigger touch_rubrics_updated_at
  before update on public.rubrics
  for each row execute function public.touch_updated_at();

create trigger touch_rubric_items_updated_at
  before update on public.rubric_items
  for each row execute function public.touch_updated_at();

alter table public.tasks enable row level security;
alter table public.task_files enable row level security;
alter table public.rubrics enable row level security;
alter table public.rubric_items enable row level security;

create policy "Published tasks are readable by signed-in users"
  on public.tasks
  for select
  to authenticated
  using (
    status = 'published'::public.task_status
    or created_by = auth.uid()
    or public.can_review_tasks()
  );

create policy "Admins can create tasks"
  on public.tasks
  for insert
  to authenticated
  with check (public.is_task_admin() and created_by = auth.uid());

create policy "Admins can update tasks"
  on public.tasks
  for update
  to authenticated
  using (public.is_task_admin())
  with check (public.is_task_admin());

create policy "Admins can delete tasks"
  on public.tasks
  for delete
  to authenticated
  using (public.is_task_admin());

create policy "Readable task files are visible by role"
  on public.task_files
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = task_files.task_id
        and (
          public.can_review_tasks()
          or (
            tasks.status = 'published'::public.task_status
            and task_files.file_role in (
              'starter'::public.task_file_role,
              'visible_test'::public.task_file_role,
              'supporting'::public.task_file_role
            )
          )
        )
    )
  );

create policy "Admins can create task files"
  on public.task_files
  for insert
  to authenticated
  with check (public.is_task_admin());

create policy "Admins can update task files"
  on public.task_files
  for update
  to authenticated
  using (public.is_task_admin())
  with check (public.is_task_admin());

create policy "Admins can delete task files"
  on public.task_files
  for delete
  to authenticated
  using (public.is_task_admin());

create policy "Rubrics are readable with their task"
  on public.rubrics
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = rubrics.task_id
        and (tasks.status = 'published'::public.task_status or public.can_review_tasks())
    )
  );

create policy "Admins can create rubrics"
  on public.rubrics
  for insert
  to authenticated
  with check (public.is_task_admin());

create policy "Admins can update rubrics"
  on public.rubrics
  for update
  to authenticated
  using (public.is_task_admin())
  with check (public.is_task_admin());

create policy "Admins can delete rubrics"
  on public.rubrics
  for delete
  to authenticated
  using (public.is_task_admin());

create policy "Rubric items are readable with their rubric"
  on public.rubric_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.rubrics
      join public.tasks on tasks.id = rubrics.task_id
      where rubrics.id = rubric_items.rubric_id
        and (tasks.status = 'published'::public.task_status or public.can_review_tasks())
    )
  );

create policy "Admins can create rubric items"
  on public.rubric_items
  for insert
  to authenticated
  with check (public.is_task_admin());

create policy "Admins can update rubric items"
  on public.rubric_items
  for update
  to authenticated
  using (public.is_task_admin())
  with check (public.is_task_admin());

create policy "Admins can delete rubric items"
  on public.rubric_items
  for delete
  to authenticated
  using (public.is_task_admin());
