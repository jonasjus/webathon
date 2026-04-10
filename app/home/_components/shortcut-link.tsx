import Link from "next/link";

interface ShortcutLinkProps {
  href: string;
  title: string;
  description: string;
}

export function ShortcutLink({
  href,
  title,
  description,
}: ShortcutLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 transition hover:border-[var(--sage-500)] hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
    >
      <p className="card-title text-base text-[var(--ink)]">{title}</p>
      <p className="card-copy mt-1.5 text-[15px]">
        {description}
      </p>
    </Link>
  );
}
