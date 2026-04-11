export function getShortLocationLabel(location: string): string {
  const firstSegment = location.split(",")[0]?.trim();
  return firstSegment || location.trim();
}
