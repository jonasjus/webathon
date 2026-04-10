"use client";

import type { FormEvent } from "react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { categoryOptions } from "@/components/activity/category-tag";
import { createActivity } from "@/lib/actions/activity";
import type { ActivityCategory } from "@/lib/supabase/types";

interface CreateActivityFormProps {
  onClose: () => void;
}

type CategoryOption = (typeof categoryOptions)[number];

function CategorySearch({
  value,
  onChange,
  inputClass,
}: {
  value: ActivityCategory | "";
  onChange: (value: ActivityCategory) => void;
  inputClass: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    value ? (categoryOptions.find((option) => option.value === value)?.label ?? value) : "";

  const filtered = query.trim()
    ? categoryOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      )
    : categoryOptions;

  const grouped: Record<string, CategoryOption[]> = {};
  for (const option of filtered) {
    (grouped[option.group] ??= []).push(option);
  }

  function handleSelect(option: CategoryOption) {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
        role="combobox"
        autoComplete="off"
        placeholder={value ? selectedLabel : "Søk etter kategori…"}
        value={open ? query : selectedLabel}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        className={inputClass}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listId}
      />

      <input type="hidden" name="category" value={value} required />

      {open ? (
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
              onClick={() =>
                handleSelect({ value: "annet", label: "Annet", group: "Annet" })
              }
            >
              Ingen treff — velg &ldquo;Annet&rdquo;
            </button>
          ) : (
            Object.entries(grouped).map(([group, options]) => (
              <div key={group}>
                <div className="sticky top-0 bg-[var(--surface-muted)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-subtle)]">
                  {group}
                </div>
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-[var(--surface-muted)] ${
                      option.value === value
                        ? "font-semibold text-[var(--sage-700)]"
                        : "text-[var(--ink)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function CreateActivityForm({ onClose }: CreateActivityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<ActivityCategory | "">("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category) return;

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      await createActivity({
        title: formData.get("title") as string,
        location: formData.get("location") as string,
        startsAt: formData.get("starts_at") as string,
        description: formData.get("description") as string,
        participantsMax: Number(formData.get("participants_max")),
        category,
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] sm:p-8">
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
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
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
            <label className="text-sm font-medium text-[var(--ink)]">
              Maks deltakere
            </label>
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
            <label className="text-sm font-medium text-[var(--ink)]">
              Beskrivelse
            </label>
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
