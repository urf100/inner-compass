"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
  icon: "journal" | "exercise" | "calendar" | "people" | "key" | "user";
  /** Nur exakte Übereinstimmung (plus alsoActive) als "aktiv" werten */
  exact?: boolean;
  /** Weitere Pfad-Präfixe, bei denen der Eintrag aktiv ist */
  alsoActive?: string[];
}

function isActive(pathname: string, item: NavItem) {
  const prefixMatch = (p: string) => pathname === p || pathname.startsWith(`${p}/`);
  if (item.alsoActive?.some(prefixMatch)) return true;
  if (item.exact) return pathname === item.href;
  return prefixMatch(item.href);
}

function Icon({ name }: { name: NavItem["icon"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "journal":
      return (
        <svg {...common}>
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "exercise":
      return (
        <svg {...common}>
          <path d="M12 21c4.4 0 8-3.6 8-8 0-3-1.7-5.6-4.1-7" />
          <path d="M12 21c-4.4 0-8-3.6-8-8 0-3 1.7-5.6 4.1-7" />
          <path d="M12 3v9l3 2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19c.8-3 3-4.6 5.5-4.6s4.7 1.6 5.5 4.6" />
          <path d="M15.5 5.2a3 3 0 0 1 0 5.6M17 14.6c1.8.5 3 1.9 3.5 4.4" />
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <circle cx="8" cy="15" r="4" />
          <path d="m11 12 8-8M16 7l2 2" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5" />
        </svg>
      );
  }
}

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-1 md:flex">
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-lg px-3 py-2 font-semibold transition-colors ${
                active ? "bg-sage-100 text-sage-700" : "text-ink-soft hover:bg-sand-100 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Hauptnavigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-xl justify-around">
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs font-semibold ${
                  active ? "text-sage-700" : "text-ink-soft"
                }`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
