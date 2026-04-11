import type { ActivityInterestCategory } from "../../lib/supabase/types";

type CategoryAppearance = {
  label: string;
  color: string;
};

const defaultAppearance: CategoryAppearance = {
  label: "Aktivitet",
  color: "#7AA060",
};

const categoryAppearance = {
  fotball: { label: "Fotball", color: "#5FA8D3" },
  løping: { label: "Løping", color: "#F08A6E" },
  yoga: { label: "Yoga", color: "#F1B24A" },
  klatring: { label: "Klatring", color: "#8E6BB1" },
  padel: { label: "Padel", color: "#4F8A79" },
  sykling: { label: "Sykling", color: "#7AA060" },
} satisfies Partial<Record<ActivityInterestCategory, CategoryAppearance>>;

interface CategoryTagProps {
  category: ActivityInterestCategory;
}

export function getCategoryAppearance(category: ActivityInterestCategory | string | null | undefined) {
  if (!category || typeof category !== "string") return defaultAppearance;
  const appearance = (categoryAppearance as Record<string, CategoryAppearance | undefined>)[category];
  return appearance ?? defaultAppearance;
}

export function CategoryTag({ category }: CategoryTagProps) {
  const appearance = getCategoryAppearance(category);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: appearance.color }}
      />
      {appearance.label}
    </span>
  );
}

interface SportGlyphProps {
  category: ActivityInterestCategory;
}

export function SportGlyph({ category }: SportGlyphProps) {
  switch (category) {
    case "fotball":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="12" cy="12" r="7" />
          <path d="M12 8.5l2.8 2-1.1 3.4h-3.4L9.2 10.5 12 8.5Z" />
        </svg>
      );
    case "løping":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="15" cy="5" r="2" />
          <path d="M13 8l-2 4 3 2 2 5" />
          <path d="M11 12H7l-2 4" />
          <path d="M13 9l4 2 2-1" />
        </svg>
      );
    case "yoga":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="12" cy="6" r="2" />
          <path d="M12 8v4" />
          <path d="M8 12c1 2 3 3 4 3s3-1 4-3" />
          <path d="M7 19c1.6-2 3.3-3 5-3s3.4 1 5 3" />
        </svg>
      );
    case "klatring":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M9 4c3 3 4 6 4 9s-1 5-4 7" />
          <path d="M14 6c2 2 3 4 3 7s-1 4-3 5" />
          <circle cx="8" cy="6" r="1.4" />
          <circle cx="16" cy="10" r="1.4" />
          <circle cx="11" cy="16" r="1.4" />
        </svg>
      );
    case "padel":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M9 4h5a3 3 0 0 1 3 3v4a5 5 0 0 1-5 5H9V4Z" />
          <path d="M10 16v4" />
          <circle cx="12.5" cy="8" r="0.5" fill="currentColor" />
          <circle cx="12.5" cy="11" r="0.5" fill="currentColor" />
        </svg>
      );
    case "sykling":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="6" cy="17" r="3" />
          <circle cx="18" cy="17" r="3" />
          <path d="M8 17l3-6h3l2 6" />
          <path d="M10 7h3l1 2" />
        </svg>
      );
  }
}
