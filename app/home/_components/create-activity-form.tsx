"use client";

import type { FormEvent } from "react";
import { useTransition, useRef, useEffect, useState, useId } from "react";
import { createActivity } from "@/lib/actions/activity";
import type { ActivityCategory } from "@/lib/supabase/types";

interface CreateActivityFormProps {
  onClose: () => void;
}

type CategoryOption = {
  value: ActivityCategory;
  label: string;
  group: string;
};

const categoryOptions: CategoryOption[] = [
  // Sport & Trening
  { value: "fotball",       label: "Fotball",       group: "Sport & Trening" },
  { value: "basketball",    label: "Basketball",    group: "Sport & Trening" },
  { value: "volleyball",    label: "Volleyball",    group: "Sport & Trening" },
  { value: "tennis",        label: "Tennis",        group: "Sport & Trening" },
  { value: "bordtennis",    label: "Bordtennis",    group: "Sport & Trening" },
  { value: "badminton",     label: "Badminton",     group: "Sport & Trening" },
  { value: "padel",         label: "Padel",         group: "Sport & Trening" },
  { value: "squash",        label: "Squash",        group: "Sport & Trening" },
  { value: "hockey",        label: "Hockey",        group: "Sport & Trening" },
  { value: "golf",          label: "Golf",          group: "Sport & Trening" },
  { value: "minigolf",      label: "Minigolf",      group: "Sport & Trening" },
  { value: "løping",        label: "Løping",        group: "Sport & Trening" },
  { value: "sykling",       label: "Sykling",       group: "Sport & Trening" },
  { value: "svømming",      label: "Svømming",      group: "Sport & Trening" },
  { value: "ski",           label: "Ski",           group: "Sport & Trening" },
  { value: "snowboard",     label: "Snowboard",     group: "Sport & Trening" },
  { value: "klatring",      label: "Klatring",      group: "Sport & Trening" },
  { value: "yoga",          label: "Yoga",          group: "Sport & Trening" },
  { value: "crossfit",      label: "CrossFit",      group: "Sport & Trening" },
  { value: "styrketrening", label: "Styrketrening", group: "Sport & Trening" },
  { value: "dans",          label: "Dans",          group: "Sport & Trening" },
  { value: "kampsport",     label: "Kampsport",     group: "Sport & Trening" },
  { value: "friluftsliv",   label: "Friluftsliv",   group: "Sport & Trening" },
  // Sosialt & Underholdning
  { value: "bar",           label: "Bar",           group: "Sosialt & Underholdning" },
  { value: "kaffe",         label: "Kaffe",         group: "Sosialt & Underholdning" },
  { value: "middag",        label: "Middag",        group: "Sosialt & Underholdning" },
  { value: "grillfest",     label: "Grillfest",     group: "Sosialt & Underholdning" },
  { value: "matlaging",     label: "Matlaging",     group: "Sosialt & Underholdning" },
  { value: "piknik",        label: "Piknik",        group: "Sosialt & Underholdning" },
  { value: "vandring",      label: "Vandring",      group: "Sosialt & Underholdning" },
  { value: "tur",           label: "Tur",           group: "Sosialt & Underholdning" },
  { value: "brettspill",    label: "Brettspill",    group: "Sosialt & Underholdning" },
  { value: "sjakk",         label: "Sjakk",         group: "Sosialt & Underholdning" },
  { value: "gaming",        label: "Gaming",        group: "Sosialt & Underholdning" },
  { value: "quiz",          label: "Quiz",          group: "Sosialt & Underholdning" },
  { value: "boklubb",       label: "Boklubb",       group: "Sosialt & Underholdning" },
  { value: "kino",          label: "Kino",          group: "Sosialt & Underholdning" },
  { value: "museum",        label: "Museum",        group: "Sosialt & Underholdning" },
  { value: "teater",        label: "Teater",        group: "Sosialt & Underholdning" },
  { value: "konsert",       label: "Konsert",       group: "Sosialt & Underholdning" },
  { value: "festival",      label: "Festival",      group: "Sosialt & Underholdning" },
  { value: "karaoke",       label: "Karaoke",       group: "Sosialt & Underholdning" },
  { value: "escape-room",   label: "Escape Room",   group: "Sosialt & Underholdning" },
  { value: "spa",           label: "Spa",           group: "Sosialt & Underholdning" },
  // Annet
  { value: "annet",         label: "Annet",         group: "Annet" },
];

function CategorySearch({
  value,
  onChange,
  inputClass,
}: {
  value: ActivityCategory | "";
  onChange: (v: ActivityCategory) => void;
  inputClass: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    value ? (categoryOptions.find((o) => o.value === value)?.label ?? value) : "";

  const filtered = query.trim()
    ? categoryOptions.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : categoryOptions;

  // Group results
  const grouped: Record<string, CategoryOption[]> = {};
  for (const opt of filtered) {
    (grouped[opt.group] ??= []).push(opt);
  }

  function handleSelect(opt: CategoryOption) {
    onChange(opt.value);
    setQuery("");
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        autoComplete="off"
        placeholder={value ? selectedLabel : "Søk etter kategori…"}
        value={open ? query : selectedLabel}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className={inputClass}
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listId}
      />

      {/* Hidden real input for form submission */}
      <input type="hidden" name="category" value={value} required />

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg"
          style={{ maxHeight: "240px" }}
        >
          {Object.keys(grouped).length === 0 ? (
            <button
              type="button"
              className="w-full px-4 py-3 text-left text-sm text-[var(--ink-muted)]"
              onClick={() => handleSelect({ value: "annet", label: "Annet", group: "Annet" })}
            >
              Ingen treff — velg &ldquo;Annet&rdquo;
            </button>
          ) : (
            Object.entries(grouped).map(([group, opts]) => (
              <div key={group}>
                <div className="sticky top-0 bg-[var(--surface-muted)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-subtle)]">
                  {group}
                </div>
                {opts.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    onClick={() => handleSelect(opt)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-[var(--surface-muted)] ${
                      opt.value === value
                        ? "font-semibold text-[var(--sage-700)]"
                        : "text-[var(--ink)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function CreateActivityForm({ onClose }: CreateActivityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<ActivityCategory | "">("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!category) return;
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      await createActivity({
        title: fd.get("title") as string,
        location: fd.get("location") as string,
        startsAt: fd.get("starts_at") as string,
        description: fd.get("description") as string,
        participantsMax: Number(fd.get("participants_max")),
        category: category as ActivityCategory,
        mapPinX: 50,
        mapPinY: 50,
      });
      onClose();
    });
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
            Ny aktivitet
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-subtle)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
            aria-label="Lukk"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

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
            <CategorySearch
              value={category}
              onChange={setCategory}
              inputClass={inputClass}
            />
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
              disabled={isPending || !category}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--sage-500)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] disabled:opacity-60"
            >
              {isPending ? "Lagrer…" : "Opprett aktivitet"}
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
