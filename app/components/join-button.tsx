"use client";

import { useState } from "react";

export function JoinButton() {
  const [joined, setJoined] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={joined}
      onClick={() => setJoined((value) => !value)}
      className={`inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
        joined
          ? "border-[var(--sage-500)] bg-[var(--sage-50)] text-[var(--sage-700)]"
          : "border-[var(--sage-500)] bg-[var(--sage-500)] text-white shadow-[0_8px_18px_-10px_rgba(95,135,71,0.6)] hover:-translate-y-0.5 hover:bg-[var(--sage-600)] hover:shadow-[0_12px_20px_-10px_rgba(95,135,71,0.65)] active:bg-[var(--sage-700)]"
      }`}
    >
      {joined ? "Påmeldt ✓" : "Bli med"}
    </button>
  );
}
