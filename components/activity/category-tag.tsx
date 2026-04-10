import type { ActivityCategory } from "@/lib/supabase/types";

type CategoryMeta = {
  label: string;
  color: string;
};

const categoryMeta: Record<ActivityCategory, CategoryMeta> = {
  // Sport & Trening
  fotball:      { label: "Fotball",       color: "#5FA8D3" },
  løping:       { label: "Løping",        color: "#F08A6E" },
  yoga:         { label: "Yoga",          color: "#F1B24A" },
  klatring:     { label: "Klatring",      color: "#8E6BB1" },
  padel:        { label: "Padel",         color: "#4F8A79" },
  sykling:      { label: "Sykling",       color: "#7AA060" },
  basketball:   { label: "Basketball",    color: "#E07B39" },
  tennis:       { label: "Tennis",        color: "#C8D45A" },
  volleyball:   { label: "Volleyball",    color: "#E8A838" },
  svømming:     { label: "Svømming",      color: "#4AA8C8" },
  ski:          { label: "Ski",           color: "#A8C8E8" },
  snowboard:    { label: "Snowboard",     color: "#7898C8" },
  golf:         { label: "Golf",          color: "#68A868" },
  bordtennis:   { label: "Bordtennis",    color: "#D85858" },
  badminton:    { label: "Badminton",     color: "#C868A8" },
  crossfit:     { label: "CrossFit",      color: "#E05848" },
  styrketrening:{ label: "Styrketrening", color: "#8868A8" },
  dans:         { label: "Dans",          color: "#E888B8" },
  kampsport:    { label: "Kampsport",     color: "#A86848" },
  friluftsliv:  { label: "Friluftsliv",   color: "#58A870" },
  hockey:       { label: "Hockey",        color: "#5888C8" },
  squash:       { label: "Squash",        color: "#78C878" },
  // Sosialt & Underholdning
  bar:          { label: "Bar",           color: "#C8586A" },
  minigolf:     { label: "Minigolf",      color: "#68B868" },
  kino:         { label: "Kino",          color: "#7868A8" },
  konsert:      { label: "Konsert",       color: "#D868A8" },
  brettspill:   { label: "Brettspill",    color: "#E8A848" },
  middag:       { label: "Middag",        color: "#E87848" },
  grillfest:    { label: "Grillfest",     color: "#E86848" },
  piknik:       { label: "Piknik",        color: "#88C858" },
  quiz:         { label: "Quiz",          color: "#5898D8" },
  kaffe:        { label: "Kaffe",         color: "#A87848" },
  gaming:       { label: "Gaming",        color: "#6858D8" },
  matlaging:    { label: "Matlaging",     color: "#D87858" },
  boklubb:      { label: "Boklubb",       color: "#88A8C8" },
  museum:       { label: "Museum",        color: "#A8A868" },
  teater:       { label: "Teater",        color: "#C878A8" },
  festival:     { label: "Festival",      color: "#E8A868" },
  karaoke:      { label: "Karaoke",       color: "#E858C8" },
  "escape-room":{ label: "Escape Room",   color: "#487888" },
  sjakk:        { label: "Sjakk",         color: "#787878" },
  spa:          { label: "Spa",           color: "#C8A8D8" },
  vandring:     { label: "Vandring",      color: "#78A858" },
  tur:          { label: "Tur",           color: "#68B888" },
  // Annet
  annet:        { label: "Annet",         color: "#A8A8A8" },
};

interface CategoryTagProps {
  category: ActivityCategory;
}

export function getCategoryAppearance(category: ActivityCategory) {
  return categoryMeta[category] ?? { label: category, color: "#A8A8A8" };
}

export function CategoryTag({ category }: CategoryTagProps) {
  const meta = getCategoryAppearance(category);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}

interface SportGlyphProps {
  category: ActivityCategory;
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
    case "bar":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M8 4h8l-2 7H10L8 4Z" />
          <path d="M11 11v9" />
          <path d="M9 20h6" />
        </svg>
      );
    case "minigolf":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="8" cy="19" r="2" />
          <path d="M8 17V8" />
          <path d="M8 8l8-3v6L8 8Z" />
        </svg>
      );
    case "gaming":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="12" rx="4" />
          <path d="M8 13v-2M7 12h2" />
          <circle cx="16" cy="12" r="0.8" fill="currentColor" />
          <circle cx="14" cy="14" r="0.8" fill="currentColor" />
        </svg>
      );
    case "middag":
    case "matlaging":
    case "grillfest":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M3 11h18" />
          <path d="M12 3v8" />
          <path d="M7 3c0 4 2 6 5 6s5-2 5-6" />
          <path d="M5 11v9M19 11v9" />
        </svg>
      );
    case "konsert":
    case "festival":
    case "karaoke":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 3" />
        </svg>
      );
  }
}
