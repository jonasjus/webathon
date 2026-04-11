"use client";

import dynamic from "next/dynamic";
import type { Activity } from "@/lib/supabase/types";

interface ActivityDetailMapProps {
  activity: Activity;
}

const DynamicActivityDetailMapCanvas = dynamic(
  () =>
    import("./activity-detail-map-canvas").then(
      (module) => module.ActivityDetailMapCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[var(--surface-muted)] text-sm text-[var(--ink-muted)]">
        Laster kart…
      </div>
    ),
  }
);

export function ActivityDetailMap({ activity }: ActivityDetailMapProps) {
  return (
    <div className="h-[18rem] overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-muted)]">
      <DynamicActivityDetailMapCanvas activity={activity} />
    </div>
  );
}
