import { updateDisplayName } from "@/lib/actions/account";

interface SettingsProfileCardProps {
  displayName: string;
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2";

const btnPrimary =
  "inline-flex h-10 items-center justify-center rounded-xl bg-[var(--sage-500)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus:ring-offset-2";

export function SettingsProfileCard({
  displayName,
}: SettingsProfileCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-4">
        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--sage-50)] text-[var(--sage-700)]">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 fill-none stroke-current"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </span>
        <h2 className="text-sm font-semibold text-[var(--ink)]">Profil</h2>
      </div>

      <form action={updateDisplayName} className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor="display_name"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-none stroke-current"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Visningsnavn
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            required
            minLength={2}
            defaultValue={displayName}
            autoComplete="name"
            className={inputClass}
          />
          <p className="text-xs text-[var(--ink-subtle)]">
            Vises i aktivitetsstrømmen og meldinger.
          </p>
        </div>
        <div className="flex justify-end">
          <button type="submit" className={btnPrimary}>
            Lagre
          </button>
        </div>
      </form>
    </div>
  );
}
