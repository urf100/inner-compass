-- =============================================================================
-- Zwischenraum – Schema, Funktionen, Trigger und Indizes
-- Migration 1 von 2. Danach 20261124000002_rls.sql ausführen.
--
-- Grundsätze:
--   * Jede Person hat genau ein Profil (1:1 zu auth.users).
--   * Profile entstehen ausschließlich über den Trigger handle_new_user().
--   * Klient:innen sind genau einer Therapeut:in zugeordnet (therapist_id).
--   * Tagebucheinträge sind standardmäßig privat (is_shared = false).
--   * Alle Zeitpunkte werden als timestamptz (UTC) gespeichert.
-- =============================================================================

create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;

-- -----------------------------------------------------------------------------
-- Typen
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('therapist', 'client');
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Hilfsfunktion: updated_at automatisch setzen
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  role           public.user_role not null,
  display_name   text not null check (char_length(display_name) between 1 and 80),
  therapist_id   uuid references public.profiles (id) on delete set null,
  -- Vorbereitung für spätere Funktionen (derzeit ungenutzt):
  ai_consent_at  timestamptz,                       -- Einwilligung in KI-Zusammenfassungen
  notification_prefs jsonb not null default '{}'::jsonb, -- Benachrichtigungs-Einstellungen
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint profiles_client_has_no_self_link check (therapist_id is distinct from id),
  constraint profiles_therapist_has_no_therapist check (role = 'client' or therapist_id is null)
);

create index if not exists profiles_therapist_id_idx on public.profiles (therapist_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- invitations – ein Code pro Klient:in
-- -----------------------------------------------------------------------------
create or replace function public.generate_invite_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- ohne 0/O, 1/I/L
  raw bytea := decode(replace(gen_random_uuid()::text, '-', ''), 'hex')
            || decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
  result text := '';
  i int;
begin
  for i in 0..9 loop
    result := result || substr(alphabet, (get_byte(raw, i) % length(alphabet)) + 1, 1);
    if i = 4 then
      result := result || '-';
    end if;
  end loop;
  return result; -- Format: XXXXX-XXXXX
end;
$$;

create table if not exists public.invitations (
  id            uuid primary key default gen_random_uuid(),
  therapist_id  uuid not null references public.profiles (id) on delete cascade,
  code          text not null unique default public.generate_invite_code(),
  label         text check (label is null or char_length(label) <= 80), -- internes Kürzel, nur für Therapeut:in
  expires_at    timestamptz not null default (now() + interval '14 days'),
  used_by       uuid unique references public.profiles (id) on delete set null,
  used_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists invitations_therapist_id_idx on public.invitations (therapist_id);

-- -----------------------------------------------------------------------------
-- journal_entries – Tagebuch der Klient:innen
-- -----------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.profiles (id) on delete cascade,
  entry_date  date not null default ((now() at time zone 'Europe/Vienna')::date),
  mood        smallint not null check (mood between 1 and 10),
  content     text not null default '' check (char_length(content) <= 10000),
  tags        text[] not null default '{}'::text[] check (cardinality(tags) <= 12),
  is_shared   boolean not null default false,
  shared_at   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists journal_entries_client_date_idx
  on public.journal_entries (client_id, entry_date desc);
create index if not exists journal_entries_shared_idx
  on public.journal_entries (client_id, entry_date desc) where is_shared;

-- shared_at pflegen: wird beim Teilen gesetzt und beim Zurückziehen gelöscht.
create or replace function public.journal_entries_track_sharing()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_shared and (tg_op = 'INSERT' or not old.is_shared) then
    new.shared_at := now();
  elsif new.is_shared then
    new.shared_at := old.shared_at; -- bleibt beim Bearbeiten unverändert
  else
    new.shared_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists journal_entries_track_sharing on public.journal_entries;
create trigger journal_entries_track_sharing
  before insert or update on public.journal_entries
  for each row execute function public.journal_entries_track_sharing();

drop trigger if exists journal_entries_set_updated_at on public.journal_entries;
create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- session_notes – private Sitzungsnotizen (nur verfassende Therapeut:in)
-- -----------------------------------------------------------------------------
create table if not exists public.session_notes (
  id            uuid primary key default gen_random_uuid(),
  therapist_id  uuid not null references public.profiles (id) on delete cascade,
  client_id     uuid not null references public.profiles (id) on delete cascade,
  session_date  date not null default ((now() at time zone 'Europe/Vienna')::date),
  content       text not null check (char_length(content) between 1 and 20000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists session_notes_therapist_client_idx
  on public.session_notes (therapist_id, client_id, session_date desc);

drop trigger if exists session_notes_set_updated_at on public.session_notes;
create trigger session_notes_set_updated_at
  before update on public.session_notes
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- appointment_slots – Zeitfenster; client_id gesetzt = gebucht
-- -----------------------------------------------------------------------------
create table if not exists public.appointment_slots (
  id            uuid primary key default gen_random_uuid(),
  therapist_id  uuid not null references public.profiles (id) on delete cascade,
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  client_id     uuid references public.profiles (id) on delete set null,
  booked_at     timestamptz,
  created_at    timestamptz not null default now(),
  constraint appointment_slots_valid_range check (ends_at > starts_at),
  constraint appointment_slots_max_length check (ends_at - starts_at <= interval '4 hours'),
  constraint appointment_slots_booking_consistent check ((client_id is null) = (booked_at is null)),
  constraint appointment_slots_no_overlap exclude using gist (
    therapist_id with =,
    tstzrange(starts_at, ends_at) with &&
  )
);

create index if not exists appointment_slots_therapist_start_idx
  on public.appointment_slots (therapist_id, starts_at);
create index if not exists appointment_slots_client_start_idx
  on public.appointment_slots (client_id, starts_at) where client_id is not null;

-- -----------------------------------------------------------------------------
-- exercises – Übungsbibliothek je Therapeut:in
-- -----------------------------------------------------------------------------
create table if not exists public.exercises (
  id                uuid primary key default gen_random_uuid(),
  therapist_id      uuid not null references public.profiles (id) on delete cascade,
  title             text not null check (char_length(title) between 1 and 120),
  description       text not null default '' check (char_length(description) <= 8000),
  duration_minutes  smallint not null check (duration_minutes between 1 and 240),
  category          text not null check (char_length(category) between 1 and 60),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists exercises_therapist_idx on public.exercises (therapist_id, title);

drop trigger if exists exercises_set_updated_at on public.exercises;
create trigger exercises_set_updated_at
  before update on public.exercises
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- exercise_assignments – Zuweisungen an Klient:innen
-- -----------------------------------------------------------------------------
create table if not exists public.exercise_assignments (
  id            uuid primary key default gen_random_uuid(),
  exercise_id   uuid not null references public.exercises (id), -- NO ACTION: zugewiesene Übungen können nicht gelöscht werden
  therapist_id  uuid not null references public.profiles (id) on delete cascade,
  client_id     uuid not null references public.profiles (id) on delete cascade,
  note          text check (note is null or char_length(note) <= 2000), -- Hinweis der Therapeut:in
  assigned_at   timestamptz not null default now(),
  completed_at  timestamptz,
  reflection    text check (reflection is null or char_length(reflection) <= 4000),
  updated_at    timestamptz not null default now()
);

create index if not exists exercise_assignments_client_idx
  on public.exercise_assignments (client_id, assigned_at desc);
create index if not exists exercise_assignments_therapist_client_idx
  on public.exercise_assignments (therapist_id, client_id);
create index if not exists exercise_assignments_exercise_idx
  on public.exercise_assignments (exercise_id);

drop trigger if exists exercise_assignments_set_updated_at on public.exercise_assignments;
create trigger exercise_assignments_set_updated_at
  before update on public.exercise_assignments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- crisis_plans – gemeinsamer Krisenplan (ein Plan pro Klient:in)
-- -----------------------------------------------------------------------------
create table if not exists public.crisis_plans (
  client_id          uuid primary key references public.profiles (id) on delete cascade,
  warning_signs      text not null default '' check (char_length(warning_signs) <= 4000),
  helpful_actions    text not null default '' check (char_length(helpful_actions) <= 4000),
  -- Liste von {name, phone, note}
  contacts           jsonb not null default '[]'::jsonb
                     check (jsonb_typeof(contacts) = 'array' and jsonb_array_length(contacts) <= 8),
  updated_by         uuid references public.profiles (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create or replace function public.crisis_plans_stamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.uid(), new.updated_by);
  return new;
end;
$$;

drop trigger if exists crisis_plans_stamp on public.crisis_plans;
create trigger crisis_plans_stamp
  before insert or update on public.crisis_plans
  for each row execute function public.crisis_plans_stamp();

-- -----------------------------------------------------------------------------
-- VORBEREITUNG für spätere Funktionen (nicht umgesetzt, nur Struktur)
-- Siehe README, Abschnitt "Für später vorbereitet".
-- -----------------------------------------------------------------------------

-- KI-Zusammenfassungen: werden später ausschließlich serverseitig (Service-Rolle)
-- erzeugt – nur aus freigegebenen Einträgen und nur mit Einwilligung.
create table if not exists public.ai_summaries (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.profiles (id) on delete cascade,
  therapist_id  uuid not null references public.profiles (id) on delete cascade,
  source_type   text not null check (source_type in ('shared_journal_entries', 'session_notes')),
  source_ids    uuid[] not null default '{}'::uuid[],
  period_start  date,
  period_end    date,
  summary       text not null,
  model         text,
  created_at    timestamptz not null default now()
);

create index if not exists ai_summaries_therapist_client_idx
  on public.ai_summaries (therapist_id, client_id, created_at desc);

-- Benachrichtigungen: werden später per Datenbank-Trigger oder Edge Function erzeugt.
create table if not exists public.notifications (
  id            uuid primary key default gen_random_uuid(),
  recipient_id  uuid not null references public.profiles (id) on delete cascade,
  kind          text not null check (kind in ('entry_shared', 'slot_booked', 'slot_cancelled', 'exercise_completed', 'exercise_assigned')),
  payload       jsonb not null default '{}'::jsonb,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists notifications_recipient_idx
  on public.notifications (recipient_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Rollen-Hilfsfunktionen (SECURITY DEFINER, damit Policies nicht rekursiv werden)
-- -----------------------------------------------------------------------------
create or replace function public.app_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.my_therapist_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.therapist_id from public.profiles p where p.id = auth.uid() and p.role = 'client';
$$;

create or replace function public.is_therapist_of(target_client uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_client
      and p.role = 'client'
      and p.therapist_id = auth.uid()
  );
$$;

-- Ist die Übung der angemeldeten Klient:in zugewiesen? (bricht die
-- Policy-Kette exercises <-> exercise_assignments auf)
create or replace function public.is_exercise_assigned_to_me(target_exercise uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.exercise_assignments a
    where a.exercise_id = target_exercise
      and a.client_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- Standard-Übungen für neue Therapeut:innen
-- -----------------------------------------------------------------------------
create or replace function public.add_default_exercises(target_therapist uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.exercises (therapist_id, title, category, duration_minutes, description) values
  (target_therapist, 'Atemübung 4-7-8', 'Atmung', 5,
   E'Eine ruhige Atemübung, die dem Körper signalisiert: Du darfst langsamer werden.\n\n1. Setz oder leg dich bequem hin. Die Zungenspitze ruht hinter den oberen Schneidezähnen.\n2. Atme vollständig durch den Mund aus.\n3. Atme leise durch die Nase ein und zähle dabei bis 4.\n4. Halte den Atem und zähle bis 7.\n5. Atme hörbar durch den Mund aus und zähle bis 8.\n6. Wiederhole das insgesamt vier Mal.\n\nWenn dir schwindlig wird, atme wieder normal weiter. Weniger Runden sind völlig in Ordnung.'),
  (target_therapist, '5-4-3-2-1-Erdung', 'Erdung', 5,
   E'Hilft, wenn Gedanken oder Gefühle sehr stark werden und du wieder im Hier und Jetzt ankommen möchtest.\n\nNimm dir Zeit und benenne – laut oder in Gedanken:\n• 5 Dinge, die du siehst\n• 4 Dinge, die du spürst (z. B. Füße am Boden, Stoff auf der Haut)\n• 3 Dinge, die du hörst\n• 2 Dinge, die du riechst\n• 1 Sache, die du schmeckst\n\nDanach: Wie geht es dir jetzt, auf einer Skala von 1 bis 10?'),
  (target_therapist, 'Gedankenprotokoll', 'Gedanken & Gefühle', 15,
   E'Ein Werkzeug, um belastende Gedanken in Ruhe anzuschauen.\n\n1. Situation: Was ist passiert? Wo, wann, mit wem?\n2. Gefühl: Was hast du gefühlt? Wie stark (0–100 %)?\n3. Automatischer Gedanke: Was ging dir durch den Kopf?\n4. Was spricht für diesen Gedanken – und was dagegen?\n5. Ausgewogener Gedanke: Wie könntest du die Situation auch sehen?\n6. Gefühl jetzt: Wie stark ist es nach der Übung?\n\nEs geht nicht darum, „positiv“ zu denken, sondern einen hilfreicheren Blickwinkel zu finden.'),
  (target_therapist, 'Progressive Muskelentspannung (Kurzform)', 'Entspannung', 15,
   E'Durch bewusstes Anspannen und Loslassen lernt der Körper den Unterschied zwischen Anspannung und Entspannung.\n\nFür jede Muskelgruppe: ca. 5 Sekunden anspannen, dann 20–30 Sekunden bewusst lösen und nachspüren.\n\n1. Hände und Arme (Fäuste ballen)\n2. Gesicht (Stirn runzeln, Augen zusammenkneifen)\n3. Schultern und Nacken (Schultern Richtung Ohren ziehen)\n4. Bauch (Bauchmuskeln anspannen)\n5. Beine und Füße (Zehen Richtung Nase ziehen)\n\nBitte nur so fest anspannen, dass es angenehm bleibt. Bei Schmerzen oder Verletzungen die Stelle auslassen.'),
  (target_therapist, 'Der sichere Ort', 'Imagination', 10,
   E'Eine Vorstellungsübung, um innerlich einen Ort der Ruhe und Geborgenheit aufzubauen.\n\n1. Schließ die Augen oder richte den Blick sanft auf den Boden.\n2. Stell dir einen Ort vor, an dem du dich ganz sicher und wohl fühlst – real oder erfunden.\n3. Was siehst du dort? Welche Farben, welches Licht?\n4. Was hörst du? Wie riecht es? Wie fühlt sich der Boden an?\n5. Gib dem Ort ein Wort oder eine kleine Geste, mit der du ihn später schneller erreichst.\n6. Komm langsam zurück: Bewege Finger und Zehen, öffne die Augen.\n\nWenn unangenehme Bilder auftauchen, darfst du die Übung jederzeit beenden.'),
  (target_therapist, 'Wohltuende Aktivität planen', 'Aktivierung', 10,
   E'Kleine angenehme Aktivitäten können die Stimmung spürbar heben – besonders, wenn sie geplant sind.\n\n1. Schreib drei Dinge auf, die dir früher gutgetan haben oder die du gern ausprobieren würdest (z. B. Spaziergang, Musik, jemanden anrufen).\n2. Wähle eine davon aus, die in den nächsten Tagen realistisch machbar ist.\n3. Lege Tag, Uhrzeit und Dauer fest.\n4. Notiere nach der Aktivität: Wie war die Stimmung vorher und nachher (1–10)?\n\nKlein anfangen ist ausdrücklich erwünscht – zehn Minuten zählen.');
$$;

-- -----------------------------------------------------------------------------
-- Einladungscode vor der Registrierung prüfen (für freundliche Fehlermeldung)
-- -----------------------------------------------------------------------------
create or replace function public.check_invitation_code(invite_code text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.invitations i
    where i.code = upper(trim(invite_code))
      and i.used_by is null
      and i.expires_at > now()
  );
$$;

-- -----------------------------------------------------------------------------
-- Neues Konto -> Profil anlegen (Trigger auf auth.users)
-- Klient:innen brauchen einen gültigen, unbenutzten Einladungscode.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'role', '');
  requested_name text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '');
  invite public.invitations%rowtype;
begin
  if requested_name is null then
    requested_name := 'Ohne Namen';
  end if;
  requested_name := left(requested_name, 80);

  if requested_role = 'therapist' then
    insert into public.profiles (id, role, display_name)
    values (new.id, 'therapist', requested_name);

    perform public.add_default_exercises(new.id);

  elsif requested_role = 'client' then
    select * into invite
    from public.invitations i
    where i.code = upper(trim(coalesce(new.raw_user_meta_data ->> 'invite_code', '')))
      and i.used_by is null
      and i.expires_at > now()
    for update;

    if not found then
      raise exception 'Ungültiger oder bereits verwendeter Einladungscode'
        using errcode = 'P0001';
    end if;

    insert into public.profiles (id, role, display_name, therapist_id)
    values (new.id, 'client', requested_name, invite.therapist_id);

    update public.invitations
    set used_by = new.id, used_at = now()
    where id = invite.id;

  else
    raise exception 'Unbekannte Rolle bei der Registrierung' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Termine buchen / stornieren (geprüfte Funktionen statt direkter UPDATE-Rechte)
-- -----------------------------------------------------------------------------
create or replace function public.book_slot(slot_id uuid)
returns public.appointment_slots
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.appointment_slots;
begin
  if public.app_user_role() is distinct from 'client' then
    raise exception 'Nur Klient:innen können Termine buchen' using errcode = '42501';
  end if;

  update public.appointment_slots s
  set client_id = auth.uid(), booked_at = now()
  where s.id = slot_id
    and s.client_id is null
    and s.therapist_id = public.my_therapist_id()
    and s.starts_at > now()
  returning * into result;

  if result.id is null then
    raise exception 'Dieses Zeitfenster ist nicht mehr verfügbar' using errcode = 'P0001';
  end if;

  return result;
end;
$$;

create or replace function public.cancel_booking(slot_id uuid)
returns public.appointment_slots
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.appointment_slots;
begin
  if public.app_user_role() is distinct from 'client' then
    raise exception 'Nur Klient:innen können eigene Buchungen stornieren' using errcode = '42501';
  end if;

  update public.appointment_slots s
  set client_id = null, booked_at = null
  where s.id = slot_id
    and s.client_id = auth.uid()
    and s.starts_at > now() + interval '24 hours'
  returning * into result;

  if result.id is null then
    raise exception 'Stornieren ist nur bis 24 Stunden vor dem Termin möglich' using errcode = 'P0001';
  end if;

  return result;
end;
$$;
