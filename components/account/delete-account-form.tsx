"use client";

import { useState } from "react";
import { deleteAccount } from "@/lib/actions/account";

interface DeleteAccountFormProps {
  redirectPath?: string;
}

export function DeleteAccountForm({
  redirectPath = "/instillinger",
}: DeleteAccountFormProps) {
  const [confirmation, setConfirmation] = useState("");
  const isInvalid =
    confirmation.length > 0 && confirmation.trim().toUpperCase() !== "SLETT";
  const isReady = confirmation.trim().toUpperCase() === "SLETT";

  return (
    <form action={deleteAccount} className="flex flex-shrink-0 flex-col gap-2 sm:w-56">
      <input type="hidden" name="redirect_to" value={redirectPath} />
      <label
        htmlFor="confirmation"
        className="text-xs font-medium text-[var(--ink-muted)]"
      >
        Skriv SLETT for å bekrefte
      </label>
      <input
        id="confirmation"
        name="confirmation"
        type="text"
        required
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        aria-invalid={isInvalid}
        placeholder="SLETT"
        className={`rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:ring-2 focus:ring-offset-2 ${
          isInvalid
            ? "border-red-300 focus:border-red-400 focus:ring-red-300"
            : "border-[var(--border)] focus:border-[var(--sage-500)] focus:ring-[var(--sage-600)]"
        }`}
      />
      <button
        type="submit"
        disabled={!isReady}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Slett konto
      </button>
    </form>
  );
}
