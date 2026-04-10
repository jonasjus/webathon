import type { Activity } from "../lib/supabase/types";
import { CategoryTag, getCategoryAppearance, SportGlyph } from "./category-tag";
import { JoinButton } from "./join-button";
import { ParticipantStack } from "./participant-stack";

interface ActivityCardProps {
  activity: Activity;
  isLoggedIn: boolean;
}

export function ActivityCard({ activity, isLoggedIn }: ActivityCardProps) {
  const appearance = getCategoryAppearance(activity.category);

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition hover:border-[color:rgba(122,160,96,0.4)] hover:shadow-[var(--shadow-card-strong)] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: appearance.color }}
      >
        <SportGlyph category={activity.category} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--ink-muted)]">
          <span className="font-medium text-[var(--ink)]">{activity.host}</span>
          <span aria-hidden="true" className="text-[var(--ink-subtle)]">
            ·
          </span>
          <span>{activity.location}</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">
          {activity.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          {activity.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <MetaItem icon={<CalendarIcon />}>
            {activity.date} · {activity.time}
          </MetaItem>
          <MetaItem icon={<LocationIcon />}>{activity.location}</MetaItem>
          <CategoryTag category={activity.category} />
        </div>

        <div className="mt-4">
          <ParticipantStack
            current={activity.participantsCurrent}
            max={activity.participantsMax}
          />
        </div>
      </div>

      <div className="lg:justify-self-end">
        <JoinButton
          activityId={activity.id}
          isJoined={activity.isJoined}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </article>
  );
}

interface MetaItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

function MetaItem({ children, icon }: MetaItemProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--ink-muted)]">
      {icon}
      {children}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M12 20s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
