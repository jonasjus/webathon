import { redirect } from "next/navigation";
import { ActivityCard } from "@/components/activity/activity-card";
import { Sidebar } from "@/components/layout/sidebar";
import { getActivities } from "@/lib/activities";
import { buildAppUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";

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

  const sidebarUser = buildAppUser(user);
  const myActivities = activities.filter(
    (activity) => activity.hostUserId === user.id || activity.isJoined
  );
  const now = Date.now();
  function daysUntil(startsAt: string) {
    return Math.max(0, Math.floor((new Date(startsAt).getTime() - now) / 86_400_000));
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar activeItem="Mine aktiviteter" user={sidebarUser} />
        </div>

        <div className="flex flex-col gap-6">
          <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-[0_28px_72px_rgba(67,92,56,0.10)] sm:p-8">
            <div className="max-w-5xl">
              <div>
                <p className="inline-flex rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm backdrop-blur-sm">
                  Mine aktiviteter
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  Dine aktiviteter
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
                  Her ser du alle aktiviteter du deltar på eller arrangerer selv.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          {myActivities.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 text-center">
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                Ingen aktiviteter enda
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--ink-muted)]">
                Når du blir med på en aktivitet eller oppretter en selv, dukker den opp her.
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
                  daysUntil={daysUntil(activity.startsAt)}
                />
              ))}
            </div>
          )}
          </section>
        </div>
      </div>
    </main>
  );
}
