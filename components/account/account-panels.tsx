import { updateDisplayName, updatePassword } from "@/lib/actions/account";

interface DisplayNamePanelProps {
  displayName: string;
  redirectPath?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function DisplayNamePanel({
  displayName,
  redirectPath = "/instillinger",
  title = "Visningsnavn",
  description = "Navnet brukes i profilen din, aktivitetskort og meldinger.",
  className = "",
}: DisplayNamePanelProps) {
  return (
    <section
      className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] ${className}`.trim()}
    >
      <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">{description}</p>

      <form action={updateDisplayName} className="mt-5 space-y-4">
        <input type="hidden" name="redirect_to" value={redirectPath} />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`display_name_${redirectPath.replace("/", "") || "root"}`}
            className="text-sm font-medium text-[var(--ink)]"
          >
            Navn
          </label>
          <input
            id={`display_name_${redirectPath.replace("/", "") || "root"}`}
            name="display_name"
            type="text"
            required
            minLength={2}
            defaultValue={displayName}
            autoComplete="name"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--sage-500)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
        >
          Lagre navn
        </button>
      </form>
    </section>
  );
}

interface PasswordPanelProps {
  redirectPath?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function PasswordPanel({
  redirectPath = "/instillinger",
  title = "Passord og sikkerhet",
  description = "Velg et nytt passord på minst 6 tegn for kontoen din.",
  className = "",
}: PasswordPanelProps) {
  const newPasswordId = `new_password_${redirectPath.replace("/", "") || "root"}`;
  const confirmPasswordId = `confirm_password_${redirectPath.replace("/", "") || "root"}`;

  return (
    <section
      className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] ${className}`.trim()}
    >
      <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">{description}</p>

      <form action={updatePassword} className="mt-5 space-y-4">
        <input type="hidden" name="redirect_to" value={redirectPath} />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={newPasswordId}
            className="text-sm font-medium text-[var(--ink)]"
          >
            Nytt passord
          </label>
          <input
            id={newPasswordId}
            name="new_password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Minst 6 tegn"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={confirmPasswordId}
            className="text-sm font-medium text-[var(--ink)]"
          >
            Bekreft nytt passord
          </label>
          <input
            id={confirmPasswordId}
            name="confirm_password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Skriv passordet på nytt"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--sage-500)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus:ring-offset-2"
        >
          Oppdater passord
        </button>
      </form>
    </section>
  );
}
