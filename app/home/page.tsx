import { Sidebar } from "@/components/layout/sidebar";
import { getActivities } from "@/lib/activities";
import { buildAppUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/lib/supabase/types";
import { DashboardStat } from "./_components/dashboard-stat";
import { CreateActivityCta } from "./_components/create-activity-cta";
import { ActivityFeed } from "./_components/activity-feed";

export default async function HomePage() {
  const supabase = await createClient();
  const [activitiesResult, { data: { user } }] = await Promise.all([
    getActivities()
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: [] as Activity[] })),
    supabase.auth.getUser(),
  ]);

  const activities = activitiesResult.data;
  if (!activitiesResult.ok) {
    console.error(
      "[Puls] Supabase fetch failed. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const currentUser = user ? buildAppUser(user) : null;
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

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar activeItem="Hjem" user={currentUser} />
        </div>

        <div className="flex flex-col gap-6">
          <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-[0_28px_72px_rgba(67,92,56,0.10)] sm:p-8">
            <div className="max-w-5xl">
              <div>
                <p className="inline-flex rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm backdrop-blur-sm">
                  Hjem
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  {currentUser
                    ? `Hei, ${firstName}. Klar for neste aktivitet?`
                    : "Bygg din egen aktivitetsuke i venue."}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
                  {currentUser
                    ? "Bruk hjem til å få oversikt over aktivitetene dine og finne nye økter å bli med på."
                    : "Utforsk kommende økter, se hvilke kategorier som er aktive nå, og logg inn når du vil bygge din egen profil."}
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <DashboardStat
                    label={currentUser ? "Planer" : "Aktiviteter"}
                    value={currentUser ? myActivities.length : activities.length}
                  />
                  <DashboardStat
                    label={currentUser ? "Arrangerer" : "Kategorier"}
                    value={
                      currentUser
                        ? hostedCount
                        : new Set(activities.map((activity) => activity.category)).size
                    }
                  />
                  <DashboardStat
                    label={currentUser ? "Deltar" : "Ledige plasser"}
                    value={
                      currentUser
                        ? joinedCount
                        : activities.reduce(
                            (total, activity) =>
                              total +
                              (activity.participantsMax - activity.participantsCurrent),
                            0
                          )
                    }
                  />
                  <DashboardStat
                    label={currentUser ? "I appen nå" : "Største gruppe"}
                    value={
                      currentUser
                        ? activities.length
                        : activities.reduce(
                            (max, activity) =>
                              Math.max(max, activity.participantsCurrent),
                            0
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <ActivityFeed
            activities={activities}
            isLoggedIn={!!currentUser}
            currentUserId={currentUser?.id}
            createCta={
              <CreateActivityCta
                isLoggedIn={!!currentUser}
                label="Opprett aktivitet"
                buttonClassName="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
              />
            }
          />
        </div>
      </div>
    </main>
  );
}
