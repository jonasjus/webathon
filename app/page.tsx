import { ActivityFeed } from "./components/activity-feed";
import { Sidebar } from "./components/sidebar";
import { activities } from "./lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar />
        </div>

        <ActivityFeed activities={activities} />
      </div>
    </main>
  );
}
