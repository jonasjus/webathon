"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Activity } from "@/lib/supabase/types";

interface InteractiveMapProps {
  activities: Activity[];
  currentUserId?: string | null;
  isLoggedIn: boolean;
}

const DynamicActivityMapCanvas = dynamic(
  () =>
    import("./activity-map-canvas").then((module) => module.ActivityMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[var(--surface-muted)] text-sm text-[var(--ink-muted)]">
        Laster kart…
      </div>
    ),
  }
);

export function InteractiveMap({
  activities,
  currentUserId,
  isLoggedIn,
}: InteractiveMapProps) {
  const [selectedActivityId, setSelectedActivityId] = useState<string>();

  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
            Kart
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
            I nærheten av deg
          </h3>
        </div>
        <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--ink-muted)]">
          {activities.length} arrangementer
        </span>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <div className="h-[34rem] overflow-hidden rounded-[1.35rem] bg-[var(--surface-muted)] sm:h-[40rem] xl:h-[46rem]">
          <DynamicActivityMapCanvas
            activities={activities}
            currentUserId={currentUserId}
            isLoggedIn={isLoggedIn}
            selectedActivityId={selectedActivityId}
            onSelectActivity={setSelectedActivityId}
            onClearSelection={() => setSelectedActivityId(undefined)}
          />
        </div>
      </div>
    </section>
  );
}
