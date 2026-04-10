"use client";

import { useTransition } from "react";
import { joinActivity, leaveActivity } from "@/lib/actions/activity";

interface JoinButtonProps {
  activityId: string;
  isJoined: boolean;
  isLoggedIn: boolean;
}

export function JoinButton({ activityId, isJoined, isLoggedIn }: JoinButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    startTransition(async () => {
      if (isJoined) {
        await leaveActivity(activityId);
      } else {
        await joinActivity(activityId);
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={isJoined}
      onClick={handleClick}
      className={`inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 disabled:opacity-60 ${
        isJoined
          ? "border-[var(--sage-500)] bg-[var(--sage-50)] text-[var(--sage-700)]"
          : "border-[var(--sage-500)] bg-[var(--sage-500)] text-white shadow-[0_8px_18px_-10px_rgba(95,135,71,0.6)] hover:-translate-y-0.5 hover:bg-[var(--sage-600)] hover:shadow-[0_12px_20px_-10px_rgba(95,135,71,0.65)] active:bg-[var(--sage-700)]"
      }`}
    >
      {isPending ? "…" : isJoined ? "Påmeldt ✓" : "Bli med"}
    </button>
  );
}
