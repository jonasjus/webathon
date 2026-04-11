"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isActivityChatActive } from "@/lib/date-time";
import {
  markActivityUnread,
  retainUnreadActivityIds,
  subscribeToUnreadActivityIds,
} from "@/lib/messages-unread-store";
import { createClient } from "@/lib/supabase/client";

interface SidebarMessagesIndicatorProps {
  currentUserId: string | null;
}

interface ActivityAccessRow {
  id: string;
  starts_at: string;
}

interface ParticipantActivityRow {
  activity_id: string;
}

export function SidebarMessagesIndicator({
  currentUserId,
}: SidebarMessagesIndicatorProps) {
  const pathname = usePathname();
  const [supabase] = useState(() => createClient());
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => subscribeToUnreadActivityIds((activityIds) => {
    setHasUnread(activityIds.size > 0);
  }), []);

  useEffect(() => {
    if (!currentUserId || pathname === "/meldinger") return;

    let isCancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function subscribeToActivityMessages() {
      const [{ data: hostedActivities }, { data: participantRows }] =
        await Promise.all([
          supabase
            .from("activities")
            .select("id, starts_at")
            .eq("host_user_id", currentUserId),
          supabase
            .from("activity_participants")
            .select("activity_id")
            .eq("user_id", currentUserId),
        ]);

      if (isCancelled) return;

      const participantActivityIds = [
        ...new Set(
          ((participantRows ?? []) as ParticipantActivityRow[]).map(
            (row) => row.activity_id
          )
        ),
      ];

      let participantActivities: ActivityAccessRow[] = [];

      if (participantActivityIds.length > 0) {
        const { data } = await supabase
          .from("activities")
          .select("id, starts_at")
          .in("id", participantActivityIds);

        if (isCancelled) return;
        participantActivities = (data ?? []) as ActivityAccessRow[];
      }

      const activityIds = [
        ...new Set(
          [...((hostedActivities ?? []) as ActivityAccessRow[]), ...participantActivities]
            .filter((activity) => isActivityChatActive(activity.starts_at))
            .map((activity) => activity.id)
        ),
      ];

      retainUnreadActivityIds(activityIds);

      if (activityIds.length === 0) return;

      const filter =
        activityIds.length === 1
          ? `activity_id=eq.${activityIds[0]}`
          : `activity_id=in.(${activityIds.join(",")})`;

      channel = supabase
        .channel(`sidebar-activity-chat:${activityIds.join(":")}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "activity_chat_messages",
            filter,
          },
          (payload) => {
            const activityId =
              typeof payload.new.activity_id === "string"
                ? payload.new.activity_id
                : null;
            const senderUserId =
              typeof payload.new.sender_user_id === "string"
                ? payload.new.sender_user_id
                : null;

            if (!activityId || !senderUserId || senderUserId === currentUserId) {
              return;
            }

            markActivityUnread(activityId);
          }
        )
        .subscribe();
    }

    void subscribeToActivityMessages();

    return () => {
      isCancelled = true;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [currentUserId, pathname, supabase]);

  if (!hasUnread) return null;

  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--sage-500)]">
      <span className="absolute inset-0 animate-ping rounded-full bg-[var(--sage-500)] opacity-60" />
    </span>
  );
}
