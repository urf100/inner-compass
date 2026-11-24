import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";

/**
 * Supabase-Client für Server Components, Server Actions und Route Handler.
 * Verwendet ausschließlich den öffentlichen Schlüssel + die Sitzung der
 * angemeldeten Person – alle Zugriffe unterliegen damit Row Level Security.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // In Server Components dürfen keine Cookies gesetzt werden.
          // Das Erneuern der Sitzung übernimmt dann proxy.ts.
        }
      },
    },
  });
}
