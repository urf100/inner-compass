import Link from "next/link";
import { getSession } from "@/lib/auth";
import { DesktopNav, MobileNav, type NavItem } from "@/components/NavLink";

const CLIENT_NAV: NavItem[] = [
  { href: "/tagebuch", label: "Tagebuch", icon: "journal" },
  { href: "/uebungen", label: "Übungen", icon: "exercise" },
  { href: "/termine", label: "Termine", icon: "calendar" },
  { href: "/konto", label: "Konto", icon: "user" },
];

const THERAPIST_NAV: NavItem[] = [
  { href: "/praxis", label: "Klient:innen", icon: "people", exact: true, alsoActive: ["/praxis/klient-innen"] },
  { href: "/praxis/termine", label: "Termine", icon: "calendar" },
  { href: "/praxis/uebungen", label: "Übungen", icon: "exercise" },
  { href: "/praxis/einladungen", label: "Einladungen", icon: "key" },
  { href: "/konto", label: "Konto", icon: "user" },
];

export async function SiteHeader() {
  const session = await getSession();
  const role = session?.profile.role;
  const items = role === "therapist" ? THERAPIST_NAV : role === "client" ? CLIENT_NAV : [];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <Link
            href={role ? (role === "therapist" ? "/praxis" : "/tagebuch") : "/"}
            className="flex min-w-0 items-center gap-2 rounded-lg text-base font-bold text-ink sm:text-lg"
          >
            <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
              <rect x="3" y="6" width="10" height="20" rx="4" fill="#3d6a56" />
              <rect x="19" y="6" width="10" height="20" rx="4" fill="#d8cbb8" />
            </svg>
            Zwischenraum
          </Link>

          <nav aria-label="Bereiche" className="hidden md:block">
            <DesktopNav items={items.filter((i) => i.href !== "/konto")} />
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {session && (
              <Link href="/konto" className="btn-quiet btn-sm hidden md:inline-flex">
                {session.profile.display_name}
              </Link>
            )}
            {!session && (
              <Link href="/anmelden" className="btn-quiet btn-sm px-2 sm:px-3">
                Anmelden
              </Link>
            )}
            <Link
              href="/krise"
              className="btn btn-sm gap-1.5 bg-clay-600 px-3 text-white shadow-sm hover:bg-clay-800"
              aria-label="Krisenhilfe: Notrufnummern und Krisenplan"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="hidden min-[380px]:block">
                <path d="M12 21s-7-4.4-9.2-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.2 12C19 16.6 12 21 12 21Z" />
              </svg>
              Krisenhilfe
            </Link>
          </div>
        </div>
      </header>
      {items.length > 0 && <MobileNav items={items} />}
    </>
  );
}
