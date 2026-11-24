-- =============================================================================
-- NUR für lokale Tests ohne Supabase (z. B. in CI):
-- Bildet die Teile von Supabase nach, die das Schema benötigt
-- (Rollen anon/authenticated/service_role, auth.users, auth.uid(),
-- Standard-Rechte wie in Supabase). In einem echten Supabase-Projekt
-- NICHT ausführen – dort gibt es all das bereits.
-- =============================================================================
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin noinherit bypassrls;
  end if;
end
$$;

create schema if not exists auth;

create table if not exists auth.users (
  id                  uuid primary key default gen_random_uuid(),
  instance_id         uuid,
  aud                 varchar(255),
  role                varchar(255),
  email               varchar(255) unique,
  encrypted_password  varchar(255),
  raw_user_meta_data  jsonb,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

grant usage on schema public, auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;

-- Wie in Supabase: neue Tabellen/Funktionen sind zunächst für alle Rollen freigegeben.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
