"use client";

import { useState } from "react";
import type { Activity } from "@/lib/supabase/types";
import { getCategoryAppearance } from "./category-tag";

interface InteractiveMapProps {
  activities: Activity[];
}

export function InteractiveMap({ activities }: InteractiveMapProps) {
  const [selectedActivityId, setSelectedActivityId] = useState(activities[0]?.id);
  const selectedActivity =
    activities.find((activity) => activity.id === selectedActivityId) ??
    activities[0];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
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
          {activities.length} økter
        </span>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <div className="relative h-56 overflow-hidden rounded-xl bg-[var(--surface-muted)]">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            role="img"
            aria-label="Interaktivt kart over aktiviteter i Oslo"
          >
            <path
              d="M18 14C29 11 44 14 55 18C64 22 72 29 79 38C83 43 88 49 89 58C89 67 82 74 74 77C63 82 48 83 38 81C29 80 21 75 16 68C11 61 10 52 11 44C12 34 10 24 18 14Z"
              fill="white"
              stroke="rgba(108, 126, 109, 0.22)"
              strokeWidth="1.2"
            />
            <path
              d="M68 8C77 11 84 18 87 27C90 36 89 47 85 55C82 60 78 64 72 65C70 58 70 49 69 41C67 31 67 20 68 8Z"
              fill="rgba(238, 242, 232, 0.95)"
            />
            <path
              d="M30 28C36 34 38 41 38 49C38 58 35 66 29 72"
              fill="none"
              stroke="rgba(108, 126, 109, 0.18)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M53 19C56 28 57 39 55 48C53 58 49 68 44 77"
              fill="none"
              stroke="rgba(108, 126, 109, 0.15)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {activities.map((activity) => {
            const isSelected = activity.id === selectedActivity?.id;
            const appearance = getCategoryAppearance(activity.category);

            return (
              <button
                key={activity.id}
                type="button"
                onMouseEnter={() => setSelectedActivityId(activity.id)}
                onFocus={() => setSelectedActivityId(activity.id)}
                onClick={() => setSelectedActivityId(activity.id)}
                aria-label={`Vis aktivitet: ${activity.title}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-muted)]"
                style={{
                  left: `${activity.mapPin.x}%`,
                  top: `${activity.mapPin.y}%`,
                }}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-sm transition ${
                    isSelected ? "scale-125" : "scale-100"
                  }`}
                  style={{ backgroundColor: appearance.color }}
                />
                {isSelected ? (
                  <span className="pointer-events-none absolute left-1/2 top-[-0.9rem] w-max -translate-x-1/2 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
                    {activity.title}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl bg-white p-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {selectedActivity?.title}
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                {selectedActivity?.location} · {selectedActivity?.date} kl.{" "}
                {selectedActivity?.time}
              </p>
            </div>
            <span className="rounded-full bg-[var(--sage-50)] px-3 py-1 text-xs font-medium text-[var(--sage-700)]">
              {selectedActivity?.participantsCurrent}/
              {selectedActivity?.participantsMax} påmeldte
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
