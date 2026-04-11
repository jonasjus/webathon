import { Sidebar } from "@/components/layout/sidebar";
import { getActivities } from "@/lib/activities";
import { buildAppUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/lib/supabase/types";
import { ActivityFeed } from "./_components/activity-feed";
import { CreateActivityCta } from "./_components/create-activity-cta";
import { DashboardStat } from "./_components/dashboard-stat";
import { PlannerStatsToggle } from "./_components/planner-stats-toggle";

export default async function HomePage() {
  const supabase = await createClient();
  const [
    activitiesResult,
    {
      data: { user },
    },
    userCountResult,
  ] = await Promise.all([
    getActivities()
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: [] as Activity[] })),
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("id", { head: true, count: "exact" })
      .then(({ count, error }) => ({
        ok: !error,
        count: count ?? 0,
        error,
      })),
  ]);

  const activities = activitiesResult.data;
  if (!activitiesResult.ok) {
    console.error(
      "[Puls] Supabase fetch failed. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  if (!userCountResult.ok) {
    console.error(
      `[Puls] Profile count failed: ${userCountResult.error?.message ?? "unknown error"}`
    );
  }

  const currentUser = user ? buildAppUser(user) : null;
  const usersInApp = userCountResult.count;
  const firstName = currentUser?.displayName.split(" ")[0] ?? "deg";
  const myActivities = currentUser
    ? activities.filter(
        (activity) =>
          activity.hostUserId === currentUser.id || activity.isJoined
      )
    : [];
  const hostedCount = myActivities.filter(
    (activity) => activity.hostUserId === currentUser?.id
  ).length;
  const joinedCount = myActivities.filter(
    (activity) => activity.hostUserId !== currentUser?.id && activity.isJoined
  ).length;
  const plannerStats = [
    { label: "Planer", value: myActivities.length },
    { label: "Arrangerer", value: hostedCount },
    { label: "Deltar", value: joinedCount },
    { label: "Brukere i appen", value: usersInApp },
  ];
  const publicStats = [
    { label: "Arrangementer", value: activities.length },
    {
      label: "Kategorier",
      value: new Set(activities.map((activity) => activity.category)).size,
    },
    {
      label: "Ledige plasser",
      value: activities.reduce(
        (total, activity) =>
          total + (activity.participantsMax - activity.participantsCurrent),
        0
      ),
    },
    {
      label: "Største gruppe",
      value: activities.reduce(
        (max, activity) => Math.max(max, activity.participantsCurrent),
        0
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar activeItem="Hjem" user={currentUser} />
        </div>

        <div className="flex flex-col gap-6">
          <section className="border-b border-[var(--border)] pb-8 sm:pb-10">
            <div className="max-w-5xl">
              <div>
                <p className="inline-flex rounded-full border border-[var(--hero-pill-border)] bg-[var(--hero-pill-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm backdrop-blur-sm">
                  Hjem
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  {currentUser
                    ? `Hei, ${firstName}. Klar for neste arrangement?`
                    : "Bygg din egen arrangementsuke i venue."}
                </h1>
              </div>
            </div>

            {currentUser ? (
              <div className="mt-4 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-6">
                <p className="max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
                  Bruk hjem til å få oversikt over arrangementene dine og finne nye du vil bli med på.
                </p>
                <PlannerStatsToggle stats={plannerStats} />
              </div>
            ) : (
              <div className="max-w-5xl">
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
                  Utforsk kommende arrangementer, se hvilke kategorier som er aktive nå, og logg inn når du vil bygge din egen profil.
                </p>
                <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {publicStats.map((stat) => (
                    <DashboardStat
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          <ActivityFeed
            activities={activities}
            isLoggedIn={!!currentUser}
            currentUserId={currentUser?.id}
            createCta={
              <CreateActivityCta
                isLoggedIn={!!currentUser}
                label="Opprett arrangement"
                buttonClassName="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
              />
            }
          />
        </div>
      </div>
    </main>
  );
}
