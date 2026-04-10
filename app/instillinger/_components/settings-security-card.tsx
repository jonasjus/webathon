import { updatePassword } from "@/lib/actions/account";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2";

const btnPrimary =
  "inline-flex h-10 items-center justify-center rounded-xl bg-[var(--sage-500)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus:ring-offset-2";

export function SettingsSecurityCard() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-5">
        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--sage-50)] text-[var(--sage-700)]">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 fill-none stroke-current"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <h2 className="card-title text-[1.45rem] text-[var(--ink)]">
          Sikkerhet
        </h2>
      </div>

      <form action={updatePassword} className="mt-5 space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor="new_password"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-none stroke-current"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            Nytt passord
          </label>
          <input
            id="new_password"
            name="new_password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Minst 6 tegn"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="confirm_password"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-none stroke-current"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
            Bekreft passord
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Skriv passordet på nytt"
            className={inputClass}
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className={btnPrimary}>
            Oppdater
          </button>
        </div>
      </form>
    </div>
  );
}
