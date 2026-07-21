-- Track — database schema
-- Tables: profiles, projects, tasks. Every table has Row Level Security (RLS)
-- enabled so users can only ever read/write their own rows, even if the API
-- layer has a bug. Run this in the Supabase SQL editor (or via the CLI).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One profile row per authenticated user, keyed to Supabase's auth.users table.
create table if not exists profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  owner_id    uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'todo'
                check (status in ('todo', 'in_progress', 'done')),
  due_date    date,
  created_at  timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on projects (owner_id);
create index if not exists tasks_project_id_idx   on tasks (project_id);
create index if not exists tasks_owner_id_idx      on tasks (owner_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- auth.uid() is wrapped in a subselect so Postgres evaluates it once per query
-- instead of once per row (Supabase performance best practice).

alter table profiles enable row level security;
alter table projects enable row level security;
alter table tasks    enable row level security;

-- profiles: a user can see and edit only their own profile.
create policy "profiles: select own" on profiles
  for select using ((select auth.uid()) = id);
create policy "profiles: update own" on profiles
  for update using ((select auth.uid()) = id);

-- projects: full CRUD scoped to the owner.
create policy "projects: select own" on projects
  for select using ((select auth.uid()) = owner_id);
create policy "projects: insert own" on projects
  for insert with check ((select auth.uid()) = owner_id);
create policy "projects: update own" on projects
  for update using ((select auth.uid()) = owner_id);
create policy "projects: delete own" on projects
  for delete using ((select auth.uid()) = owner_id);

-- tasks: full CRUD scoped to the owner.
create policy "tasks: select own" on tasks
  for select using ((select auth.uid()) = owner_id);
create policy "tasks: insert own" on tasks
  for insert with check ((select auth.uid()) = owner_id);
create policy "tasks: update own" on tasks
  for update using ((select auth.uid()) = owner_id);
create policy "tasks: delete own" on tasks
  for delete using ((select auth.uid()) = owner_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new user signs up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
