import type { Friend } from "../lib/mock-data";

interface SuggestedFriendsProps {
  friends: Friend[];
}

export function SuggestedFriends({ friends }: SuggestedFriendsProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
            Nettverk
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
            Foreslåtte venner
          </h3>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-[var(--sage-700)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
        >
          Se alle
        </button>
      </div>

      <div className="mt-4 divide-y divide-[var(--border)]">
        {friends.map((friend) => (
          <article key={friend.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: friend.color }}
            >
              {friend.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--ink)]">
                {friend.name}
              </p>
              <p className="text-sm text-[var(--ink-muted)]">{friend.sport}</p>
              <p className="text-xs text-[var(--ink-subtle)]">
                {friend.mutualFriends} felles venner
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
            >
              Legg til
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
