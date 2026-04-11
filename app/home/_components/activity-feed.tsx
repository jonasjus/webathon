import type { ReactNode } from "react";
import { ActivityBrowser } from "@/components/activity/activity-browser";
import type { Activity } from "@/lib/supabase/types";

interface ActivityFeedProps {
  activities: Activity[];
  isLoggedIn: boolean;
  currentUserId?: string | null;
  createCta?: ReactNode;
}

export function ActivityFeed({
  activities,
  isLoggedIn,
  currentUserId,
  createCta,
}: ActivityFeedProps) {
  return (
    <section>
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="card-intro">
            <p className="text-sm font-medium text-[var(--ink-muted)]">
              Arrangementer akkurat nå
            </p>
            <h2 className="card-title text-[2.35rem] text-[var(--ink)]">
              Kommende arrangementer i venue
            </h2>
          </div>
          {createCta}
        </div>
      </div>

      <div className="mt-6">
        <ActivityBrowser
          activities={activities}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
          enableDetailsDialog
          initialView="detailed"
          emptyStateCopy={{
            baseTitle: "Ingen arrangementer",
            baseDescription: "Det er ingen arrangementer å vise akkurat nå.",
            filteredTitle: "Ingen arrangementer matcher",
            filteredDescription:
              "Ingen arrangementer matcher søket eller filtrene dine akkurat nå.",
          }}
        />
      </div>
    </section>
  );
}
