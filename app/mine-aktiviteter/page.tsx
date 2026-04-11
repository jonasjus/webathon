import { redirect } from "next/navigation";
import { ActivityBrowser } from "@/components/activity/activity-browser";
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
        "Du må være logget inn for å se arrangementene dine."
      )}`
    );
  }

  const sidebarUser = buildAppUser(user);
  const myActivities = activities.filter(
    (activity) => activity.hostUserId === user.id || activity.isJoined
  );

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:p-0">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:max-w-none xl:gap-0 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-0 xl:h-screen">
          <Sidebar activeItem="Mine arrangementer" user={sidebarUser} />
        </div>

        <div className="flex flex-col gap-6 xl:px-8 xl:py-6">
          <section className="border-b border-[var(--border)] pb-8 sm:pb-10">
            <div className="max-w-5xl">
              <div>
                <p className="inline-flex rounded-full border border-[var(--hero-pill-border)] bg-[var(--hero-pill-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm backdrop-blur-sm">
                  Mine arrangementer
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  Dine arrangementer
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
                  Her ser du alle arrangementer du deltar på eller arrangerer selv.
                </p>
              </div>
            </div>
          </section>

          <section>
            <ActivityBrowser
              activities={myActivities}
              isLoggedIn
              currentUserId={user.id}
              initialView="compact"
              showCountdown
              emptyStateCopy={{
                baseTitle: "Ingen arrangementer enda",
                baseDescription:
                  "Når du blir med på et arrangement eller oppretter et selv, dukker det opp her.",
                filteredTitle: "Ingen arrangementer matcher",
                filteredDescription:
                  "Ingen av arrangementene dine matcher søket eller filtrene akkurat nå.",
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
