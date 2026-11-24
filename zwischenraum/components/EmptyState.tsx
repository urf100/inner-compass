import Link from "next/link";

export function EmptyState({
  title,
  text,
  actionHref,
  actionLabel,
}: {
  title: string;
  text?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-sand-300 bg-white/60 px-6 py-10 text-center">
      <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#eef4f0" />
        <path d="M16 27c2 3 4.7 4.5 8 4.5s6-1.5 8-4.5" stroke="#4f7d68" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="18" cy="20" r="1.8" fill="#4f7d68" />
        <circle cx="30" cy="20" r="1.8" fill="#4f7d68" />
      </svg>
      <p className="text-lg font-semibold">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-ink-soft">{text}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
