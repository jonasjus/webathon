import { Avatar } from "@/components/account/avatar";

interface SettingsIdentityChipProps {
  displayName: string;
  email: string | null | undefined;
  initials: string;
  avatarColor: string;
  avatarUrl?: string | null;
}

export function SettingsIdentityChip({
  displayName,
  email,
  initials,
  avatarColor,
  avatarUrl,
}: SettingsIdentityChipProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 shadow-sm">
      <Avatar src={avatarUrl} initials={initials} color={avatarColor} size={40} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--ink)]">
          {displayName}
        </p>
        <p className="truncate text-xs text-[var(--ink-muted)]">{email}</p>
      </div>
      <span className="ml-1 hidden items-center gap-1 rounded-full bg-[var(--sage-50)] px-2 py-0.5 text-xs font-medium text-[var(--sage-700)] sm:inline-flex">
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3 fill-none stroke-current"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Verifisert
      </span>
    </div>
  );
}
