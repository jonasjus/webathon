const AVATAR_PALETTE = ["#5FA8D3", "#F08A6E", "#F1B24A", "#8E6BB1", "#7AA060"];

export function normalizeDisplayName(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

export function getInitials(displayName: string): string {
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials || displayName.slice(0, 2).toUpperCase() || "?";
}

export function getAvatarColor(initials: string): string {
  const colorIndex = initials.charCodeAt(0);

  return AVATAR_PALETTE[
    Number.isNaN(colorIndex) ? 0 : colorIndex % AVATAR_PALETTE.length
  ];
}
