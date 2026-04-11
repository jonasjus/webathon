import { redirect } from "next/navigation";
import { DeleteAccountForm } from "@/components/account/delete-account-form";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { SettingsIdentityChip } from "./_components/settings-identity-chip";
import { SettingsProfileCard } from "./_components/settings-profile-card";
import { SettingsSecurityCard } from "./_components/settings-security-card";
import { SettingsThemeCard } from "./_components/settings-theme-card";

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

        <div className="flex flex-col gap-6">
          <section className="border-b border-[var(--border)] pb-8 sm:pb-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex rounded-full border border-[var(--hero-pill-border)] bg-[var(--hero-pill-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm">
                  Konto, sikkerhet og utseende
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  Innstillinger
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
                  Oppdater profilen din, bytt passord og styr hvordan appen ser
                  ut, alt fra ett sted.
                </p>
              </div>

              <SettingsIdentityChip
                displayName={displayName}
                email={user.email}
                initials={initials}
                avatarColor={avatarColor}
                avatarUrl={avatarUrl}
              />
            </div>
          </section>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </p>
          )}
          {success && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {decodeURIComponent(success)}
            </p>
          )}

          <section>
            <div className="grid gap-4 xl:grid-cols-3">
              <SettingsProfileCard displayName={displayName} />
              <SettingsSecurityCard />
              <SettingsThemeCard />
            </div>
          </section>

          <section className="border-t border-[color:rgba(239,68,68,0.24)] pt-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[color:rgba(239,68,68,0.16)] text-red-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 fill-none stroke-current"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92A2 2 0 0 0 22.18 18L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                    <path d="M12 9v4M12 17h.01" />
                  </svg>
                </span>
                <div>
                  <h2 className="card-title text-[1.45rem] text-red-200">
                    Slett konto
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
                    Dette sletter brukeren din <strong>permanent</strong>,
                    inkludert arrangementer og deltakelser.
                  </p>
                </div>
              </div>

              <DeleteAccountForm redirectPath="/instillinger" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
