import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

// Bereiche, die eine Anmeldung voraussetzen
const PROTECTED_PREFIXES = ["/tagebuch", "/uebungen", "/termine", "/praxis", "/krise/bearbeiten", "/konto"];

/**
 * Erneuert die Supabase-Sitzung (Cookies) bei jeder Anfrage und leitet
 * nicht angemeldete Personen von geschützten Seiten zur Anmeldung um.
 * Die eigentliche Rollenprüfung erfolgt zusätzlich serverseitig auf jeder
 * Seite und in jeder Server Action (lib/auth.ts) sowie per RLS.
 */
export async function updateSession(request: NextRequest, requestHeaders: Headers) {
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const { url, key } = getSupabaseEnv();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Wichtig: getClaims() prüft das Token und erneuert es bei Bedarf.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims?.sub);

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  if (!isLoggedIn && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/anmelden";
    loginUrl.search = "";
    loginUrl.searchParams.set("weiter", path);
    const redirect = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}
