"use client";

import { useState } from "react";
import type { Activity } from "../lib/supabase/types";
import { ActivityCard } from "./activity-card";
import { CreateActivityForm } from "./create-activity-form";

type FilterId = "alle" | "naer" | "ledige" | "helg";

interface ActivityFeedProps {
  activities: Activity[];
  isLoggedIn: boolean;
  currentUserId?: string | null;
}

const filters: { id: FilterId; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "naer", label: "I nærheten" },
  { id: "ledige", label: "Ledige plasser" },
  { id: "helg", label: "Denne helgen" },
];

export function ActivityFeed({ activities, isLoggedIn, currentUserId }: ActivityFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("alle");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const visibleActivities = activities.filter((activity) => {
    switch (activeFilter) {
      case "naer":
        return activity.location !== "Kolsåstoppen";
      case "ledige":
        return activity.participantsMax - activity.participantsCurrent >= 3;
      case "helg":
        return activity.date.startsWith("lør") || activity.date.startsWith("søn");
      case "alle":
        return true;
    }
  });

  return (
    <section className="min-h-[calc(100vh-3rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--ink-muted)]">
            Finn treninger i nærheten av deg
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Aktivitetsstrøm
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isLoggedIn) {
              window.location.href = "/login";
            } else {
              setShowCreateForm(true);
            }
          }}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
        >
          Opprett aktivitet
        </button>
      </div>

      {showCreateForm && (
        <CreateActivityForm onClose={() => setShowCreateForm(false)} />
      )}

      <div className="mt-5 flex flex-wrap gap-2">
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

      <div className="mt-6 space-y-4">
        {visibleActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isLoggedIn={isLoggedIn}
            currentUserId={currentUserId}
          />
        ))}
        {visibleActivities.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--ink-muted)]">
            Ingen aktiviteter for dette filteret.
          </p>
        )}
      </div>
    </section>
  );
}
