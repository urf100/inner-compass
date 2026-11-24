import type { Metadata, Viewport } from "next";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/600.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "./globals.css";
import { TestBanner } from "@/components/TestBanner";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Zwischenraum",
    template: "%s · Zwischenraum",
  },
  description: "Ein ruhiger, sicherer Ort zwischen den Therapiesitzungen.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-dvh">
        <a
          href="#inhalt"
          className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Zum Inhalt springen
        </a>
        <TestBanner />
        <SiteHeader />
        <main id="inhalt" tabIndex={-1} className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 outline-none md:pb-16">
          {children}
        </main>
        <footer className="mx-auto hidden max-w-5xl px-4 pb-8 text-sm text-ink-soft md:block">
          Zwischenraum ist kein Notfalldienst. In akuten Krisen: Notruf 112 · Rettung 144 · TelefonSeelsorge 142.
        </footer>
      </body>
    </html>
  );
}
