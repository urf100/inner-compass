#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Führt den RLS-Test gegen eine frische, lokale PostgreSQL-Datenbank aus
# (ohne Supabase-Konto). Benötigt PostgreSQL 15+ mit "contrib" (btree_gist).
#
#   npm run test:rls:local
#
# Verbindung über die üblichen PG*-Variablen (PGHOST, PGPORT, PGUSER, ...).
# Die Datenbank "zwischenraum_rls_test" wird angelegt und am Ende gelöscht.
# -----------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

DB="${RLS_TEST_DB:-zwischenraum_rls_test}"
export PGOPTIONS="${PGOPTIONS:-} -c client_min_messages=warning"

dropdb --if-exists "$DB" >/dev/null
createdb "$DB"
trap 'dropdb --if-exists "$DB" >/dev/null' EXIT

PSQL=(psql -v ON_ERROR_STOP=1 -q -X -d "$DB")

"${PSQL[@]}" -f supabase/tests/local/supabase_stub.sql >/dev/null
for f in supabase/migrations/*.sql; do
  echo "Migration: $f"
  "${PSQL[@]}" -f "$f" >/dev/null
done

echo "Starte RLS-Test ..."
OUT="$("${PSQL[@]}" -P pager=off -f supabase/tests/rls_test.sql)"
echo "$OUT"

if echo "$OUT" | grep -q "FEHLGESCHLAGEN"; then
  echo "❌ RLS-Test fehlgeschlagen" >&2
  exit 1
fi
echo "✅ RLS-Test bestanden"
