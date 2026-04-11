import "server-only";
import { cache } from "react";
import { createClient } from "./supabase/server";
import type {
  Activity,
  ActivityCategory,
  ActivityInterestCategory,
  ActivityParticipantPreview,
} from "./supabase/types";
import { formatNorwegianDate, formatNorwegianTime } from "./date-time";

// ---------------------------------------------------------------------------
// Row shape returned by the joined query
// ---------------------------------------------------------------------------

interface ActivityQueryRow {
  id: string;
  title: string;
  host_user_id: string;
  location: string;
  starts_at: string;
  description: string;
  participants_max: number;
  category: string;
  latitude: number;
  longitude: number;
  host: {
    display_name: string;
    initials: string;
    avatar_color: string;
    avatar_url: string | null;
    bio: string | null;
    favorite_categories: ActivityInterestCategory[];
  } | null;
  activity_participants: {
    user_id: string;
    joined_at: string;
    participant: {
      id: string;
      initials: string;
      avatar_color: string;
      avatar_url: string | null;
    } | null;
  }[];
}

function normalizeSingle<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getParticipantAvatars(
  participants: ActivityQueryRow["activity_participants"]
): ActivityParticipantPreview[] {
  return (participants ?? [])
    .slice()
    .sort((left, right) => left.joined_at.localeCompare(right.joined_at))
    .flatMap((participantRow) => {
      const participant = normalizeSingle(participantRow.participant);

      if (!participant) {
        return [];
      }

      return [
        {
          id: participant.id,
          initials: participant.initials,
          avatarColor: participant.avatar_color,
          avatarUrl: participant.avatar_url,
        },
      ];
    })
    .slice(0, 3);
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
      id, title, host_user_id, location, starts_at, description,
      participants_max, category, latitude, longitude,
      host:profiles!host_user_id ( display_name, initials, avatar_color, avatar_url, bio, favorite_categories ),
      activity_participants (
        user_id,
        joined_at,
        participant:profiles!user_id ( id, initials, avatar_color, avatar_url )
      )
    `
    )
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch activities: ${error.message}`);

  const rows = (data ?? []) as unknown as ActivityQueryRow[];

  return rows.map((row) => {
    const profile = normalizeSingle(row.host);
    const participants = row.activity_participants ?? [];
    const participantAvatars = getParticipantAvatars(participants);

    return {
      id: row.id,
      title: row.title,
      host: profile?.display_name ?? "Ukjent",
      hostInitials: profile?.initials ?? "??",
      hostColor: profile?.avatar_color ?? "#5FA8D3",
      hostBio: profile?.bio ?? null,
      hostFavoriteCategories: profile?.favorite_categories ?? [],
      location: row.location,
      date: formatNorwegianDate(row.starts_at),
      time: formatNorwegianTime(row.starts_at),
      description: row.description,
      participantsCurrent: participants.length,
      participantsMax: row.participants_max,
      category: row.category as ActivityCategory,
      coordinates: {
        lat: Number(row.latitude),
        lng: Number(row.longitude),
      },
      startsAt: row.starts_at,
      isJoined: user
        ? participants.some((p) => p.user_id === user.id)
        : false,
      hostUserId: row.host_user_id,
      hostAvatarUrl: profile?.avatar_url ?? null,
      participantAvatars,
    };
  });
});
