"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  MessageCircle,
  Users2,
  X,
} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import type { Activity } from "@/lib/supabase/types";
import { getActivityCategoryAppearance } from "./category-tag";
import { ActivityDetailMap } from "./activity-detail-map";
import { EditActivityButton } from "./edit-activity-button";
import { HostProfileTrigger } from "./host-profile-trigger";
import { JoinButton } from "./join-button";
import { ParticipantStack } from "./participant-stack";

interface ActivityDetailDialogProps {
  activity: Activity;
  currentUserId?: string | null;
  isLoggedIn: boolean;
  onClose: () => void;
}

function MetaRow({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1.15rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-muted)]">
      <span className="mt-0.5 text-[var(--sage-700)]">{icon}</span>
      <span className="leading-6">{label}</span>
    </div>
  );
}

export function ActivityDetailDialog({
  activity,
  currentUserId,
  isLoggedIn,
  onClose,
}: ActivityDetailDialogProps) {
  const portalTarget = typeof document !== "undefined" ? document.body : null;
  const isOwnActivity = !!currentUserId && currentUserId === activity.hostUserId;
  const canOpenChat = isOwnActivity || activity.isJoined;
  const appearance = getActivityCategoryAppearance(activity.category);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Detaljer for ${activity.title}`}
    >
      <button
        type="button"
        aria-label="Lukk arrangementsdetaljer"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(15,27,18,0.52)] backdrop-blur-[3px]"
      />

      <div className="relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_32px_96px_-32px_rgba(15,27,18,0.55)] sm:max-h-[calc(100vh-3rem)] sm:rounded-[2rem]">
        <div className="border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(122,160,96,0.18),rgba(237,244,225,0.9)_50%,rgba(255,255,255,0.98))] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: `${appearance.color}1F`,
                    color: appearance.color,
                  }}
                >
                  {appearance.label}
                </span>
                <HostProfileTrigger
                  avatarUrl={activity.hostAvatarUrl}
                  host={activity.host}
                  initials={activity.hostInitials}
                  color={activity.hostColor}
                  hostBio={activity.hostBio}
                  hostUserId={activity.hostUserId}
                  interests={activity.hostFavoriteCategories}
                  compact
                />
              </div>

              <h3 className="card-title mt-4 text-[2rem] text-[var(--ink)] sm:text-[2.45rem]">
                {activity.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[var(--ink-muted)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
              aria-label="Lukk"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 lg:flex">
              <div className="flex h-full w-full flex-col rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                  Om arrangementet
                </p>
                <p className="card-copy mt-3 text-[15px] text-[var(--ink-soft)]">
                  {activity.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-auto">
                  <MetaRow
                    icon={<CalendarDays className="h-4 w-4" />}
                    label={activity.date}
                  />
                  <MetaRow
                    icon={<Clock3 className="h-4 w-4" />}
                    label={`Kl. ${activity.time}`}
                  />
                  <MetaRow
                    icon={<MapPin className="h-4 w-4" />}
                    label={activity.location}
                  />
                  <MetaRow
                    icon={<Users2 className="h-4 w-4" />}
                    label={`${activity.participantsCurrent} påmeldte av ${activity.participantsMax} plasser`}
                  />
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                  Deltakere
                </p>
                <div className="mt-4">
                  <ParticipantStack
                    current={activity.participantsCurrent}
                    max={activity.participantsMax}
                    participants={activity.participantAvatars}
                  />
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                  Handlinger
                </p>
                <div className="mt-4 grid gap-2">
                  {isOwnActivity ? (
                    <span className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--ink-muted)]">
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
                      onClick={onClose}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[rgba(122,160,96,0.12)] px-5 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[rgba(122,160,96,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
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
            </aside>
          </div>

          <section className="mt-6">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                Kart
              </p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Zoomet inn på den nøyaktige plasseringen til arrangementet.
              </p>
            </div>
            <ActivityDetailMap activity={activity} />
          </section>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
