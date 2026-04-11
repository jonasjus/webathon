"use client";

const UNREAD_STORAGE_KEY = "venue:unread-activity-ids";
const UNREAD_EVENT_NAME = "venue:unread-activity-ids-change";

function canUseBrowser() {
  return typeof window !== "undefined";
}

function normalizeActivityIds(activityIds: Iterable<string>) {
  return [...new Set(activityIds)].filter(Boolean).sort();
}

function readUnreadActivityIds() {
  if (!canUseBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(UNREAD_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? normalizeActivityIds(parsed.filter((value): value is string => typeof value === "string"))
      : [];
  } catch {
    return [];
  }
}

function writeUnreadActivityIds(activityIds: Iterable<string>) {
  if (!canUseBrowser()) return;

  const nextIds = normalizeActivityIds(activityIds);
  const currentIds = readUnreadActivityIds();

  if (
    currentIds.length === nextIds.length &&
    currentIds.every((value, index) => value === nextIds[index])
  ) {
    return;
  }

  window.localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(nextIds));
  window.dispatchEvent(new CustomEvent(UNREAD_EVENT_NAME));
}

function updateUnreadActivityIds(
  updater: (currentIds: Set<string>) => Iterable<string>
) {
  const currentIds = new Set(readUnreadActivityIds());
  writeUnreadActivityIds(updater(currentIds));
}

export function getUnreadActivityIds() {
  return new Set(readUnreadActivityIds());
}

export function markActivityUnread(activityId: string) {
  if (!activityId) return;

  updateUnreadActivityIds((currentIds) => {
    currentIds.add(activityId);
    return currentIds;
  });
}

export function markActivityRead(activityId: string) {
  if (!activityId) return;

  updateUnreadActivityIds((currentIds) => {
    currentIds.delete(activityId);
    return currentIds;
  });
}

export function retainUnreadActivityIds(validActivityIds: Iterable<string>) {
  const validIds = new Set(normalizeActivityIds(validActivityIds));

  updateUnreadActivityIds((currentIds) =>
    [...currentIds].filter((activityId) => validIds.has(activityId))
  );
}

export function subscribeToUnreadActivityIds(
  listener: (activityIds: Set<string>) => void
) {
  if (!canUseBrowser()) {
    listener(new Set());
    return () => undefined;
  }

  const emit = () => listener(getUnreadActivityIds());
  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== UNREAD_STORAGE_KEY) return;
    emit();
  };

  emit();
  window.addEventListener(UNREAD_EVENT_NAME, emit);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(UNREAD_EVENT_NAME, emit);
    window.removeEventListener("storage", handleStorage);
  };
}
