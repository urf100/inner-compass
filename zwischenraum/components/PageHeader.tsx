import Link from "next/link";

export function PageHeader({
  title,
  intro,
  back,
  children,
}: {
  title: string;
  intro?: React.ReactNode;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="link mb-3 inline-flex items-center gap-1 text-sm">
          <span aria-hidden="true">←</span> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {intro && <p className="mt-1 max-w-2xl text-ink-soft">{intro}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}
