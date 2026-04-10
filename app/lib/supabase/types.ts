// ---------------------------------------------------------------------------
// Raw DB row types (mirrors what Supabase returns from the query)
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;
  display_name: string;
  initials: string;
  avatar_color: string;
  created_at: string;
}

export interface ActivityRow {
  id: string;
  title: string;
  host_user_id: string;
  location: string;
  starts_at: string;
  description: string;
  participants_max: number;
  category: SportCategory;
  map_pin_x: number;
  map_pin_y: number;
  created_at: string;
}

export interface ParticipantRow {
  activity_id: string;
  user_id: string;
  joined_at: string;
}

// ---------------------------------------------------------------------------
// Application-level types (what components consume)
// ---------------------------------------------------------------------------

export type SportCategory =
  | "fotball"
  | "løping"
  | "yoga"
  | "klatring"
  | "padel"
  | "sykling";

export interface Activity {
  id: string;
  title: string;
  host: string;
  hostInitials: string;
  hostColor: string;
  location: string;
  date: string;
  time: string;
  description: string;
  participantsCurrent: number;
  participantsMax: number;
  category: SportCategory;
  mapPin: { x: number; y: number };
  isJoined: boolean;
}

// ---------------------------------------------------------------------------
// Supabase Database generic type (used to type createClient)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at">;
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
      };
      activities: {
        Row: ActivityRow;
        Insert: Omit<ActivityRow, "id" | "created_at">;
        Update: Partial<Omit<ActivityRow, "id" | "created_at">>;
      };
      activity_participants: {
        Row: ParticipantRow;
        Insert: Omit<ParticipantRow, "joined_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
