"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ClientTabs({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const base = `/praxis/klient-innen/${clientId}`;
  const tabs = [
    { href: base, label: "Überblick" },
    { href: `${base}/notizen`, label: "Sitzungsnotizen" },
    { href: `${base}/uebungen`, label: "Übungen" },
    { href: `${base}/krisenplan`, label: "Krisenplan" },
  ];
  return (
    <nav aria-label="Bereiche der Klient:in" className="-mx-4 mb-6 overflow-x-auto px-4">
      <ul className="flex min-w-max gap-1 border-b border-sand-200">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px inline-block border-b-3 px-3 py-2.5 font-semibold ${
                  active ? "border-sage-600 text-sage-700" : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
