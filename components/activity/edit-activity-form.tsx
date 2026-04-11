"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { activityCategoryOptions } from "@/components/activity/category-tag";
import { LocationPicker } from "@/components/activity/location-picker";
import type { MapCoordinates } from "@/lib/map";
import { updateActivity } from "@/lib/actions/activity";
import type { Activity, ActivityCategory } from "@/lib/supabase/types";

interface EditActivityFormProps {
  activity: Activity;
  onClose: () => void;
}

export function EditActivityForm({ activity, onClose }: EditActivityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<ActivityCategory>(activity.category);
  const [location, setLocation] = useState(activity.location);
  const [coordinates, setCoordinates] = useState<MapCoordinates | null>(
    activity.coordinates
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);

    startTransition(async () => {
      try {
        await updateActivity({
          id: activity.id,
          title: formData.get("title") as string,
          location,
          startsAt: formData.get("starts_at") as string,
          description: formData.get("description") as string,
          participantsMax: Number(formData.get("participants_max")),
          category,
          latitude: coordinates?.lat ?? null,
          longitude: coordinates?.lng ?? null,
        });
        onClose();
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Kunne ikke oppdatere arrangementet."
        );
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Rediger ${activity.title}`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
            Rediger arrangement
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-subtle)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
            aria-label="Lukk"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[var(--ink)]">Tittel</label>
            <input
              name="title"
              required
              defaultValue={activity.title}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ink)]">Tidspunkt</label>
            <input
              name="starts_at"
              type="datetime-local"
              required
              defaultValue={activity.startsAt.slice(0, 16)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ink)]">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              required
              className={inputClass}
            >
              {activityCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ink)]">
              Maks deltakere
            </label>
            <input
              name="participants_max"
              type="number"
              required
              min={1}
              max={200}
              defaultValue={activity.participantsMax}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[var(--ink)]">
              Beskrivelse
            </label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={activity.description}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <LocationPicker
              value={location}
              onValueChange={setLocation}
              coordinates={coordinates}
              onCoordinatesChange={setCoordinates}
              disabled={isPending}
              inputClassName={inputClass}
            />
          </div>

          {submitError ? (
            <p className="sm:col-span-2 text-sm text-[#a64532]">{submitError}</p>
          ) : null}

          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--sage-500)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] disabled:opacity-60"
            >
              {isPending ? "Lagrer…" : "Lagre endringer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--surface-muted)]"
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
