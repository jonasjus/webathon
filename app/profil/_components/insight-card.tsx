import type { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  body: string;
  children?: ReactNode;
}

export function InsightCard({ title, body, children }: InsightCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <div className="card-intro">
        <p className="card-title text-[1.3rem] text-[var(--ink)]">{title}</p>
        <p className="card-copy text-[15px]">{body}</p>
      </div>
      {children}
    </article>
  );
}
