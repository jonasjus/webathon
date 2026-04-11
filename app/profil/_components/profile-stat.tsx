interface ProfileStatProps {
  label: string;
  value: number;
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div
      className="rounded-[24px] border px-4 py-3 text-center backdrop-blur-sm"
      style={{
        background: "var(--profile-stat-bg)",
        borderColor: "var(--profile-stat-border)",
        boxShadow: "var(--profile-stat-shadow)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)] sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
        {value}
      </p>
    </div>
  );
}
