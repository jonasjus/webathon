"use client";

import { CalendarDays, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/lib/supabase/types";
import { getShortLocationLabel } from "@/lib/location-label";
import { JoinButton } from "./join-button";
import { EditActivityButton } from "./edit-activity-button";
import {
  ActivityCategoryIcon,
  getActivityCategoryAppearance,
  withAlpha,
} from "./category-tag";
import { Avatar } from "@/components/account/avatar";

interface MapPopupCardProps {
  activity: Activity;
  currentUserId?: string | null;
}

export function MapPopupCard({
  activity,
  currentUserId,
}: MapPopupCardProps) {
  const isOwnActivity = !!currentUserId && currentUserId === activity.hostUserId;
  const canOpenChat = isOwnActivity || activity.isJoined;
  const appearance = getActivityCategoryAppearance(activity.category);
  const accentSurface = withAlpha(appearance.color, 0.12);
  const accentBorder = withAlpha(appearance.color, 0.28);
  const accentInk = withAlpha(appearance.color, 0.88);
  const shortLocation = getShortLocationLabel(activity.location);
  const dateTimeLabel = `${activity.date} · ${activity.time}`;

  return (
    <div className="w-[19rem] max-w-[19rem] max-h-[80vh] overflow-y-auto rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-card)]">
      {/* Header: icon + category label (left) · Arrangør + avatar + name (right) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px] border"
            style={{
              backgroundColor: accentSurface,
              borderColor: accentBorder,
              color: accentInk,
            }}
          >
            <ActivityCategoryIcon category={activity.category} size={19} strokeWidth={2} />
          </div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: accentInk }}
          >
            {appearance.label}
          </p>
        </div>

        {/* Arrangør: label + avatar + name */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <span className="text-[10px] font-medium text-[var(--ink-subtle)]">
            Arrangør
          </span>
          <Avatar
            src={activity.hostAvatarUrl}
            initials={activity.hostInitials}
            color={activity.hostColor}
            size={20}
            className="ring-2 ring-white/80"
          />
          <span className="max-w-[5.5rem] truncate text-[11px] font-medium text-[var(--ink-muted)]">
            {activity.host}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="card-title mt-3 text-[1.18rem] text-[var(--ink)]">
        {activity.title}
      </h4>

      {/* Meta pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5 text-[11px] text-[var(--ink-muted)]">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateTimeLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5 text-[11px] text-[var(--ink-muted)]">
          <MapPin className="h-3.5 w-3.5" />
          {shortLocation}
        </span>
      </div>

      {/* Description box */}
      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
          Om arrangementet
        </p>
        <p className="mt-1.5 line-clamp-3 text-[12px] leading-[1.65] text-[var(--ink-soft)]">
          {activity.description}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-3 grid gap-2">
        {isOwnActivity ? (
          <span className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 text-sm font-medium text-[var(--ink-muted)]">
            Ditt arrangement
          </span>
        ) : (
          <JoinButton
            activityId={activity.id}
            isJoined={activity.isJoined}
            isLoggedIn={true}
          />
        )}

        {canOpenChat ? (
          <Link
            href={`/meldinger?activityId=${activity.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[rgba(122,160,96,0.12)] px-5 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[rgba(122,160,96,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" />
            Se chat
          </Link>
        ) : null}

        {isOwnActivity ? (
          <EditActivityButton activity={activity} variant="full" />
        ) : null}
      </div>
    </div>
  );
}
