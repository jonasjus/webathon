"use client";

import { useTransition, useRef } from "react";
import { createActivity } from "../lib/activity-actions";
import type { SportCategory } from "../lib/supabase/types";

interface CreateActivityFormProps {
  onClose: () => void;
}

const categories: { value: SportCategory; label: string }[] = [
  { value: "fotball", label: "Fotball" },
  { value: "løping", label: "Løping" },
  { value: "yoga", label: "Yoga" },
  { value: "klatring", label: "Klatring" },
  { value: "padel", label: "Padel" },
  { value: "sykling", label: "Sykling" },
];

export function CreateActivityForm({ onClose }: CreateActivityFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      await createActivity({
        title: fd.get("title") as string,
        location: fd.get("location") as string,
        startsAt: fd.get("starts_at") as string,
        description: fd.get("description") as string,
        participantsMax: Number(fd.get("participants_max")),
        category: fd.get("category") as SportCategory,
        mapPinX: 50,
        mapPinY: 50,
      });
      onClose();
    });
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2";

  return (
    <div className="my-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-6">
      <h3 className="mb-4 text-lg font-semibold text-[var(--ink)]">
        Ny aktivitet
      </h3>
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-[var(--ink)]">Tittel</label>
          <input
            name="title"
            required
            placeholder="Søndagsfotball på Frogner"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--ink)]">Sted</label>
          <input
            name="location"
            required
            placeholder="Frognerparken"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--ink)]">Tidspunkt</label>
          <input
            name="starts_at"
            type="datetime-local"
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--ink)]">Kategori</label>
          <select name="category" required className={inputClass}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--ink)]">Maks deltakere</label>
          <input
            name="participants_max"
            type="number"
            required
            min={1}
            max={200}
            placeholder="12"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-[var(--ink)]">Beskrivelse</label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Fortell litt om aktiviteten…"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--sage-500)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] disabled:opacity-60"
          >
            {isPending ? "Lagrer…" : "Opprett"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--surface)]"
          >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
}
