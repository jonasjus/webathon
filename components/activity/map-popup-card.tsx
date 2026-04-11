"use client";

import { CalendarDays, MapPin, MessageCircle, Users2 } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/lib/supabase/types";
import { getShortLocationLabel } from "@/lib/location-label";
import { JoinButton } from "./join-button";
import { getActivityCategoryAppearance } from "./category-tag";

interface MapPopupCardProps {
  activity: Activity;
  isLoggedIn: boolean;
  currentUserId?: string | null;
}

export function MapPopupCard({
  activity,
  isLoggedIn,
  currentUserId,
}: MapPopupCardProps) {
  const isOwnActivity = !!currentUserId && currentUserId === activity.hostUserId;
  const canOpenChat = isOwnActivity || activity.isJoined;
  const appearance = getActivityCategoryAppearance(activity.category);
  const shortLocation = isLoggedIn
    ? getShortLocationLabel(activity.location)
    : "Sted vises ved innlogging";

  return (
    <div className="w-[18rem] max-w-[18rem] rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{
            backgroundColor: `${appearance.color}1F`,
            color: appearance.color,
          }}
        >
          {appearance.label}
        </span>
        <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-muted)]">
          {activity.participantsCurrent}/{activity.participantsMax}
        </span>
      </div>

      <h4 className="mt-3 text-base font-semibold leading-6 text-[var(--ink)]">
        {activity.title}
      </h4>

      <div className="mt-3 space-y-2 text-xs text-[var(--ink-muted)]">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>
            {activity.date} kl. {activity.time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>{shortLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users2 className="h-3.5 w-3.5" />
          <span>{activity.participantsCurrent} påmeldte nå</span>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--ink-soft)]">
        {activity.description}
      </p>

      <div className="mt-4 grid gap-2">
        {isOwnActivity ? (
          <span className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 text-sm font-medium text-[var(--ink-muted)]">
            Ditt arrangement
          </span>
        ) : (
          <JoinButton
            activityId={activity.id}
            isJoined={activity.isJoined}
            isLoggedIn={isLoggedIn}
          />
        )}

        {canOpenChat ? (
          <Link
            href={`/meldinger?activityId=${activity.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[rgba(122,160,96,0.12)] px-5 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[rgba(122,160,96,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" />
            Se chat
          </Link>
        ) : null}
      </div>
    </div>
  );
}
