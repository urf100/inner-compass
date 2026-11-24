-- =============================================================================
-- Zwischenraum – Row Level Security, Rechte und Funktionsfreigaben
-- Migration 2 von 2 (nach 20261124000001_schema.sql ausführen).
--
-- Regeln:
--   * RLS ist auf ALLEN Tabellen aktiv. Ohne passende Policy: kein Zugriff.
--   * Klient:innen sehen nur eigene Daten (+ Name ihrer Therapeut:in,
--     freie Zeitfenster ihrer Therapeut:in und ihnen zugewiesene Übungen).
--   * Therapeut:innen sehen nur Daten ihrer zugeordneten Klient:innen;
--     Tagebucheinträge nur, wenn sie freigegeben sind (is_shared = true).
--   * Sitzungsnotizen sind ausschließlich für die verfassende Therapeut:in.
--   * Nicht angemeldete Besucher:innen (anon) haben keinerlei Tabellenzugriff.
--   * Zusätzlich begrenzen Spaltenrechte, WAS geändert werden darf
--     (z. B. kann niemand die eigene Rolle oder Zuordnung ändern).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. RLS aktivieren
-- -----------------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.invitations          enable row level security;
alter table public.journal_entries      enable row level security;
alter table public.session_notes        enable row level security;
alter table public.appointment_slots    enable row level security;
alter table public.exercises            enable row level security;
alter table public.exercise_assignments enable row level security;
alter table public.crisis_plans         enable row level security;
alter table public.ai_summaries         enable row level security;
alter table public.notifications        enable row level security;

-- -----------------------------------------------------------------------------
-- 2. Tabellenrechte: erst alles entziehen, dann gezielt (spaltengenau) erlauben
-- -----------------------------------------------------------------------------
revoke all on table
  public.profiles, public.invitations, public.journal_entries, public.session_notes,
  public.appointment_slots, public.exercises, public.exercise_assignments,
  public.crisis_plans, public.ai_summaries, public.notifications
from anon, authenticated;

-- profiles: lesen; nur der Anzeigename ist änderbar (Rolle/Zuordnung NICHT)
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- invitations
grant select, delete on public.invitations to authenticated;
grant insert (therapist_id, label) on public.invitations to authenticated;

-- journal_entries
grant select, delete on public.journal_entries to authenticated;
grant insert (client_id, entry_date, mood, content, tags, is_shared) on public.journal_entries to authenticated;
grant update (entry_date, mood, content, tags, is_shared) on public.journal_entries to authenticated;

-- session_notes
grant select, delete on public.session_notes to authenticated;
grant insert (therapist_id, client_id, session_date, content) on public.session_notes to authenticated;
grant update (session_date, content) on public.session_notes to authenticated;

-- appointment_slots: Buchen/Stornieren nur über book_slot()/cancel_booking()
grant select, delete on public.appointment_slots to authenticated;
grant insert (therapist_id, starts_at, ends_at) on public.appointment_slots to authenticated;

-- exercises
grant select, delete on public.exercises to authenticated;
grant insert (therapist_id, title, description, duration_minutes, category) on public.exercises to authenticated;
grant update (title, description, duration_minutes, category) on public.exercises to authenticated;

-- exercise_assignments: Klient:innen dürfen nur "erledigt" und Reflexion setzen
grant select, delete on public.exercise_assignments to authenticated;
grant insert (exercise_id, therapist_id, client_id, note) on public.exercise_assignments to authenticated;
grant update (completed_at, reflection) on public.exercise_assignments to authenticated;

-- crisis_plans
grant select on public.crisis_plans to authenticated;
grant insert (client_id, warning_signs, helpful_actions, contacts) on public.crisis_plans to authenticated;
grant update (warning_signs, helpful_actions, contacts) on public.crisis_plans to authenticated;

-- vorbereitet: nur lesen (Schreiben später ausschließlich serverseitig)
grant select on public.ai_summaries to authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

-- -----------------------------------------------------------------------------
-- 3. Funktionsrechte (Supabase erlaubt standardmäßig allen das Ausführen)
-- -----------------------------------------------------------------------------
revoke execute on function public.add_default_exercises(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user()           from public, anon, authenticated;
revoke execute on function public.generate_invite_code()      from public, anon;

revoke execute on function public.app_user_role()             from public, anon;
revoke execute on function public.my_therapist_id()           from public, anon;
revoke execute on function public.is_therapist_of(uuid)       from public, anon;
revoke execute on function public.is_exercise_assigned_to_me(uuid) from public, anon;
revoke execute on function public.book_slot(uuid)             from public, anon;
revoke execute on function public.cancel_booking(uuid)        from public, anon;
grant  execute on function public.app_user_role()             to authenticated;
grant  execute on function public.my_therapist_id()           to authenticated;
grant  execute on function public.is_therapist_of(uuid)       to authenticated;
grant  execute on function public.is_exercise_assigned_to_me(uuid) to authenticated;
grant  execute on function public.book_slot(uuid)             to authenticated;
grant  execute on function public.cancel_booking(uuid)        to authenticated;

-- Code-Prüfung vor der Registrierung (liefert nur true/false, keine Daten)
revoke execute on function public.check_invitation_code(text) from public;
grant  execute on function public.check_invitation_code(text) to anon, authenticated;

-- invitations.code hat generate_invite_code() als Default; Defaults laufen mit
-- den Rechten der einfügenden Rolle, daher braucht "authenticated" das Recht.
grant execute on function public.generate_invite_code() to authenticated;

-- -----------------------------------------------------------------------------
-- 4. Policies
-- -----------------------------------------------------------------------------

-- profiles ---------------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())                       -- eigenes Profil
    or therapist_id = (select auth.uid())          -- Therapeut:in sieht eigene Klient:innen
    or id = (select public.my_therapist_id())      -- Klient:in sieht eigene Therapeut:in
  );

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- invitations ------------------------------------------------------------------
drop policy if exists invitations_select_own on public.invitations;
create policy invitations_select_own on public.invitations
  for select to authenticated
  using (therapist_id = (select auth.uid()));

drop policy if exists invitations_insert_therapist on public.invitations;
create policy invitations_insert_therapist on public.invitations
  for insert to authenticated
  with check (
    therapist_id = (select auth.uid())
    and (select public.app_user_role()) = 'therapist'
  );

drop policy if exists invitations_delete_unused on public.invitations;
create policy invitations_delete_unused on public.invitations
  for delete to authenticated
  using (therapist_id = (select auth.uid()) and used_by is null);

-- journal_entries --------------------------------------------------------------
drop policy if exists journal_select_own on public.journal_entries;
create policy journal_select_own on public.journal_entries
  for select to authenticated
  using (client_id = (select auth.uid()));

drop policy if exists journal_select_shared_for_therapist on public.journal_entries;
create policy journal_select_shared_for_therapist on public.journal_entries
  for select to authenticated
  using (is_shared and public.is_therapist_of(client_id));

drop policy if exists journal_insert_own on public.journal_entries;
create policy journal_insert_own on public.journal_entries
  for insert to authenticated
  with check (
    client_id = (select auth.uid())
    and (select public.app_user_role()) = 'client'
  );

drop policy if exists journal_update_own on public.journal_entries;
create policy journal_update_own on public.journal_entries
  for update to authenticated
  using (client_id = (select auth.uid()))
  with check (client_id = (select auth.uid()));

drop policy if exists journal_delete_own on public.journal_entries;
create policy journal_delete_own on public.journal_entries
  for delete to authenticated
  using (client_id = (select auth.uid()));

-- session_notes (NUR verfassende Therapeut:in) ----------------------------------
drop policy if exists notes_select_author on public.session_notes;
create policy notes_select_author on public.session_notes
  for select to authenticated
  using (therapist_id = (select auth.uid()));

drop policy if exists notes_insert_author on public.session_notes;
create policy notes_insert_author on public.session_notes
  for insert to authenticated
  with check (
    therapist_id = (select auth.uid())
    and public.is_therapist_of(client_id)
  );

drop policy if exists notes_update_author on public.session_notes;
create policy notes_update_author on public.session_notes
  for update to authenticated
  using (therapist_id = (select auth.uid()))
  with check (therapist_id = (select auth.uid()) and public.is_therapist_of(client_id));

drop policy if exists notes_delete_author on public.session_notes;
create policy notes_delete_author on public.session_notes
  for delete to authenticated
  using (therapist_id = (select auth.uid()));

-- appointment_slots ------------------------------------------------------------
drop policy if exists slots_select_therapist on public.appointment_slots;
create policy slots_select_therapist on public.appointment_slots
  for select to authenticated
  using (therapist_id = (select auth.uid()));

drop policy if exists slots_select_client_booked on public.appointment_slots;
create policy slots_select_client_booked on public.appointment_slots
  for select to authenticated
  using (client_id = (select auth.uid()));

drop policy if exists slots_select_client_free on public.appointment_slots;
create policy slots_select_client_free on public.appointment_slots
  for select to authenticated
  using (
    client_id is null
    and starts_at > now()
    and therapist_id = (select public.my_therapist_id())
  );

drop policy if exists slots_insert_therapist on public.appointment_slots;
create policy slots_insert_therapist on public.appointment_slots
  for insert to authenticated
  with check (
    therapist_id = (select auth.uid())
    and (select public.app_user_role()) = 'therapist'
  );

drop policy if exists slots_delete_therapist on public.appointment_slots;
create policy slots_delete_therapist on public.appointment_slots
  for delete to authenticated
  using (therapist_id = (select auth.uid()));

-- exercises --------------------------------------------------------------------
drop policy if exists exercises_select_owner on public.exercises;
create policy exercises_select_owner on public.exercises
  for select to authenticated
  using (therapist_id = (select auth.uid()));

drop policy if exists exercises_select_assigned on public.exercises;
create policy exercises_select_assigned on public.exercises
  for select to authenticated
  using (public.is_exercise_assigned_to_me(id));

drop policy if exists exercises_insert_owner on public.exercises;
create policy exercises_insert_owner on public.exercises
  for insert to authenticated
  with check (
    therapist_id = (select auth.uid())
    and (select public.app_user_role()) = 'therapist'
  );

drop policy if exists exercises_update_owner on public.exercises;
create policy exercises_update_owner on public.exercises
  for update to authenticated
  using (therapist_id = (select auth.uid()))
  with check (therapist_id = (select auth.uid()));

drop policy if exists exercises_delete_owner on public.exercises;
create policy exercises_delete_owner on public.exercises
  for delete to authenticated
  using (therapist_id = (select auth.uid()));

-- exercise_assignments ---------------------------------------------------------
drop policy if exists assignments_select on public.exercise_assignments;
create policy assignments_select on public.exercise_assignments
  for select to authenticated
  using (client_id = (select auth.uid()) or therapist_id = (select auth.uid()));

drop policy if exists assignments_insert_therapist on public.exercise_assignments;
create policy assignments_insert_therapist on public.exercise_assignments
  for insert to authenticated
  with check (
    therapist_id = (select auth.uid())
    and public.is_therapist_of(client_id)
    and exists (
      select 1 from public.exercises e
      where e.id = exercise_id and e.therapist_id = (select auth.uid())
    )
  );

drop policy if exists assignments_update_client on public.exercise_assignments;
create policy assignments_update_client on public.exercise_assignments
  for update to authenticated
  using (client_id = (select auth.uid()))
  with check (client_id = (select auth.uid()));

drop policy if exists assignments_delete_therapist on public.exercise_assignments;
create policy assignments_delete_therapist on public.exercise_assignments
  for delete to authenticated
  using (therapist_id = (select auth.uid()));

-- crisis_plans (Klient:in + zugeordnete Therapeut:in) ---------------------------
drop policy if exists crisis_select on public.crisis_plans;
create policy crisis_select on public.crisis_plans
  for select to authenticated
  using (client_id = (select auth.uid()) or public.is_therapist_of(client_id));

drop policy if exists crisis_insert on public.crisis_plans;
create policy crisis_insert on public.crisis_plans
  for insert to authenticated
  with check (
    (client_id = (select auth.uid()) and (select public.app_user_role()) = 'client')
    or public.is_therapist_of(client_id)
  );

drop policy if exists crisis_update on public.crisis_plans;
create policy crisis_update on public.crisis_plans
  for update to authenticated
  using (client_id = (select auth.uid()) or public.is_therapist_of(client_id))
  with check (client_id = (select auth.uid()) or public.is_therapist_of(client_id));

-- ai_summaries (vorbereitet) ---------------------------------------------------
drop policy if exists ai_summaries_select_therapist on public.ai_summaries;
create policy ai_summaries_select_therapist on public.ai_summaries
  for select to authenticated
  using (therapist_id = (select auth.uid()) and public.is_therapist_of(client_id));

-- notifications (vorbereitet) --------------------------------------------------
drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications
  for select to authenticated
  using (recipient_id = (select auth.uid()));

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (recipient_id = (select auth.uid()))
  with check (recipient_id = (select auth.uid()));
