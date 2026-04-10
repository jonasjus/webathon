import {
  BadgeHelp,
  Beer,
  Bike,
  BookOpen,
  ChessKnight,
  CircleDot,
  CircleEllipsis,
  Coffee,
  CookingPot,
  FerrisWheel,
  Film,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  Goal,
  KeyRound,
  Landmark,
  MapPinned,
  MicVocal,
  Mountain,
  MountainSnow,
  Music4,
  Puzzle,
  Sandwich,
  Sparkles,
  Snowflake,
  Swords,
  Table2,
  Target,
  TentTree,
  Trees,
  Trophy,
  type LucideIcon,
  UtensilsCrossed,
  VenetianMask,
  Volleyball,
  Waves,
} from "lucide-react";
import type { ActivityCategory } from "@/lib/supabase/types";

type CategoryGroup = "Sport & Trening" | "Sosialt & Underholdning" | "Annet";

type CategoryMeta = {
  label: string;
  color: string;
  group: CategoryGroup;
  icon: LucideIcon;
};

export type CategoryOption = {
  value: ActivityCategory;
  label: string;
  group: CategoryGroup;
};

const orderedCategories: readonly ActivityCategory[] = [
  "fotball",
  "basketball",
  "volleyball",
  "tennis",
  "bordtennis",
  "badminton",
  "padel",
  "squash",
  "hockey",
  "golf",
  "minigolf",
  "løping",
  "sykling",
  "svømming",
  "ski",
  "snowboard",
  "klatring",
  "yoga",
  "crossfit",
  "styrketrening",
  "dans",
  "kampsport",
  "friluftsliv",
  "bar",
  "kaffe",
  "middag",
  "grillfest",
  "matlaging",
  "piknik",
  "vandring",
  "tur",
  "brettspill",
  "sjakk",
  "gaming",
  "quiz",
  "boklubb",
  "kino",
  "museum",
  "teater",
  "konsert",
  "festival",
  "karaoke",
  "escape-room",
  "spa",
  "annet",
];

const categoryMeta = {
  fotball: { label: "Fotball", color: "#5FA8D3", group: "Sport & Trening", icon: Goal },
  løping: { label: "Løping", color: "#F08A6E", group: "Sport & Trening", icon: Footprints },
  yoga: { label: "Yoga", color: "#F1B24A", group: "Sport & Trening", icon: Flower2 },
  klatring: { label: "Klatring", color: "#8E6BB1", group: "Sport & Trening", icon: Mountain },
  padel: { label: "Padel", color: "#4F8A79", group: "Sport & Trening", icon: Target },
  sykling: { label: "Sykling", color: "#7AA060", group: "Sport & Trening", icon: Bike },
  basketball: { label: "Basketball", color: "#E07B39", group: "Sport & Trening", icon: CircleDot },
  tennis: { label: "Tennis", color: "#C8D45A", group: "Sport & Trening", icon: Target },
  volleyball: { label: "Volleyball", color: "#E8A838", group: "Sport & Trening", icon: Volleyball },
  svømming: { label: "Svømming", color: "#4AA8C8", group: "Sport & Trening", icon: Waves },
  ski: { label: "Ski", color: "#A8C8E8", group: "Sport & Trening", icon: MountainSnow },
  snowboard: { label: "Snowboard", color: "#7898C8", group: "Sport & Trening", icon: Snowflake },
  golf: { label: "Golf", color: "#68A868", group: "Sport & Trening", icon: Trophy },
  bordtennis: { label: "Bordtennis", color: "#D85858", group: "Sport & Trening", icon: Table2 },
  badminton: { label: "Badminton", color: "#C868A8", group: "Sport & Trening", icon: Target },
  crossfit: { label: "CrossFit", color: "#E05848", group: "Sport & Trening", icon: Trophy },
  styrketrening: { label: "Styrketrening", color: "#8868A8", group: "Sport & Trening", icon: Trophy },
  dans: { label: "Dans", color: "#E888B8", group: "Sport & Trening", icon: Music4 },
  kampsport: { label: "Kampsport", color: "#A86848", group: "Sport & Trening", icon: Swords },
  friluftsliv: { label: "Friluftsliv", color: "#58A870", group: "Sport & Trening", icon: Trees },
  hockey: { label: "Hockey", color: "#5888C8", group: "Sport & Trening", icon: Trophy },
  squash: { label: "Squash", color: "#78C878", group: "Sport & Trening", icon: Target },
  bar: { label: "Bar", color: "#C8586A", group: "Sosialt & Underholdning", icon: Beer },
  minigolf: { label: "Minigolf", color: "#68B868", group: "Sport & Trening", icon: Target },
  kino: { label: "Kino", color: "#7868A8", group: "Sosialt & Underholdning", icon: Film },
  konsert: { label: "Konsert", color: "#D868A8", group: "Sosialt & Underholdning", icon: Music4 },
  brettspill: { label: "Brettspill", color: "#E8A848", group: "Sosialt & Underholdning", icon: Puzzle },
  middag: { label: "Middag", color: "#E87848", group: "Sosialt & Underholdning", icon: UtensilsCrossed },
  grillfest: { label: "Grillfest", color: "#E86848", group: "Sosialt & Underholdning", icon: Flame },
  piknik: { label: "Piknik", color: "#88C858", group: "Sosialt & Underholdning", icon: Sandwich },
  quiz: { label: "Quiz", color: "#5898D8", group: "Sosialt & Underholdning", icon: BadgeHelp },
  kaffe: { label: "Kaffe", color: "#A87848", group: "Sosialt & Underholdning", icon: Coffee },
  gaming: { label: "Gaming", color: "#6858D8", group: "Sosialt & Underholdning", icon: Gamepad2 },
  matlaging: { label: "Matlaging", color: "#D87858", group: "Sosialt & Underholdning", icon: CookingPot },
  boklubb: { label: "Boklubb", color: "#88A8C8", group: "Sosialt & Underholdning", icon: BookOpen },
  museum: { label: "Museum", color: "#A8A868", group: "Sosialt & Underholdning", icon: Landmark },
  teater: { label: "Teater", color: "#C878A8", group: "Sosialt & Underholdning", icon: VenetianMask },
  festival: { label: "Festival", color: "#E8A868", group: "Sosialt & Underholdning", icon: FerrisWheel },
  karaoke: { label: "Karaoke", color: "#E858C8", group: "Sosialt & Underholdning", icon: MicVocal },
  "escape-room": { label: "Escape Room", color: "#487888", group: "Sosialt & Underholdning", icon: KeyRound },
  sjakk: { label: "Sjakk", color: "#787878", group: "Sosialt & Underholdning", icon: ChessKnight },
  spa: { label: "Spa", color: "#C8A8D8", group: "Sosialt & Underholdning", icon: Sparkles },
  vandring: { label: "Vandring", color: "#78A858", group: "Sosialt & Underholdning", icon: MapPinned },
  tur: { label: "Tur", color: "#68B888", group: "Sosialt & Underholdning", icon: TentTree },
  annet: { label: "Annet", color: "#A8A8A8", group: "Annet", icon: CircleEllipsis },
} satisfies Record<ActivityCategory, CategoryMeta>;

export const categoryOptions: readonly CategoryOption[] = orderedCategories.map(
  (category) => ({
    value: category,
    label: categoryMeta[category].label,
    group: categoryMeta[category].group,
  })
);

export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return `rgba(95, 168, 211, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function getCategoryAppearance(category: ActivityCategory) {
  return categoryMeta[category];
}

interface CategoryIconProps {
  category: ActivityCategory;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function CategoryIcon({
  category,
  className,
  size = 18,
  strokeWidth = 1.9,
}: CategoryIconProps) {
  const Icon = getCategoryAppearance(category).icon;

  return (
    <Icon
      aria-hidden="true"
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

interface CategoryTagProps {
  category: ActivityCategory;
}

export function CategoryTag({ category }: CategoryTagProps) {
  const meta = getCategoryAppearance(category);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          backgroundColor: withAlpha(meta.color, 0.16),
          color: meta.color,
        }}
      >
        <CategoryIcon category={category} size={12} strokeWidth={2.2} />
      </span>
      {meta.label}
    </span>
  );
}
