import { ActivityFeed } from "./components/activity-feed";
import { Sidebar } from "./components/sidebar";
import { getActivities } from "./lib/activities";
import { createClient } from "./lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [activitiesResult, { data: { user } }] = await Promise.all([
    getActivities().then((a) => ({ ok: true as const, data: a })).catch(() => ({ ok: false as const, data: [] })),
    supabase.auth.getUser(),
  ]);

  const activities = activitiesResult.data;
  if (!activitiesResult.ok) {
    console.error(
      "[Puls] Supabase fetch failed. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const sidebarUser = user
    ? {
        displayName: (user.user_metadata?.display_name as string | undefined) ?? user.email ?? "Bruker",
        initials: (user.user_metadata?.initials as string | undefined) ?? "?",
        avatarColor: (user.user_metadata?.avatar_color as string | undefined) ?? "#5FA8D3",
      }
    : null;

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar user={sidebarUser} />
        </div>

        <div className="flex flex-col gap-4">
          <ActivityFeed activities={activities} isLoggedIn={!!user} />
        </div>
      </div>
    </main>
  );
}
