import type {
  ActivityInterestCategory,
  ChatParticipant,
  ProfileRow,
} from "./supabase/types";

interface AuthUserLike {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}

export interface AppUser extends ChatParticipant {
  email: string | null;
  bio: string | null;
  bannerTheme: string | null;
  favoriteCategories: ActivityInterestCategory[];
}

function getMetadataString(
  metadata: Record<string, unknown> | null | undefined,
  key: string
) {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function buildAppUser(
  user: AuthUserLike,
  profile?: Partial<ProfileRow> | null
): AppUser {
  const metadata = user.user_metadata;

  return {
    id: user.id,
    email: user.email ?? null,
    displayName:
      profile?.display_name ??
      getMetadataString(metadata, "display_name") ??
      user.email ??
      "Bruker",
    initials:
      profile?.initials ??
      getMetadataString(metadata, "initials") ??
      "?",
    avatarColor:
      profile?.avatar_color ??
      getMetadataString(metadata, "avatar_color") ??
      "#5FA8D3",
    avatarUrl:
      profile?.avatar_url ??
      getMetadataString(metadata, "avatar_url") ??
      null,
    bio: profile?.bio ?? null,
    bannerTheme: profile?.banner_theme ?? null,
    favoriteCategories: profile?.favorite_categories ?? [],
  };
}
