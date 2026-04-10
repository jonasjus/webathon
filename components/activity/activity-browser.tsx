"use client";

import { useDeferredValue, useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { Activity, ActivityCategory } from "@/lib/supabase/types";
import { categoryOptions, getCategoryAppearance } from "./category-tag";
import { ActivityCard } from "./activity-card";

type FilterId = "alle" | "helg" | "ledige";
type ActivityView = "compact" | "detailed";

interface EmptyStateCopy {
  baseTitle: string;
  baseDescription: string;
  filteredTitle: string;
  filteredDescription: string;
}

interface ActivityBrowserProps {
  activities: Activity[];
  isLoggedIn: boolean;
  currentUserId?: string | null;
  initialView?: ActivityView;
  showCountdown?: boolean;
  emptyStateCopy?: Partial<EmptyStateCopy>;
}

const filters: { id: FilterId; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "helg", label: "Denne helgen" },
  { id: "ledige", label: "Ledige plasser" },
];

const emptyStateDefaults: EmptyStateCopy = {
  baseTitle: "Ingen aktiviteter",
  baseDescription: "Det er ingen aktiviteter å vise akkurat nå.",
  filteredTitle: "Ingen aktiviteter matcher",
  filteredDescription: "Prøv et annet søk eller juster filtrene dine.",
};

function isThisWeekend(startsAt: string): boolean {
  const now = new Date();
  const date = new Date(startsAt);
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const saturdayStart = new Date(now);
  saturdayStart.setDate(now.getDate() + daysUntilSaturday);
  saturdayStart.setHours(0, 0, 0, 0);

  const sundayEnd = new Date(now);
  sundayEnd.setDate(now.getDate() + daysUntilSunday);
  sundayEnd.setHours(23, 59, 59, 999);

  return date >= saturdayStart && date <= sundayEnd;
}

function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll("æ", "ae")
    .replaceAll("ø", "o")
    .replaceAll("å", "a");
}

function getDaysUntil(startsAt: string, referenceDate: string): number {
  const startOfToday = new Date(referenceDate);
  startOfToday.setHours(0, 0, 0, 0);

  const activityDate = new Date(startsAt);
  activityDate.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.floor((activityDate.getTime() - startOfToday.getTime()) / 86_400_000)
  );
}

export function ActivityBrowser({
  activities,
  isLoggedIn,
  currentUserId,
  initialView = "detailed",
  showCountdown = false,
  emptyStateCopy,
}: ActivityBrowserProps) {
  const mergedEmptyState = { ...emptyStateDefaults, ...emptyStateCopy };
  const [activeFilter, setActiveFilter] = useState<FilterId>("alle");
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | "all">(
    "all"
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ActivityView>(initialView);
  const [referenceDate] = useState(() => new Date().toISOString());
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearchValue(deferredQuery);

  const availableCategories = categoryOptions.filter((option) =>
    activities.some((activity) => activity.category === option.value)
  );

  const visibleActivities = activities.filter((activity) => {
    if (activeFilter === "helg" && !isThisWeekend(activity.startsAt)) {
      return false;
    }

    if (activeFilter === "ledige") {
      const hasOpenSpot =
        activity.participantsMax - activity.participantsCurrent > 0;
      const isAlreadyParticipating =
        !!currentUserId &&
        (activity.hostUserId === currentUserId || activity.isJoined);

      if (!hasOpenSpot || isAlreadyParticipating) {
        return false;
      }
    }

    if (selectedCategory !== "all" && activity.category !== selectedCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const categoryLabel = getCategoryAppearance(activity.category).label;
    const haystack = normalizeSearchValue(
      [
        activity.title,
        activity.location,
        activity.host,
        activity.description,
        categoryLabel,
      ].join(" ")
    );

    return haystack.includes(normalizedQuery);
  });

  const hasAppliedFilters =
    activeFilter !== "alle" ||
    selectedCategory !== "all" ||
    normalizedQuery.length > 0;
  const activeFilterCount =
    (activeFilter !== "alle" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (normalizedQuery.length > 0 ? 1 : 0);

  return (
    <div>
      {activities.length > 0 ? (
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                <SlidersHorizontal className="h-4 w-4" />
                <span>
                  {visibleActivities.length} av {activities.length} aktiviteter
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen((current) => !current)}
                  aria-expanded={isFiltersOpen}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
                    isFiltersOpen || hasAppliedFilters
                      ? "border-[var(--sage-500)] bg-[var(--sage-50)] text-[var(--sage-700)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {isFiltersOpen ? "Skjul filtre" : "Filtre"}
                  {activeFilterCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--sage-500)] px-1.5 text-xs font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>

                <div className="inline-flex w-full rounded-full bg-[var(--surface)] p-1 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setView("detailed")}
                    aria-pressed={view === "detailed"}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
                      view === "detailed"
                        ? "bg-[var(--sage-500)] text-white"
                        : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Detaljert
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("compact")}
                    aria-pressed={view === "compact"}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
                      view === "compact"
                        ? "bg-[var(--sage-500)] text-white"
                        : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    Kompakt
                  </button>
                </div>
              </div>
            </div>

            {isFiltersOpen ? (
              <div className="space-y-3">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-subtle)]" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Søk i tittel, sted, kategori eller arrangør"
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[color:rgba(122,160,96,0.18)]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(event) =>
                        setSelectedCategory(event.target.value as ActivityCategory | "all")
                      }
                      className="h-11 w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 pr-11 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[color:rgba(122,160,96,0.18)]"
                    >
                      <option value="all">Alle kategorier</option>
                      {availableCategories.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-subtle)]" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
                            : "bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-white hover:text-[var(--ink)]"
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={activities.length > 0 ? "mt-6" : ""}>
        {visibleActivities.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-[var(--ink)]">
              {hasAppliedFilters
                ? mergedEmptyState.filteredTitle
                : mergedEmptyState.baseTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              {hasAppliedFilters
                ? mergedEmptyState.filteredDescription
                : mergedEmptyState.baseDescription}
            </p>
          </div>
        ) : (
          <div className={view === "compact" ? "space-y-3" : "space-y-4"}>
            {visibleActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isLoggedIn={isLoggedIn}
                currentUserId={currentUserId}
                daysUntil={
                  showCountdown
                    ? getDaysUntil(activity.startsAt, referenceDate)
                    : undefined
                }
                variant={view}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
