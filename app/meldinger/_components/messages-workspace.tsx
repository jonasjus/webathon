"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Avatar } from "@/components/account/avatar";
import { formatChatTimestamp, isActivityChatActive } from "@/lib/date-time";
import { createClient } from "@/lib/supabase/client";
import type {
  ActivityChatMessage,
  ActivityChatSummary,
  ChatParticipant,
} from "@/lib/supabase/types";

interface MessagesWorkspaceProps {
  currentUser: ChatParticipant;
  currentUserId: string;
  initialSummaries: ActivityChatSummary[];
  initialMessagesByActivityId: Record<string, ActivityChatMessage[]>;
  initialSelectedActivityId: string | null;
  initialSelectionNotice: string | null;
}

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

function sortSummaries(a: ActivityChatSummary, b: ActivityChatSummary) {
  if (a.lastMessageAt && b.lastMessageAt) {
    return b.lastMessageAt.localeCompare(a.lastMessageAt);
  }

  if (a.lastMessageAt) return -1;
  if (b.lastMessageAt) return 1;

  return a.startsAt.localeCompare(b.startsAt);
}

function updateSummaryWithMessage(
  summary: ActivityChatSummary,
  message: ActivityChatMessage
): ActivityChatSummary {
  return {
    ...summary,
    lastMessageAt: message.createdAt,
    lastMessagePreview: message.body,
  };
}

function toChatMessage(
  row: MessageQueryRow,
  fallbackSender: ChatParticipant
): ActivityChatMessage {
  return {
    id: row.id,
    activityId: row.activity_id,
    body: row.body,
    createdAt: row.created_at,
    sender: {
      id: row.sender?.id ?? row.sender_user_id,
      displayName: row.sender?.display_name ?? fallbackSender.displayName,
      initials: row.sender?.initials ?? fallbackSender.initials,
      avatarColor: row.sender?.avatar_color ?? fallbackSender.avatarColor,
      avatarUrl: row.sender?.avatar_url ?? fallbackSender.avatarUrl,
    },
  };
}

export function MessagesWorkspace({
  currentUser,
  currentUserId,
  initialSummaries,
  initialMessagesByActivityId,
  initialSelectedActivityId,
  initialSelectionNotice,
}: MessagesWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [supabase] = useState(() => createClient());
  const [summaries, setSummaries] = useState(initialSummaries);
  const [messagesByActivityId, setMessagesByActivityId] = useState(
    initialMessagesByActivityId
  );
  const [selectedActivityId, setSelectedActivityId] = useState(
    initialSelectedActivityId
  );
  const [selectionNotice, setSelectionNotice] = useState(initialSelectionNotice);
  const [unreadActivityIds, setUnreadActivityIds] = useState<Set<string>>(
    () => new Set()
  );
  const [draft, setDraft] = useState("");
  const [composerError, setComposerError] = useState<string | null>(null);
  const [isSending, startTransition] = useTransition();
  const currentSearch = searchParams.toString();

  const selectedSummary =
    summaries.find((summary) => summary.activityId === selectedActivityId) ?? null;
  const selectedMessages = selectedActivityId
    ? messagesByActivityId[selectedActivityId] ?? []
    : [];

  const syncSelection = useCallback((nextActivityId: string | null) => {
    const nextParams = new URLSearchParams(currentSearch);

    if (nextActivityId) {
      nextParams.set("activityId", nextActivityId);
    } else {
      nextParams.delete("activityId");
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [currentSearch, pathname, router]);

  function setActiveChat(nextActivityId: string | null) {
    setSelectedActivityId(nextActivityId);
    setSelectionNotice(null);
    syncSelection(nextActivityId);
    if (nextActivityId) {
      setUnreadActivityIds((prev) => {
        if (!prev.has(nextActivityId)) return prev;
        const next = new Set(prev);
        next.delete(nextActivityId);
        return next;
      });
    }
  }

  const applyIncomingMessage = useCallback((message: ActivityChatMessage) => {
    setMessagesByActivityId((current) => {
      const existing = current[message.activityId] ?? [];
      if (existing.some((entry) => entry.id === message.id)) return current;

      return {
        ...current,
        [message.activityId]: [...existing, message].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt)
        ),
      };
    });

    setSummaries((current) =>
      current
        .map((summary) =>
          summary.activityId === message.activityId
            ? updateSummaryWithMessage(summary, message)
            : summary
        )
        .sort(sortSummaries)
    );

    // Mark as unread if the message is from someone else and the chat isn't open
    setSelectedActivityId((currentSelected) => {
      if (
        message.sender.id !== currentUserId &&
        message.activityId !== currentSelected
      ) {
        setUnreadActivityIds((prev) => new Set([...prev, message.activityId]));
      }
      return currentSelected;
    });
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedActivityId, selectedMessages.length]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSummaries((current) => {
        const next = current
          .filter((summary) => isActivityChatActive(summary.startsAt))
          .sort(sortSummaries);

        if (next.length === current.length) return current;

        const nextIds = new Set(next.map((summary) => summary.activityId));

        setMessagesByActivityId((messages) => {
          const filteredEntries = Object.entries(messages).filter(([activityId]) =>
            nextIds.has(activityId)
          );

          return Object.fromEntries(filteredEntries);
        });

        setSelectedActivityId((currentSelected) => {
          const stillSelected =
            currentSelected && next.some((summary) => summary.activityId === currentSelected)
              ? currentSelected
              : next[0]?.activityId ?? null;

          syncSelection(stillSelected);
          return stillSelected;
        });

        setSelectionNotice("En eller flere chatter er utløpt og ble fjernet.");
        return next;
      });
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [syncSelection]);

  useEffect(() => {
    const activityIds = summaries.map((summary) => summary.activityId);
    if (activityIds.length === 0) return;

    const filter =
      activityIds.length === 1
        ? `activity_id=eq.${activityIds[0]}`
        : `activity_id=in.(${activityIds.join(",")})`;

    const channel = supabase
      .channel(`activity-chat-messages:${activityIds.join(":")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_chat_messages",
          filter,
        },
        async (payload) => {
          const messageId = payload.new.id;
          if (typeof messageId !== "string") return;

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
            .eq("id", messageId)
            .single();

          if (error || !data) return;
          applyIncomingMessage(
            toChatMessage(data as unknown as MessageQueryRow, currentUser)
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [applyIncomingMessage, currentUser, summaries, supabase]);

  async function sendMessage() {
    const body = draft.trim();
    if (!selectedActivityId) return;

    if (!body) {
      setComposerError("Skriv en melding før du sender.");
      return;
    }

    if (body.length > 2000) {
      setComposerError("Meldingen kan maks være 2000 tegn.");
      return;
    }

    setComposerError(null);

    const { data, error } = await supabase
      .from("activity_chat_messages")
      .insert({
        activity_id: selectedActivityId,
        body,
      })
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
      .single();

    if (error || !data) {
      setComposerError(
        error?.message ?? "Kunne ikke sende meldingen. Prøv igjen."
      );
      return;
    }

    applyIncomingMessage(toChatMessage(data as unknown as MessageQueryRow, currentUser));
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-[0_28px_72px_rgba(67,92,56,0.10)] sm:p-8">
        <div className="max-w-5xl">
          <div>
        <p className="inline-flex rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-subtle)] shadow-sm backdrop-blur-sm">
          Meldinger
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
          Dine gruppechatter
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] sm:text-base">
          Gruppechatter for arrangementene du er med på eller arrangerer.
        </p>
          </div>
        </div>
      </section>

    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--border)] px-5 py-3">
          <p className="text-xs text-[var(--ink-subtle)]">Aktive chatter</p>
        </div>

        {summaries.length === 0 ? (
          <div className="px-5 py-8">
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-5 py-8 text-center">
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                Ingen aktive chatter
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
                Når du blir med på et arrangement, får du en egen gruppechat her
                fram til arrangementsdatoen er over.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)]"
              >
                Finn arrangementer
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-h-[72vh] overflow-y-auto p-2">
            {summaries.map((summary) => {
              const isActive = summary.activityId === selectedActivityId;
              const hasUnread = unreadActivityIds.has(summary.activityId);

              return (
                <button
                  key={summary.activityId}
                  type="button"
                  onClick={() => setActiveChat(summary.activityId)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-[var(--sage-500)] bg-[var(--sage-50)]"
                      : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {/* Unread indicator */}
                  {hasUnread && !isActive && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      <span className="block h-2 w-2 rounded-full bg-[var(--sage-500)]">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--sage-500)] opacity-60" />
                      </span>
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2
                        className={`truncate text-sm text-[var(--ink)] ${
                          hasUnread && !isActive ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {summary.title}
                      </h2>
                      {summary.lastMessageAt && (
                        <span className="shrink-0 text-xs text-[var(--ink-subtle)]">
                          {formatChatTimestamp(summary.lastMessageAt)}
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-xs text-[var(--ink-subtle)]">
                      {summary.location}
                    </p>

                    <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                      {summary.dateLabel} · kl. {summary.timeLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        {selectionNotice ? (
          <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3 text-sm text-[var(--ink-muted)]">
            {selectionNotice}
          </div>
        ) : null}

        {!selectedSummary ? (
          <div className="flex min-h-[640px] items-center justify-center px-6 py-10">
            <div className="max-w-md text-center">
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                Ingen chat valgt
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
                Velg et arrangement fra listen for å åpne gruppechatten.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[640px] flex-col">
            <div className="border-b border-[var(--border)] px-5 py-5">
              <p className="text-sm font-medium text-[var(--ink-muted)]">
                {selectedSummary.location}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {selectedSummary.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                {selectedSummary.dateLabel} kl. {selectedSummary.timeLabel}
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {selectedMessages.length === 0 ? (
                <div className="flex h-full min-h-[360px] items-center justify-center">
                  <div className="max-w-md rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-8 text-center">
                    <h3 className="text-lg font-semibold text-[var(--ink)]">
                      Start samtalen
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
                      Dette er gruppechatten for arrangementet. Første melding setter
                      i gang praten.
                    </p>
                  </div>
                </div>
              ) : (
                selectedMessages.map((message) => {
                  const isOwnMessage = message.sender.id === currentUserId;

                  return (
                    <article
                      key={message.id}
                      className={`flex gap-3 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isOwnMessage ? (
                        <Avatar
                          src={message.sender.avatarUrl}
                          initials={message.sender.initials}
                          color={message.sender.avatarColor}
                          size={36}
                        />
                      ) : null}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          isOwnMessage
                            ? "bg-[var(--sage-500)] text-white"
                            : "bg-[var(--surface-muted)] text-[var(--ink)]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {isOwnMessage ? "Deg" : message.sender.displayName}
                          </p>
                          <span
                            className={`text-xs ${
                              isOwnMessage
                                ? "text-white/75"
                                : "text-[var(--ink-subtle)]"
                            }`}
                          >
                            {formatChatTimestamp(message.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                          {message.body}
                        </p>
                      </div>

                      {isOwnMessage ? (
                        <Avatar
                          src={currentUser.avatarUrl}
                          initials={currentUser.initials}
                          color={currentUser.avatarColor}
                          size={36}
                        />
                      ) : null}
                    </article>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              className="border-t border-[var(--border)] px-5 py-4"
              onSubmit={(event) => {
                event.preventDefault();
                startTransition(async () => {
                  await sendMessage();
                });
              }}
            >
              <label htmlFor="message-body" className="sr-only">
                Skriv melding
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <textarea
                  id="message-body"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Skriv til gruppen…"
                  rows={3}
                  maxLength={2000}
                  className="min-h-[88px] flex-1 resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[color:rgba(122,160,96,0.18)]"
                />
                <button
                  type="submit"
                  disabled={isSending || !selectedSummary}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--sage-500)] bg-[var(--sage-500)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sender…" : "Send"}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-[var(--ink-subtle)]">
                  Chatten slettes automatisk etter arrangementsdatoen.
                </p>
                <p className="text-xs text-[var(--ink-subtle)]">
                  {draft.trim().length}/2000
                </p>
              </div>

              {composerError ? (
                <p className="mt-2 text-sm text-[var(--accent-coral)]">
                  {composerError}
                </p>
              ) : null}
            </form>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
