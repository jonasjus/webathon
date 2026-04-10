const OSLO_TIME_ZONE = "Europe/Oslo";

function getOsloDateKey(value: string | Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: OSLO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function isActivityChatActive(startsAt: string, now = new Date()): boolean {
  return getOsloDateKey(startsAt) >= getOsloDateKey(now);
}

export function formatNorwegianDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: OSLO_TIME_ZONE,
  });
}

export function formatNorwegianTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: OSLO_TIME_ZONE,
  });
}

export function formatChatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: OSLO_TIME_ZONE,
  });
}
