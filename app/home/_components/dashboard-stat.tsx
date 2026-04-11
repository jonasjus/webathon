interface DashboardStatProps {
  label: string;
  value: number;
}

export function DashboardStat({ label, value }: DashboardStatProps) {
  return (
    <div
      className="rounded-[28px] border px-4 py-4 backdrop-blur-sm"
      style={{
        background: "var(--stat-card-bg)",
        borderColor: "var(--stat-card-border)",
        boxShadow: "var(--stat-card-shadow)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}
