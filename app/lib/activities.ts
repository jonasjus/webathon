import "server-only";
import { cache } from "react";
import { createClient } from "./supabase/server";
import type { Activity, SportCategory } from "./supabase/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNorwegianDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatNorwegianTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ---------------------------------------------------------------------------
// Row shape returned by the joined query
// ---------------------------------------------------------------------------

interface ActivityQueryRow {
  id: string;
  title: string;
  location: string;
  starts_at: string;
  description: string;
  participants_max: number;
  category: string;
  map_pin_x: number;
  map_pin_y: number;
  profiles: {
    display_name: string;
    initials: string;
    avatar_color: string;
  } | null;
  activity_participants: { user_id: string }[];
}

// ---------------------------------------------------------------------------
// getActivities — cached per request via React.cache
// ---------------------------------------------------------------------------

export const getActivities = cache(async (): Promise<Activity[]> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("activities")
    .select(
      `
      id, title, location, starts_at, description,
      participants_max, category, map_pin_x, map_pin_y,
      profiles!host_user_id ( display_name, initials, avatar_color ),
      activity_participants ( user_id )
    `
    )
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch activities: ${error.message}`);

  const rows = (data ?? []) as unknown as ActivityQueryRow[];

  return rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const participants = row.activity_participants ?? [];

    return {
      id: row.id,
      title: row.title,
      host: profile?.display_name ?? "Ukjent",
      hostInitials: profile?.initials ?? "??",
      hostColor: profile?.avatar_color ?? "#5FA8D3",
      location: row.location,
      date: formatNorwegianDate(row.starts_at),
      time: formatNorwegianTime(row.starts_at),
      description: row.description,
      participantsCurrent: participants.length,
      participantsMax: row.participants_max,
      category: row.category as SportCategory,
      mapPin: { x: Number(row.map_pin_x), y: Number(row.map_pin_y) },
      isJoined: user
        ? participants.some((p) => p.user_id === user.id)
        : false,
    };
  });
});
