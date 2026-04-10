// Re-export types from the canonical location so existing imports keep working.
// The hardcoded activities and friends arrays have been removed — data now
// comes from Supabase (see app/lib/activities.ts).
export type { SportCategory, Activity } from "./supabase/types";
