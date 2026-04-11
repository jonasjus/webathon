// ---------------------------------------------------------------------------
// Raw DB row types (mirrors what Supabase returns from the query)
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;
  display_name: string;
  initials: string;
  avatar_color: string;
  avatar_url: string | null;
  bio: string | null;
  banner_theme: string | null;
  favorite_categories: ActivityCategory[];
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
  category: ActivityCategory;
  map_pin_x: number;
  map_pin_y: number;
  created_at: string;
}

export interface ParticipantRow {
  activity_id: string;
  user_id: string;
  joined_at: string;
}

export interface ActivityChatMessageRow {
  id: string;
  activity_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Application-level types (what components consume)
// ---------------------------------------------------------------------------

export type ActivityCategory =
  // Sport & Trening
  | "fotball" | "løping" | "yoga" | "klatring" | "padel" | "sykling"
  | "basketball" | "tennis" | "volleyball" | "svømming" | "ski" | "snowboard"
  | "golf" | "bordtennis" | "badminton" | "crossfit" | "styrketrening"
  | "dans" | "kampsport" | "friluftsliv" | "hockey" | "squash"
  // Sosialt & Underholdning
  | "bar" | "minigolf" | "kino" | "konsert" | "brettspill" | "middag"
  | "grillfest" | "piknik" | "quiz" | "kaffe" | "gaming" | "matlaging"
  | "boklubb" | "museum" | "teater" | "festival" | "karaoke"
  | "escape-room" | "sjakk" | "spa" | "vandring" | "tur"
  // Annet
  | "annet";

/** @deprecated Use ActivityCategory */
export type SportCategory = ActivityCategory;

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
  category: ActivityCategory;
  mapPin: { x: number; y: number };
  startsAt: string;
  isJoined: boolean;
  hostUserId: string;
  hostAvatarUrl: string | null;
  participantAvatars: ActivityParticipantPreview[];
}

export interface ActivityParticipantPreview {
  id: string;
  initials: string;
  avatarColor: string;
  avatarUrl: string | null;
}

export interface ChatParticipant {
  id: string;
  displayName: string;
  initials: string;
  avatarColor: string;
  avatarUrl: string | null;
}

export interface ActivityChatMessage {
  id: string;
  activityId: string;
  body: string;
  createdAt: string;
  sender: ChatParticipant;
}

export interface ActivityChatSummary {
  activityId: string;
  title: string;
  location: string;
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
}

// ---------------------------------------------------------------------------
// Supabase Database generic type (used to type createClient)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at"> & {
          bio?: string | null;
          banner_theme?: string | null;
          favorite_categories?: ActivityCategory[];
        };
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
      activity_chat_messages: {
        Row: ActivityChatMessageRow;
        Insert: Omit<ActivityChatMessageRow, "id" | "sender_user_id" | "created_at"> &
          Partial<Pick<ActivityChatMessageRow, "sender_user_id">>;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
