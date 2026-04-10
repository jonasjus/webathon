"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ActivityCard } from "@/components/activity/activity-card";
import type { Activity } from "@/lib/supabase/types";

type FilterId = "alle" | "helg" | "ledige";

interface ActivityFeedProps {
  activities: Activity[];
  isLoggedIn: boolean;
  currentUserId?: string | null;
  createCta?: ReactNode;
}

const filters: { id: FilterId; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "helg", label: "Denne helgen" },
  { id: "ledige", label: "Ledige plasser" },
];

function isThisWeekend(startsAt: string): boolean {
  const now = new Date();
  const date = new Date(startsAt);

  // Find the upcoming Saturday (day 6) and Sunday (day 0)
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const daysUntilSat = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
  const daysUntilSun = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const satStart = new Date(now);
  satStart.setDate(now.getDate() + daysUntilSat);
  satStart.setHours(0, 0, 0, 0);

  const sunEnd = new Date(now);
  sunEnd.setDate(now.getDate() + daysUntilSun);
  sunEnd.setHours(23, 59, 59, 999);

  return date >= satStart && date <= sunEnd;
}

export function ActivityFeed({ activities, isLoggedIn, currentUserId, createCta }: ActivityFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("alle");

  const visibleActivities = activities.filter((activity) => {
    switch (activeFilter) {
      case "helg":
        return isThisWeekend(activity.startsAt);
      case "ledige":
        return activity.participantsMax - activity.participantsCurrent > 0;
      case "alle":
        return true;
    }
  });

  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--ink-muted)]">
              Aktiviteter akkurat nå
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Neste økter i venue
            </h2>
          </div>
          {createCta}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-[var(--sage-500)] text-white"
                    : "bg-[var(--surface-muted)] text-[var(--ink-muted)] hover:bg-[var(--sage-50)] hover:text-[var(--ink)]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {visibleActivities.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-[var(--ink)]">
              Ingen aktiviteter
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              Ingen aktiviteter matcher dette filteret akkurat nå.
            </p>
          </div>
        ) : (
          visibleActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </section>
  );
}
