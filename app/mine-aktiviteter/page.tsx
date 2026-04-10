import { redirect } from "next/navigation";
import { ActivityCard } from "../components/activity-card";
import { Sidebar } from "../components/sidebar";
import { getActivities } from "../lib/activities";
import { createClient } from "../lib/supabase/server";

export default async function MyActivitiesPage() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    activities,
  ] = await Promise.all([supabase.auth.getUser(), getActivities()]);

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Du må være logget inn for å se dine aktiviteter."
      )}`
    );
  }

  const sidebarUser = {
    id: user.id,
    displayName:
      (user.user_metadata?.display_name as string | undefined) ??
      user.email ??
      "Bruker",
    initials: (user.user_metadata?.initials as string | undefined) ?? "?",
    avatarColor:
      (user.user_metadata?.avatar_color as string | undefined) ?? "#5FA8D3",
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  const myActivities = activities.filter(
    (activity) => activity.hostUserId === user.id || activity.isJoined
  );
  const hostedCount = myActivities.filter(
    (activity) => activity.hostUserId === user.id
  ).length;
  const joinedCount = myActivities.filter(
    (activity) => activity.hostUserId !== user.id && activity.isJoined
  ).length;

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar activeItem="Mine aktiviteter" user={sidebarUser} />
        </div>

        <section className="min-h-[calc(100vh-3rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--ink-muted)]">
                Aktiviteter du er med på
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
                Mine aktiviteter
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
                Her ser du alle aktiviteter du deltar på eller arrangerer selv.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatPill label="Totalt" value={myActivities.length} />
              <StatPill label="Arrangerer" value={hostedCount} />
              <StatPill label="Deltar" value={joinedCount} />
            </div>
          </div>

          {myActivities.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 text-center">
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                Ingen aktiviteter enda
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--ink-muted)]">
                Når du blir med på en aktivitet eller oppretter en selv, dukker
                den opp her.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {myActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isLoggedIn
                  currentUserId={user.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

interface StatPillProps {
  label: string;
  value: number;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}
