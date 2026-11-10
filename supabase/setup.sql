-- Execute in the Supabase SQL editor. Create your user in Authentication first.
create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
grant select on public.portfolio_admins to authenticated;
revoke all on public.portfolio_admins from anon;
revoke insert, update, delete on public.portfolio_admins from authenticated;
create policy "Admins can verify their own membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table public.portfolio_content (
  id text primary key check (id = 'main'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_at timestamptz not null default clock_timestamp()
);
alter table public.portfolio_content enable row level security;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update on public.portfolio_content to authenticated;
revoke delete on public.portfolio_content from anon, authenticated;
create policy "Published portfolio is public" on public.portfolio_content
  for select to anon, authenticated using (true);
create policy "Only designated admins can add content" on public.portfolio_content
  for insert to authenticated with check (
    exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  );
create policy "Only designated admins can update content" on public.portfolio_content
  for update to authenticated using (
    exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  );
create function public.touch_portfolio_content() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
create trigger portfolio_updated before update on public.portfolio_content
  for each row execute function public.touch_portfolio_content();

-- Replace the UUID and run separately after creating your administrator account:
-- insert into public.portfolio_admins (user_id) values ('YOUR-USER-UUID');
