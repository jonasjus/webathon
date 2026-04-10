import type { ReactNode } from "react";
import { Avatar } from "@/components/account/avatar";
import type { Activity } from "@/lib/supabase/types";
import { CategoryTag, getCategoryAppearance, SportGlyph } from "./category-tag";
import { JoinButton } from "./join-button";
import { ParticipantStack } from "./participant-stack";

interface ActivityCardProps {
  activity: Activity;
  isLoggedIn: boolean;
  currentUserId?: string | null;
  daysUntil?: number;
}

function getUrgencyStyles(days: number | undefined): string {
  if (days === undefined) return "border-[var(--border)] bg-[var(--surface)]";
  if (days === 0) return "border-[var(--sage-500)] bg-[var(--sage-50)]";
  if (days === 1) return "border-[rgba(122,160,96,0.65)] bg-[rgba(237,244,225,0.55)]";
  if (days <= 3) return "border-[rgba(122,160,96,0.4)] bg-[rgba(237,244,225,0.35)]";
  if (days <= 6) return "border-[rgba(122,160,96,0.22)] bg-[rgba(237,244,225,0.18)]";
  return "border-[var(--border)] bg-[var(--surface)]";
}

function getCountdownLabel(days: number): string {
  if (days === 0) return "I dag";
  if (days === 1) return "I morgen";
  return `Om ${days} dager`;
}

function getCountdownBadgeStyles(days: number): string {
  if (days === 0) return "bg-[var(--sage-500)] text-white";
  if (days === 1) return "bg-[rgba(122,160,96,0.2)] text-[var(--sage-700)]";
  if (days <= 3) return "bg-[rgba(122,160,96,0.12)] text-[var(--sage-700)]";
  return "bg-[var(--surface-muted)] text-[var(--ink-muted)]";
}

export function ActivityCard({ activity, isLoggedIn, currentUserId, daysUntil }: ActivityCardProps) {
  const isOwnActivity = !!currentUserId && currentUserId === activity.hostUserId;
  const appearance = getCategoryAppearance(activity.category);
  const urgencyStyles = getUrgencyStyles(daysUntil);

  return (
    <article className={`grid gap-4 rounded-2xl border p-5 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-strong)] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center ${urgencyStyles}`}>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: appearance.color }}
      >
        <SportGlyph category={activity.category} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--ink-muted)]">
          <Avatar
            src={activity.hostAvatarUrl}
            initials={activity.hostInitials}
            color={activity.hostColor}
            size={24}
          />
          <span className="font-medium text-[var(--ink)]">{activity.host}</span>
          <span aria-hidden="true" className="text-[var(--ink-subtle)]">·</span>
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
          {daysUntil !== undefined && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ${getCountdownBadgeStyles(daysUntil)}`}>
              <ClockIcon />
              {getCountdownLabel(daysUntil)}
            </span>
          )}
        </div>

        <div className="mt-4">
          <ParticipantStack
            current={activity.participantsCurrent}
            max={activity.participantsMax}
          />
        </div>
      </div>

      <div className="lg:justify-self-end">
        {isOwnActivity ? (
          <span className="inline-flex h-11 items-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 text-sm font-medium text-[var(--ink-muted)]">
            Din aktivitet
          </span>
        ) : (
          <JoinButton
            activityId={activity.id}
            isJoined={activity.isJoined}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </article>
  );
}

interface MetaItemProps {
  children: ReactNode;
  icon: ReactNode;
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

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
