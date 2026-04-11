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
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:max-w-none xl:gap-0 xl:grid-cols-[225px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-0 xl:h-screen">
          <Sidebar activeItem="Kart" user={currentUser} />
        </div>

        <div className="flex flex-col xl:px-8 xl:py-6">
          <section className="border-[var(--border)] pb-8 sm:pb-5">
            <div className="max-w-5xl">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                Se arrangementer nær deg
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
