import { InteractiveMap } from "@/components/activity/interactive-map";
import { Sidebar } from "@/components/layout/sidebar";
import { getActivities } from "@/lib/activities";
import { buildAppUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function MapPage() {
  const supabase = await createClient();
  const [
    activities,
    {
      data: { user },
    },
  ] = await Promise.all([getActivities(), supabase.auth.getUser()]);

  const currentUser = user ? buildAppUser(user) : null;

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:p-0">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:max-w-none xl:gap-0 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-0 xl:h-screen">
          <Sidebar activeItem="Kart" user={currentUser} />
        </div>

        <div className="flex flex-col gap-6 xl:px-8 xl:py-6">
          <section className="border-b border-[var(--border)] pb-8 sm:pb-10">
            <div className="max-w-5xl">
              <p className="inline-flex rounded-full border border-[var(--hero-pill-border)] bg-[var(--hero-pill-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm backdrop-blur-sm">
                Kart
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                Se arrangementene direkte på kartet
              </h1>
            </div>
          </section>

          <InteractiveMap
            activities={activities}
            currentUserId={currentUser?.id}
            isLoggedIn={!!currentUser}
          />
        </div>
      </div>
    </main>
  );
}
