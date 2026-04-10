interface ProfileStatProps {
  label: string;
  value: number;
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}
