"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { Activity } from "@/lib/supabase/types";
import { EditActivityForm } from "./edit-activity-form";

interface EditActivityButtonProps {
  activity: Activity;
  variant?: "icon" | "full";
}

export function EditActivityButton({ activity, variant = "icon" }: EditActivityButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const portal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <EditActivityForm activity={activity} onClose={() => setIsOpen(false)} />,
          document.body
        )
      : null;

  if (variant === "full") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--border)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
        >
          <Pencil className="h-3.5 w-3.5" />
          Rediger arrangement
        </button>
        {portal}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Rediger arrangement"
        className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink-muted)] transition hover:bg-[var(--border)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
      >
        <Pencil className="h-4 w-4" />
      </button>
      {portal}
    </>
  );
}
