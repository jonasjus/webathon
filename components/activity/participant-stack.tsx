interface ParticipantStackProps {
  current: number;
  max: number;
}

const avatarTones = [
  "bg-[var(--sage-50)]",
  "bg-[var(--surface-muted)]",
  "bg-[var(--surface)]",
];

export function ParticipantStack({
  current,
  max,
}: ParticipantStackProps) {
  const visibleCount = Math.min(current, 3);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {Array.from({ length: visibleCount }).map((_, index) => {
          const isLastOverflow = index === 2 && current > 3;

          return (
            <span
              key={`${current}-${index}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-[var(--ink)] ${avatarTones[index]}`}
            >
              {isLastOverflow ? `+${current - 2}` : <AvatarGlyph />}
            </span>
          );
        })}
      </div>
      <span className="text-sm text-[var(--ink-muted)]">
        {current}/{max} påmeldte
      </span>
    </div>
  );
}

function AvatarGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}
