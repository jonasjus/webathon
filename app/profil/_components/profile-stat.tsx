interface ProfileStatProps {
  label: string;
  value: number;
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="rounded-[24px] border border-white/55 bg-white/72 px-4 py-3 text-center shadow-[0_10px_28px_-22px_rgba(15,27,18,0.55)] backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)] sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
        {value}
      </p>
    </div>
  );
}
