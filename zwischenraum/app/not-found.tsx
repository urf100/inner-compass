import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-12 text-center">
      <h1 className="text-2xl font-bold">Diese Seite gibt es nicht (mehr)</h1>
      <p className="mt-2 text-ink-soft">Vielleicht wurde sie verschoben, oder du hast keinen Zugriff darauf.</p>
      <Link href="/" className="btn-primary mt-6">
        Zur Startseite
      </Link>
    </div>
  );
}
