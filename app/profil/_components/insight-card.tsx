import type { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  body: string;
  children?: ReactNode;
}

export function InsightCard({ title, body, children }: InsightCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{body}</p>
      {children}
    </article>
  );
}
