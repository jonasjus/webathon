"use client";

import { useState } from "react";
import { deleteAccount } from "../instillinger/actions";

export function DeleteAccountForm() {
  const [confirmation, setConfirmation] = useState("");
  const isInvalid =
    confirmation.length > 0 && confirmation.trim().toUpperCase() !== "SLETT";

  return (
    <form action={deleteAccount} className="mt-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmation"
          className="text-sm font-semibold text-[var(--ink-muted)]"
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
          className={`rounded-xl border bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:ring-2 focus:ring-offset-2 ${
            isInvalid
              ? "border-red-300 focus:border-red-400 focus:ring-red-300"
              : "border-[var(--border)] focus:border-[var(--sage-500)] focus:ring-[var(--sage-600)]"
          }`}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
        >
          Slett konto
        </button>
      </div>
    </form>
  );
}
