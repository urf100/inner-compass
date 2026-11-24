-- =============================================================================
-- Zwischenraum – RLS-Test
--
-- Ausführen: Supabase-Dashboard -> SQL Editor -> diesen Inhalt einfügen -> "Run".
--            (oder lokal: psql -f supabase/tests/rls_test.sql)
--
-- Was passiert?
--   1. Es werden vorübergehend Testkonten angelegt:
--        * Therapeut:in T1 mit den Demo-Klient:innen A und B
--        * eine fremde Therapeut:in T2 ohne Klient:innen
--   2. Der Test schlüpft nacheinander in die Rolle jeder Person (wie bei einer
--      echten Anmeldung) und prüft, was sie sehen und ändern darf.
--   3. ALLE Testdaten werden am Ende automatisch zurückgerollt – es bleibt nichts
--      in der Datenbank zurück.
--
-- Ergebnis: Eine Tabelle mit allen Prüfungen. Jede Zeile muss "bestanden" zeigen.
-- =============================================================================

drop table if exists rls_results;
create temp table rls_results (nr int, pruefung text, ergebnis text);

do $test$
declare
  t1 constant uuid := 'aaaaaaaa-0000-4000-8000-000000000001'; -- Therapeut:in T1
  t2 constant uuid := 'aaaaaaaa-0000-4000-8000-000000000002'; -- fremde Therapeut:in T2
  ca constant uuid := 'aaaaaaaa-0000-4000-8000-00000000000a'; -- Demo-Klient:in A (bei T1)
  cb constant uuid := 'aaaaaaaa-0000-4000-8000-00000000000b'; -- Demo-Klient:in B (bei T1)
  r jsonb := '[]'::jsonb;  -- gesammelte Ergebnisse (überleben das Zurückrollen)
  n bigint;
  ok boolean;
  entry_a_shared uuid;
  entry_b_private uuid;
  slot_free uuid;
  slot_soon uuid;
  slot_t2 uuid;
  ex_t1 uuid;
  ex_t1_other uuid;
begin
  begin
    -- -------------------------------------------------------------------------
    -- Testdaten (als Datenbank-Admin, RLS greift hier nicht)
    -- -------------------------------------------------------------------------
    insert into auth.users (id, email, aud, role, raw_user_meta_data) values
      (t1, 'rls-test-t1@example.invalid', 'authenticated', 'authenticated',
       '{"role":"therapist","display_name":"RLS-Test T1"}'),
      (t2, 'rls-test-t2@example.invalid', 'authenticated', 'authenticated',
       '{"role":"therapist","display_name":"RLS-Test T2"}');

    insert into public.invitations (therapist_id, code) values
      (t1, 'RLSTA-AAAAA'), (t1, 'RLSTB-BBBBB'), (t1, 'RLSTC-CCCCC');

    insert into auth.users (id, email, aud, role, raw_user_meta_data) values
      (ca, 'rls-test-a@example.invalid', 'authenticated', 'authenticated',
       '{"role":"client","display_name":"Demo-Klient:in A","invite_code":"rlsta-aaaaa"}'),
      (cb, 'rls-test-b@example.invalid', 'authenticated', 'authenticated',
       '{"role":"client","display_name":"Demo-Klient:in B","invite_code":"RLSTB-BBBBB"}');

    insert into public.journal_entries (client_id, mood, content, is_shared) values
      (ca, 4, 'A privat 1', false),
      (ca, 6, 'A privat 2', false);
    insert into public.journal_entries (client_id, mood, content, is_shared)
      values (ca, 7, 'A geteilt', true) returning id into entry_a_shared;
    insert into public.journal_entries (client_id, mood, content, is_shared)
      values (cb, 3, 'B privat', false) returning id into entry_b_private;
    insert into public.journal_entries (client_id, mood, content, is_shared)
      values (cb, 5, 'B geteilt', true);

    insert into public.session_notes (therapist_id, client_id, content)
      values (t1, ca, 'Vertrauliche Notiz zu A');

    insert into public.crisis_plans (client_id, warning_signs) values
      (ca, 'Warnzeichen A'), (cb, 'Warnzeichen B');

    select id into ex_t1 from public.exercises where therapist_id = t1 order by title limit 1;
    select id into ex_t1_other from public.exercises where therapist_id = t1 and id <> ex_t1 order by title limit 1;
    insert into public.exercise_assignments (exercise_id, therapist_id, client_id)
      values (ex_t1, t1, ca);

    insert into public.appointment_slots (therapist_id, starts_at, ends_at)
      values (t1, now() + interval '3 days', now() + interval '3 days 50 minutes')
      returning id into slot_free;
    insert into public.appointment_slots (therapist_id, starts_at, ends_at, client_id, booked_at)
      values (t1, now() + interval '10 hours', now() + interval '10 hours 50 minutes', ca, now())
      returning id into slot_soon;
    insert into public.appointment_slots (therapist_id, starts_at, ends_at)
      values (t2, now() + interval '2 days', now() + interval '2 days 50 minutes')
      returning id into slot_t2;

    -- -------------------------------------------------------------------------
    -- Registrierung
    -- -------------------------------------------------------------------------
    ok := (select count(*) from public.profiles where id in (ca, cb) and therapist_id = t1) = 2;
    r := r || jsonb_build_object('t', 'Registrierung: A und B sind per Einladungscode T1 zugeordnet', 'ok', ok);

    begin
      insert into auth.users (id, email, aud, role, raw_user_meta_data) values
        (gen_random_uuid(), 'rls-test-x@example.invalid', 'authenticated', 'authenticated',
         '{"role":"client","display_name":"X","invite_code":"FALSCH-00000"}');
      ok := false;
    exception when others then ok := true;
    end;
    r := r || jsonb_build_object('t', 'Registrierung: ungültiger Einladungscode wird abgelehnt', 'ok', ok);

    begin
      insert into auth.users (id, email, aud, role, raw_user_meta_data) values
        (gen_random_uuid(), 'rls-test-y@example.invalid', 'authenticated', 'authenticated',
         '{"role":"client","display_name":"Y","invite_code":"RLSTA-AAAAA"}');
      ok := false;
    exception when others then ok := true;
    end;
    r := r || jsonb_build_object('t', 'Registrierung: Einladungscode ist nur einmal verwendbar', 'ok', ok);

    -- =========================================================================
    -- Als Demo-Klient:in A
    -- =========================================================================
    perform set_config('request.jwt.claims', json_build_object('sub', ca, 'role', 'authenticated')::text, true);
    set local role authenticated;

    ok := (select count(*) from public.journal_entries) = 3;
    r := r || jsonb_build_object('t', 'A sieht genau die eigenen 3 Einträge (privat + geteilt)', 'ok', ok);

    ok := (select count(*) from public.journal_entries where client_id = cb) = 0;
    r := r || jsonb_build_object('t', 'A sieht keine Einträge von B (auch keine geteilten)', 'ok', ok);

    begin
      insert into public.journal_entries (client_id, mood, content) values (cb, 1, 'Fremdeintrag');
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann keinen Eintrag im Namen von B anlegen', 'ok', ok);

    update public.journal_entries set mood = 1 where id = entry_b_private;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'A kann Einträge von B nicht ändern', 'ok', n = 0);

    delete from public.journal_entries where client_id = cb;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'A kann Einträge von B nicht löschen', 'ok', n = 0);

    ok := (select count(*) from public.session_notes) = 0;
    r := r || jsonb_build_object('t', 'A sieht keine Sitzungsnotizen (auch nicht über sich selbst)', 'ok', ok);

    begin
      update public.profiles set role = 'therapist' where id = ca;
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann die eigene Rolle nicht ändern', 'ok', ok);

    begin
      update public.profiles set therapist_id = t2 where id = ca;
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann die Therapeut:innen-Zuordnung nicht ändern', 'ok', ok);

    ok := (select count(*) from public.profiles where id = cb) = 0
      and (select count(*) from public.profiles where id = t1) = 1
      and (select count(*) from public.profiles where id = t2) = 0;
    r := r || jsonb_build_object('t', 'A sieht das Profil von T1, aber nicht das von B oder T2', 'ok', ok);

    ok := (select count(*) from public.crisis_plans) = 1
      and (select count(*) from public.crisis_plans where client_id = cb) = 0;
    r := r || jsonb_build_object('t', 'A sieht nur den eigenen Krisenplan', 'ok', ok);

    ok := (select count(*) from public.invitations) = 0;
    r := r || jsonb_build_object('t', 'A sieht keine Einladungscodes', 'ok', ok);

    ok := (select count(*) from public.exercises) = 1
      and (select count(*) from public.exercises where id = ex_t1_other) = 0;
    r := r || jsonb_build_object('t', 'A sieht nur die ihr/ihm zugewiesene Übung, nicht die ganze Bibliothek', 'ok', ok);

    begin
      insert into public.exercise_assignments (exercise_id, therapist_id, client_id) values (ex_t1_other, t1, ca);
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann sich nicht selbst Übungen zuweisen', 'ok', ok);

    update public.exercise_assignments set completed_at = now(), reflection = 'Hat gutgetan'
      where client_id = ca;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'A kann die eigene Übung als erledigt markieren', 'ok', n = 1);

    ok := (select count(*) from public.appointment_slots where client_id is null) = 1
      and (select count(*) from public.appointment_slots where id = slot_t2) = 0;
    r := r || jsonb_build_object('t', 'A sieht freie Zeitfenster nur der eigenen Therapeut:in', 'ok', ok);

    begin
      perform public.book_slot(slot_t2);
      ok := false;
    exception when others then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann kein Zeitfenster einer fremden Therapeut:in buchen', 'ok', ok);

    perform public.book_slot(slot_free);
    ok := (select client_id from public.appointment_slots where id = slot_free) = ca;
    r := r || jsonb_build_object('t', 'A kann ein freies Zeitfenster buchen', 'ok', ok);

    begin
      perform public.cancel_booking(slot_soon);
      ok := false;
    exception when others then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann weniger als 24 h vorher nicht stornieren', 'ok', ok);

    perform public.cancel_booking(slot_free);
    perform public.book_slot(slot_free); -- für die B-Prüfung wieder buchen
    r := r || jsonb_build_object('t', 'A kann mehr als 24 h vorher stornieren', 'ok', true);

    begin
      insert into public.appointment_slots (therapist_id, starts_at, ends_at)
        values (t1, now() + interval '5 days', now() + interval '5 days 1 hour');
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'A kann keine Zeitfenster anlegen', 'ok', ok);

    -- =========================================================================
    -- Als Demo-Klient:in B
    -- =========================================================================
    reset role;
    perform set_config('request.jwt.claims', json_build_object('sub', cb, 'role', 'authenticated')::text, true);
    set local role authenticated;

    ok := (select count(*) from public.journal_entries) = 2
      and (select count(*) from public.journal_entries where client_id = ca) = 0;
    r := r || jsonb_build_object('t', 'B sieht nur die eigenen 2 Einträge, keine von A', 'ok', ok);

    ok := (select count(*) from public.exercise_assignments) = 0;
    r := r || jsonb_build_object('t', 'B sieht die Übungen und Reflexionen von A nicht', 'ok', ok);

    ok := (select count(*) from public.appointment_slots where client_id is not null) = 0;
    r := r || jsonb_build_object('t', 'B sieht die Termine von A nicht', 'ok', ok);

    begin
      perform public.book_slot(slot_soon);
      ok := false;
    exception when others then ok := true;
    end;
    r := r || jsonb_build_object('t', 'B kann einen von A gebuchten Termin nicht übernehmen', 'ok', ok);

    update public.crisis_plans set warning_signs = 'überschrieben' where client_id = ca;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'B kann den Krisenplan von A nicht ändern', 'ok', n = 0);

    -- =========================================================================
    -- Als Therapeut:in T1
    -- =========================================================================
    reset role;
    perform set_config('request.jwt.claims', json_build_object('sub', t1, 'role', 'authenticated')::text, true);
    set local role authenticated;

    ok := (select count(*) from public.journal_entries) = 2
      and (select count(*) from public.journal_entries where not is_shared) = 0;
    r := r || jsonb_build_object('t', 'T1 sieht nur freigegebene Einträge (2), keine privaten', 'ok', ok);

    begin
      insert into public.journal_entries (client_id, mood, content) values (ca, 5, 'von T1');
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'T1 kann keine Tagebucheinträge anlegen', 'ok', ok);

    update public.journal_entries set content = 'geändert' where id = entry_a_shared;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'T1 kann freigegebene Einträge nicht ändern', 'ok', n = 0);

    ok := (select count(*) from public.session_notes) = 1;
    r := r || jsonb_build_object('t', 'T1 sieht die eigene Sitzungsnotiz', 'ok', ok);

    ok := (select count(*) from public.profiles where role = 'client') = 2;
    r := r || jsonb_build_object('t', 'T1 sieht die Profile der eigenen Klient:innen', 'ok', ok);

    update public.crisis_plans set helpful_actions = 'Spaziergang' where client_id = ca;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'T1 kann den Krisenplan von A gemeinsam bearbeiten', 'ok', n = 1);

    ok := (select reflection from public.exercise_assignments where client_id = ca) = 'Hat gutgetan';
    r := r || jsonb_build_object('t', 'T1 sieht Erledigt-Status und Reflexion zugewiesener Übungen', 'ok', ok);

    begin
      update public.exercise_assignments set reflection = 'von T1' where client_id = ca;
      get diagnostics n = row_count;
      ok := n = 0;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'T1 kann Reflexionen von Klient:innen nicht ändern', 'ok', ok);

    -- A zieht die Freigabe zurück -> T1 sieht den Eintrag nicht mehr
    reset role;
    perform set_config('request.jwt.claims', json_build_object('sub', ca, 'role', 'authenticated')::text, true);
    set local role authenticated;
    update public.journal_entries set is_shared = false where id = entry_a_shared;

    reset role;
    perform set_config('request.jwt.claims', json_build_object('sub', t1, 'role', 'authenticated')::text, true);
    set local role authenticated;
    ok := (select count(*) from public.journal_entries where id = entry_a_shared) = 0
      and (select count(*) from public.journal_entries) = 1;
    r := r || jsonb_build_object('t', 'Nach Zurückziehen der Freigabe sieht T1 den Eintrag nicht mehr', 'ok', ok);

    -- =========================================================================
    -- Als fremde Therapeut:in T2
    -- =========================================================================
    reset role;
    perform set_config('request.jwt.claims', json_build_object('sub', t2, 'role', 'authenticated')::text, true);
    set local role authenticated;

    ok := (select count(*) from public.journal_entries) = 0;
    r := r || jsonb_build_object('t', 'T2 sieht keine Einträge fremder Klient:innen', 'ok', ok);

    ok := (select count(*) from public.session_notes) = 0;
    r := r || jsonb_build_object('t', 'T2 sieht die Sitzungsnotizen von T1 nicht', 'ok', ok);

    begin
      insert into public.session_notes (therapist_id, client_id, content) values (t2, ca, 'fremd');
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'T2 kann keine Notizen zu fremden Klient:innen anlegen', 'ok', ok);

    ok := (select count(*) from public.profiles) = 1;
    r := r || jsonb_build_object('t', 'T2 sieht nur das eigene Profil', 'ok', ok);

    ok := (select count(*) from public.crisis_plans) = 0
      and (select count(*) from public.exercise_assignments) = 0
      and (select count(*) from public.invitations) = 0;
    r := r || jsonb_build_object('t', 'T2 sieht keine Krisenpläne, Übungen oder Codes von T1', 'ok', ok);

    begin
      insert into public.exercise_assignments (exercise_id, therapist_id, client_id) values (ex_t1, t2, ca);
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'T2 kann fremden Klient:innen keine Übungen zuweisen', 'ok', ok);

    delete from public.appointment_slots where therapist_id = t1;
    get diagnostics n = row_count;
    r := r || jsonb_build_object('t', 'T2 kann Zeitfenster von T1 nicht löschen', 'ok', n = 0);

    -- =========================================================================
    -- Nicht angemeldet (anon)
    -- =========================================================================
    reset role;
    perform set_config('request.jwt.claims', '', true);
    set local role anon;

    begin
      perform count(*) from public.journal_entries;
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'Ohne Anmeldung kein Zugriff auf Tagebucheinträge', 'ok', ok);

    begin
      perform count(*) from public.profiles;
      ok := false;
    exception when insufficient_privilege then ok := true;
    end;
    r := r || jsonb_build_object('t', 'Ohne Anmeldung kein Zugriff auf Profile', 'ok', ok);

    reset role;
    -- Alles zurückrollen: absichtlicher Abbruch dieses inneren Blocks.
    raise exception using errcode = 'ZRTST', message = 'Testdaten zurückrollen';
  exception
    when sqlstate 'ZRTST' then
      null;
  end;

  insert into rls_results (nr, pruefung, ergebnis)
  select ord::int,
         e ->> 't',
         case when (e ->> 'ok')::boolean then 'bestanden' else 'FEHLGESCHLAGEN' end
  from jsonb_array_elements(r) with ordinality as x(e, ord);
end
$test$;

select nr, pruefung, ergebnis from rls_results
union all
select 999,
       'GESAMT: ' || count(*) filter (where ergebnis = 'bestanden') || ' von ' || count(*) || ' Prüfungen bestanden',
       case when bool_and(ergebnis = 'bestanden') then 'bestanden' else 'FEHLGESCHLAGEN' end
from rls_results
order by nr;
