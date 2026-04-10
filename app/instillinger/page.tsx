import { redirect } from "next/navigation";
import { AvatarUpload } from "../components/avatar-upload";
import { DeleteAccountForm } from "../components/delete-account-form";
import { Sidebar } from "../components/sidebar";
import { createClient } from "../lib/supabase/server";
import {
  updateDisplayName,
  updatePassword,
} from "./actions";

interface SettingsPageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { error, success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Du må være logget inn for å åpne innstillinger."
      )}`
    );
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email ??
    "Bruker";
  const initials =
    (user.user_metadata?.initials as string | undefined) ?? "?";
  const avatarColor =
    (user.user_metadata?.avatar_color as string | undefined) ?? "#5FA8D3";
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar
            activeItem="Innstillinger"
            user={{ id: user.id, displayName, initials, avatarColor, avatarUrl }}
          />
        </div>

        <section className="min-h-[calc(100vh-3rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--ink-muted)]">
                Konto og sikkerhet
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
                Innstillinger
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
                Oppdater navnet ditt, velg et nytt passord eller slett kontoen
                hvis du ikke lenger vil bruke Puls.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
              <AvatarUpload
                userId={user.id}
                currentSrc={avatarUrl}
                initials={initials}
                color={avatarColor}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--ink)]">
                  {displayName}
                </p>
                <p className="truncate text-sm text-[var(--ink-muted)]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </p>
          )}

          {success && (
            <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {decodeURIComponent(success)}
            </p>
          )}

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                Endre navn
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Dette navnet vises i aktivitetsstrømmen og på profilen din.
              </p>

              <form action={updateDisplayName} className="mt-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="display_name"
                    className="text-sm font-medium text-[var(--ink)]"
                  >
                    Navn
                  </label>
                  <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    required
                    minLength={2}
                    defaultValue={displayName}
                    autoComplete="name"
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
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

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                Endre passord
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Velg et nytt passord på minst 6 tegn for kontoen din.
              </p>

              <form action={updatePassword} className="mt-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="new_password"
                    className="text-sm font-medium text-[var(--ink)]"
                  >
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
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirm_password"
                    className="text-sm font-medium text-[var(--ink)]"
                  >
                    Bekreft nytt passord
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Skriv passordet på nytt"
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--sage-500)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                >
                  Oppdater passord
                </button>
              </form>
            </section>
          </div>

          <section className="mt-4 rounded-2xl border border-red-200 bg-[color:rgba(239,68,68,0.04)] p-5">
            <h2 className="text-lg font-semibold text-red-950">Slett konto</h2>
            <div className="mt-2 flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:rgba(239,68,68,0.1)] text-red-700">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current"
                  strokeWidth="1.9"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92A2 2 0 0 0 22.18 18L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              <p className="max-w-2xl text-sm leading-6 text-gray-700">
                Dette sletter brukeren din <strong>permanent</strong>,
                inkludert aktiviteter og deltakelser som er knyttet til
                kontoen.
              </p>
            </div>

            <DeleteAccountForm />
          </section>
        </section>
      </div>
    </main>
  );
}
