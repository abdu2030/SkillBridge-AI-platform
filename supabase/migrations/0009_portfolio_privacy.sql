alter table public.profiles
  add column if not exists portfolio_is_public boolean not null default false;

drop policy if exists "Public portfolio items are readable" on public.portfolio_items;
create policy "Public portfolio items are readable"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (
    is_public
    and exists (
      select 1
      from public.profiles
      where profiles.id = portfolio_items.user_id
        and profiles.portfolio_is_public
    )
  );

drop policy if exists "Public can read portfolio profile names" on public.profiles;
create policy "Public can read portfolio profile names"
  on public.profiles
  for select
  to anon, authenticated
  using (portfolio_is_public);

drop policy if exists "Public can read earned portfolio badges" on public.user_badges;
create policy "Public can read earned portfolio badges"
  on public.user_badges
  for select
  to anon, authenticated
  using (
    earned_at is not null
    and exists (
      select 1
      from public.profiles
      where profiles.id = user_badges.user_id
        and profiles.portfolio_is_public
    )
  );
