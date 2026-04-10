import { CategoryTag } from "@/components/activity/category-tag";
import type { Activity } from "@/lib/supabase/types";

interface ProfileActivityCardProps {
  activity: Activity;
  currentUserId: string;
}

export function ProfileActivityCard({
  activity,
  currentUserId,
}: ProfileActivityCardProps) {
  const isHost = activity.hostUserId === currentUserId;

  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
            {isHost ? "Arrangerer" : "Deltar"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
            {activity.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
            {activity.date} kl. {activity.time} • {activity.location}
          </p>
        </div>
        <CategoryTag category={activity.category} />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--ink-muted)]">
        {activity.description}
      </p>
    </article>
  );
}
