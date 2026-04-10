interface DashboardStatProps {
  label: string;
  value: number;
}

export function DashboardStat({ label, value }: DashboardStatProps) {
  return (
    <div className="rounded-[28px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,248,241,0.82))] px-4 py-4 shadow-[0_16px_36px_rgba(58,74,50,0.08)] backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}
