"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/account/avatar";
import { InterestCategoryTag } from "@/components/activity/category-tag";
import type { ActivityInterestCategory } from "@/lib/supabase/types";

interface HostProfileTriggerProps {
  avatarUrl: string | null;
  color: string;
  compact?: boolean;
  host: string;
  hostBio: string | null;
  hostUserId: string;
  initials: string;
  interests: ActivityInterestCategory[];
}

export function HostProfileTrigger({
  avatarUrl,
  color,
  compact = false,
  host,
  hostBio,
  hostUserId,
  initials,
  interests,
}: HostProfileTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const portalTarget = typeof document !== "undefined" ? document.body : null;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function isInsideDialog(target: EventTarget | null) {
      return target instanceof Node && dialogRef.current?.contains(target);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (
        !isInsideDialog(event.target) &&
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
        ].includes(event.key)
      ) {
        event.preventDefault();
      }
    }

    function preventBackgroundWheel(event: WheelEvent) {
      if (!isInsideDialog(event.target)) {
        event.preventDefault();
      }
    }

    function preventBackgroundTouch(event: TouchEvent) {
      if (!isInsideDialog(event.target)) {
        event.preventDefault();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", preventBackgroundWheel, {
      passive: false,
    });
    window.addEventListener("touchmove", preventBackgroundTouch, {
      passive: false,
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", preventBackgroundWheel);
      window.removeEventListener("touchmove", preventBackgroundTouch);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full bg-[var(--sage-50)] font-medium text-[var(--sage-700)] transition hover:bg-[var(--surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${compact ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm"}`}
      >
        <Avatar
          src={avatarUrl}
          initials={initials}
          color={color}
          size={compact ? 18 : 20}
          className="ring-2 ring-[var(--surface)]"
        />
        <span>
          Arrangør <span className="font-semibold">{host}</span>
        </span>
      </button>

      {isOpen && portalTarget
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`Profilen til ${host}`}
            >
              <button
                type="button"
                aria-label="Lukk profilvindu"
                className="absolute inset-0"
                onClick={() => setIsOpen(false)}
              />

              <div
                ref={dialogRef}
                className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--modal-shadow)]"
              >
                <div className="px-6 py-6" style={{ background: "var(--dialog-header-bg)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={avatarUrl}
                        initials={initials}
                        color={color}
                        size={72}
                        className="rounded-[24px] ring-4 ring-[var(--surface)]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                          Arrangørprofil
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                          {host}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-[var(--ink-muted)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                      style={{
                        backgroundColor: "var(--dialog-close-bg)",
                        borderColor: "var(--dialog-close-border)",
                      }}
                      aria-label="Lukk"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 px-6 py-6">
                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                      Bio
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">
                      {hostBio?.trim().length
                        ? hostBio
                        : "Ingen bio er lagt til ennå."}
                    </p>
                  </section>

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                      Interesser
                    </p>
                    {interests.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <InterestCategoryTag key={interest} category={interest} />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">
                        Ingen interesser er lagt til ennå.
                      </p>
                    )}
                  </section>

                  <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--ink-subtle)] opacity-60"
                    >
                      Send message
                    </button>

                    <Link
                      href={`/profil/${hostUserId}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--sage-500)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                    >
                      See more
                    </Link>
                  </div>
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
    </>
  );
}
