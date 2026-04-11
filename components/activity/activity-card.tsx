"use client";

import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users2,
} from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/lib/supabase/types";
import {
  ActivityCategoryIcon,
  getActivityCategoryAppearance,
  withAlpha,
} from "./category-tag";
import { HostProfileTrigger } from "./host-profile-trigger";
import { JoinButton } from "./join-button";
import { EditActivityButton } from "./edit-activity-button";
import { ParticipantStack } from "./participant-stack";
import { getShortLocationLabel } from "@/lib/location-label";

type ActivityCardVariant = "compact" | "detailed";

interface ActivityCardProps {
  activity: Activity;
  isLoggedIn: boolean;
  currentUserId?: string | null;
  daysUntil?: number;
  onOpenDetails?: () => void;
  variant?: ActivityCardVariant;
}

function isNestedInteractiveTarget(
  target: EventTarget | null,
  currentTarget: HTMLElement
): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const interactiveAncestor = target.closest(
    "button, a, input, select, textarea, [role='button']"
  );

  return (
    !!interactiveAncestor &&
    interactiveAncestor !== currentTarget &&
    currentTarget.contains(interactiveAncestor)
  );
}

function getUrgencyStyles(days: number | undefined): string {
  if (days === undefined) return "border-[var(--border)] bg-[var(--surface)]";
  if (days === 0) return "border-[var(--sage-500)] bg-[linear-gradient(135deg,rgba(122,160,96,0.22),var(--surface))]";
  if (days === 1) return "border-[rgba(122,160,96,0.65)] bg-[rgba(122,160,96,0.14)]";
  if (days <= 3) return "border-[rgba(122,160,96,0.4)] bg-[rgba(122,160,96,0.08)]";
  if (days <= 6) return "border-[rgba(122,160,96,0.22)] bg-[rgba(122,160,96,0.05)]";
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

function stopActionPropagation(
  event:
    | KeyboardEvent<HTMLDivElement>
    | MouseEvent<HTMLDivElement>
    | PointerEvent<HTMLDivElement>
) {
  event.stopPropagation();
}

function formatPriceLabel(price: number | null): string {
  if (price == null) {
    return "FREE";
  }

  return `${new Intl.NumberFormat("nb-NO").format(price)} kr`;
}

export function ActivityCard({
  activity,
  isLoggedIn,
  currentUserId,
  daysUntil,
  onOpenDetails,
  variant = "detailed",
}: ActivityCardProps) {
  const isOwnActivity = !!currentUserId && currentUserId === activity.hostUserId;
  const canOpenChat = isOwnActivity || activity.isJoined;
  const canOpenDetails = typeof onOpenDetails === "function";
  const appearance = getActivityCategoryAppearance(activity.category);
  const urgencyStyles = getUrgencyStyles(daysUntil);
  const accentSurface = withAlpha(appearance.color, 0.12);
  const accentBorder = withAlpha(appearance.color, 0.24);
  const accentInk = withAlpha(appearance.color, 0.88);
  const dateTimeLabel = isLoggedIn
    ? `${activity.date} · ${activity.time}`
    : "Tidspunkt vises ved innlogging";
  const locationLabel = isLoggedIn
    ? getShortLocationLabel(activity.location)
    : "Sted vises ved innlogging";
  const priceLabel = formatPriceLabel(activity.price);

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (!canOpenDetails) {
      return;
    }

    if (isNestedInteractiveTarget(event.target, event.currentTarget)) {
      return;
    }

    onOpenDetails?.();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!canOpenDetails) {
      return;
    }

    if (
      event.target !== event.currentTarget ||
      isNestedInteractiveTarget(event.target, event.currentTarget)
    ) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetails?.();
    }
  }

  const interactiveCardProps = canOpenDetails
    ? {
        "aria-haspopup": "dialog" as const,
        "aria-label": `Se detaljer for ${activity.title}`,
        onClick: handleCardClick,
        onKeyDown: handleCardKeyDown,
        role: "button" as const,
        tabIndex: 0,
      }
    : {};
  const interactiveCardClasses = canOpenDetails
    ? "activity-card--interactive cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
    : "";
  const chatLink = canOpenChat ? (
    <Link
      href={`/meldinger?activityId=${activity.id}`}
      className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[rgba(122,160,96,0.12)] px-5 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[rgba(122,160,96,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
    >
      chat
    </Link>
  ) : null;

  const action = isOwnActivity ? (
    <div className="flex items-start gap-2">
      <EditActivityButton activity={activity} />
      <div className="grid min-w-0 gap-2">
        <span className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 text-sm font-medium text-[var(--ink-muted)]">
          Ditt arrangement
        </span>
        {chatLink}
      </div>
    </div>
  ) : (
    <div className="inline-grid gap-2">
      <JoinButton
        activityId={activity.id}
        isJoined={activity.isJoined}
        isLoggedIn={isLoggedIn}
      />
      {chatLink}
    </div>
  );

  if (variant === "compact") {
    return (
      <article
        {...interactiveCardProps}
        className={`rounded-[24px] border px-4 py-4 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-strong)] ${interactiveCardClasses} ${urgencyStyles}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <ActivityIdentityTile
              category={activity.category}
              accentSurface={accentSurface}
              accentBorder={accentBorder}
              accentInk={accentInk}
              size="compact"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: accentInk }}
                    >
                      {appearance.label}
                    </p>
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-[var(--ink-subtle)]"
                    />
                    <HostInline
                      avatarUrl={activity.hostAvatarUrl}
                      host={activity.host}
                      initials={activity.hostInitials}
                      color={activity.hostColor}
                      hostBio={activity.hostBio}
                      interests={activity.hostFavoriteCategories}
                      hostUserId={activity.hostUserId}
                      compact
                    />
                    {daysUntil !== undefined ? (
                      <CountdownBadge daysUntil={daysUntil} compact />
                    ) : null}
                  </div>
                  <h3 className="card-title mt-2 text-[1.28rem] text-[var(--ink)]">
                    {activity.title}
                  </h3>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <MetaItem compact icon={<CalendarDays className="h-3.5 w-3.5" />}>
                  {dateTimeLabel}
                </MetaItem>
                <MetaItem compact icon={<MapPin className="h-3.5 w-3.5" />}>
                  {locationLabel}
                </MetaItem>
                <MetaItem compact icon={<PriceIcon compact />}>
                  {priceLabel}
                </MetaItem>
                <MetaItem compact icon={<Users2 className="h-3.5 w-3.5" />}>
                  {activity.participantsCurrent}/{activity.participantsMax}
                </MetaItem>
              </div>
            </div>
          </div>

          <div
            className="sm:flex-shrink-0"
            onClick={stopActionPropagation}
            onKeyDown={stopActionPropagation}
            onMouseDown={stopActionPropagation}
            onPointerDown={stopActionPropagation}
          >
            {action}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      {...interactiveCardProps}
      className={`rounded-[28px] border p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-strong)] ${interactiveCardClasses} ${urgencyStyles}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <ActivityIdentityTile
              category={activity.category}
              accentSurface={accentSurface}
              accentBorder={accentBorder}
              accentInk={accentInk}
              size="detailed"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.18em]"
                      style={{ color: accentInk }}
                    >
                      {appearance.label}
                    </p>
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-[var(--ink-subtle)]"
                    />
                    <HostInline
                      avatarUrl={activity.hostAvatarUrl}
                      host={activity.host}
                      initials={activity.hostInitials}
                      color={activity.hostColor}
                      hostBio={activity.hostBio}
                      interests={activity.hostFavoriteCategories}
                      hostUserId={activity.hostUserId}
                    />
                  </div>
                  <h3 className="card-title mt-3 text-[1.9rem] text-[var(--ink)]">
                    {activity.title}
                  </h3>
                </div>
              </div>

              <p className="card-copy mt-3 text-[15px]">
                {activity.description}
              </p>
            </div>
          </div>

          <div className="mt-5 ml-20 flex flex-wrap items-center gap-3">
            <MetaItem icon={<CalendarDays className="h-4 w-4" />}>
              {dateTimeLabel}
            </MetaItem>
            <MetaItem icon={<MapPin className="h-4 w-4" />}>{locationLabel}</MetaItem>
            <MetaItem icon={<PriceIcon />}>{priceLabel}</MetaItem>
            {daysUntil !== undefined ? <CountdownBadge daysUntil={daysUntil} /> : null}
          </div>

          <div className="mt-5 ml-20">
            <ParticipantStack
              current={activity.participantsCurrent}
              max={activity.participantsMax}
              participants={activity.participantAvatars}
            />
          </div>
        </div>

        <div
          className="lg:flex-shrink-0 lg:pl-6 lg:pt-1"
          onClick={stopActionPropagation}
          onKeyDown={stopActionPropagation}
          onMouseDown={stopActionPropagation}
          onPointerDown={stopActionPropagation}
        >
          {action}
        </div>
      </div>
    </article>
  );
}

interface ActivityIdentityTileProps {
  category: Activity["category"];
  accentSurface: string;
  accentBorder: string;
  accentInk: string;
  size: ActivityCardVariant;
}

function ActivityIdentityTile({
  category,
  accentSurface,
  accentBorder,
  accentInk,
  size,
}: ActivityIdentityTileProps) {
  const classes =
    size === "compact"
      ? "h-12 w-12 rounded-[18px]"
      : "h-16 w-16 rounded-[22px]";

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center border ${classes}`}
      style={{
        backgroundColor: accentSurface,
        borderColor: accentBorder,
        color: accentInk,
      }}
    >
      <ActivityCategoryIcon
        category={category}
        size={size === "compact" ? 18 : 24}
        strokeWidth={size === "compact" ? 2 : 1.9}
      />
    </div>
  );
}

interface CountdownBadgeProps {
  daysUntil: number;
  compact?: boolean;
}

function CountdownBadge({ daysUntil, compact = false }: CountdownBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${compact ? "px-2.5 py-1 text-xs" : "px-3 py-2 text-sm"} ${getCountdownBadgeStyles(daysUntil)}`}
    >
      <Clock3 className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {getCountdownLabel(daysUntil)}
    </span>
  );
}

interface PriceIconProps {
  compact?: boolean;
}

function PriceIcon({ compact = false }: PriceIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={compact ? "h-3.5 w-3.5 fill-none stroke-current" : "h-4 w-4 fill-none stroke-current"}
      strokeWidth="1.8"
    >
      <path d="M4 8h16" />
      <path d="M6 8v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M12 11v4" />
    </svg>
  );
}

interface HostInlineProps {
  avatarUrl: string | null;
  host: string;
  initials: string;
  color: string;
  hostBio: string | null;
  hostUserId: string;
  interests: Activity["hostFavoriteCategories"];
  compact?: boolean;
}

function HostInline({
  avatarUrl,
  host,
  initials,
  color,
  hostBio,
  hostUserId,
  interests,
  compact = false,
}: HostInlineProps) {
  return (
    <HostProfileTrigger
      avatarUrl={avatarUrl}
      host={host}
      initials={initials}
      color={color}
      hostBio={hostBio}
      hostUserId={hostUserId}
      interests={interests}
      compact={compact}
    />
  );
}

interface MetaItemProps {
  children: ReactNode;
  icon: ReactNode;
  compact?: boolean;
}

function MetaItem({ children, icon, compact = false }: MetaItemProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] ${compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"}`}
    >
      {icon}
      {children}
    </span>
  );
}
