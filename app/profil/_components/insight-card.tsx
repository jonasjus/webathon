import type { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  body: string;
  children?: ReactNode;
}

export function InsightCard({ title, body, children }: InsightCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <p className="card-title text-lg text-[var(--ink)]">{title}</p>
      <p className="card-copy mt-2.5 text-[15px]">{body}</p>
      {children}
    </article>
  );
}
