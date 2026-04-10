import Link from "next/link";

interface QuickLinkProps {
  href: string;
  title: string;
  description: string;
}

export function QuickLink({ href, title, description }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 transition hover:border-[var(--sage-500)] hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
    >
      <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
        {description}
      </p>
    </Link>
  );
}
