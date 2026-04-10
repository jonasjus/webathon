import "server-only";

import { getActivities } from "./activities";
import {
  formatNorwegianDate,
  formatNorwegianTime,
  isActivityChatActive,
} from "./date-time";
import { createClient } from "./supabase/server";
import type {
  Activity,
  ActivityChatMessage,
  ActivityChatSummary,
  ChatParticipant,
} from "./supabase/types";

interface MessageQueryRow {
  id: string;
  activity_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
  sender: {
    id: string;
    display_name: string;
    initials: string;
    avatar_color: string;
    avatar_url: string | null;
  } | null;
}

export interface MessagesPageData {
  currentUserId: string;
  sidebarUser: ChatParticipant;
  summaries: ActivityChatSummary[];
  messagesByActivityId: Record<string, ActivityChatMessage[]>;
  selectedActivityId: string | null;
  selectionNotice: string | null;
}

function buildSidebarUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): ChatParticipant {
  return {
    id: user.id,
    displayName:
      (user.user_metadata?.display_name as string | undefined) ??
      user.email ??
      "Bruker",
    initials: (user.user_metadata?.initials as string | undefined) ?? "?",
    avatarColor:
      (user.user_metadata?.avatar_color as string | undefined) ?? "#5FA8D3",
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };
}

function buildSummary(
  activity: Activity,
  messages: ActivityChatMessage[]
): ActivityChatSummary {
  const lastMessage = messages[messages.length - 1];

  return {
    activityId: activity.id,
    title: activity.title,
    location: activity.location,
    startsAt: activity.startsAt,
    dateLabel: formatNorwegianDate(activity.startsAt),
    timeLabel: formatNorwegianTime(activity.startsAt),
    lastMessageAt: lastMessage?.createdAt ?? null,
    lastMessagePreview: lastMessage?.body ?? null,
  };
}

function sortSummaries(a: ActivityChatSummary, b: ActivityChatSummary) {
  if (a.lastMessageAt && b.lastMessageAt) {
    return b.lastMessageAt.localeCompare(a.lastMessageAt);
  }

  if (a.lastMessageAt) return -1;
  if (b.lastMessageAt) return 1;

  return a.startsAt.localeCompare(b.startsAt);
}

function toChatMessage(row: MessageQueryRow): ActivityChatMessage {
  return {
    id: row.id,
    activityId: row.activity_id,
    body: row.body,
    createdAt: row.created_at,
    sender: {
      id: row.sender?.id ?? row.sender_user_id,
      displayName: row.sender?.display_name ?? "Ukjent",
      initials: row.sender?.initials ?? "?",
      avatarColor: row.sender?.avatar_color ?? "#5FA8D3",
      avatarUrl: row.sender?.avatar_url ?? null,
    },
  };
}

export async function getMessagesPageData(
  requestedActivityId?: string
): Promise<MessagesPageData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const accessibleActivities = (await getActivities()).filter(
    (activity) =>
      isActivityChatActive(activity.startsAt) &&
      (activity.hostUserId === user.id || activity.isJoined)
  );

  const activityIds = accessibleActivities.map((activity) => activity.id);
  const messagesByActivityId: Record<string, ActivityChatMessage[]> = {};

  if (activityIds.length > 0) {
    const { data, error } = await supabase
      .from("activity_chat_messages")
      .select(
        `
        id,
        activity_id,
        sender_user_id,
        body,
        created_at,
        sender:profiles!sender_user_id (
          id,
          display_name,
          initials,
          avatar_color,
          avatar_url
        )
      `
      )
      .in("activity_id", activityIds)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch activity chat messages: ${error.message}`);
    }

    for (const row of (data ?? []) as unknown as MessageQueryRow[]) {
      messagesByActivityId[row.activity_id] ??= [];
      messagesByActivityId[row.activity_id].push(toChatMessage(row));
    }
  }

  const summaries = accessibleActivities
    .map((activity) =>
      buildSummary(activity, messagesByActivityId[activity.id] ?? [])
    )
    .sort(sortSummaries);

  const fallbackActivityId = summaries[0]?.activityId ?? null;
  const selectedActivityId =
    requestedActivityId &&
    summaries.some((summary) => summary.activityId === requestedActivityId)
      ? requestedActivityId
      : fallbackActivityId;

  const selectionNotice =
    requestedActivityId && requestedActivityId !== selectedActivityId
      ? "Den valgte chatten er ikke tilgjengelig lenger."
      : null;

  return {
    currentUserId: user.id,
    sidebarUser: buildSidebarUser(user),
    summaries,
    messagesByActivityId,
    selectedActivityId,
    selectionNotice,
  };
}
