-- Roles system (admin detection)
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Download-button click tracking (no PII: no IP, no user identifiers)
create table public.download_clicks (
  id uuid primary key default gen_random_uuid(),
  clicked_at timestamptz not null default now(),
  source text not null,
  version text,
  page_path text not null default '/'
);

grant insert on public.download_clicks to anon;
grant select on public.download_clicks to authenticated;
grant all on public.download_clicks to service_role;

alter table public.download_clicks enable row level security;

create policy "Public can record download button clicks"
  on public.download_clicks
  for insert
  to anon, authenticated
  with check (source in ('navbar', 'hero', 'download', 'footer'));

create policy "Admins can read download clicks"
  on public.download_clicks
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index download_clicks_clicked_at_idx on public.download_clicks (clicked_at);
create index download_clicks_version_idx on public.download_clicks (version);
