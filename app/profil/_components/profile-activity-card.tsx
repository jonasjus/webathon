import type { ReactNode } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { Avatar } from "@/components/account/avatar";
import {
  CategoryIcon,
  getCategoryAppearance,
  withAlpha,
} from "@/components/activity/category-tag";
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
  const appearance = getCategoryAppearance(activity.category);
  const accentSurface = withAlpha(appearance.color, 0.12);
  const accentBorder = withAlpha(appearance.color, 0.24);
  const accentInk = withAlpha(appearance.color, 0.88);

  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] border"
          style={{
            backgroundColor: accentSurface,
            borderColor: accentBorder,
            color: accentInk,
          }}
        >
          <CategoryIcon category={activity.category} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: accentInk }}
          >
            {isHost ? "Arrangerer" : "Deltar"} · {appearance.label}
          </p>
          <h3 className="card-title mt-2 text-[1.55rem] text-[var(--ink)]">
            {activity.title}
          </h3>
          <p className="card-copy mt-2.5 text-[15px]">
            {activity.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <MetaItem icon={<CalendarDays className="h-4 w-4" />}>
              {activity.date} kl. {activity.time}
            </MetaItem>
            <MetaItem icon={<MapPin className="h-4 w-4" />}>
              {activity.location}
            </MetaItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-muted)]">
              <Avatar
                src={activity.hostAvatarUrl}
                initials={activity.hostInitials}
                color={activity.hostColor}
                size={22}
              />
              <span>
                {isHost ? (
                  "Du arrangerer"
                ) : (
                  <>
                    Arrangør{" "}
                    <span className="font-medium text-[var(--ink)]">{activity.host}</span>
                  </>
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

interface MetaItemProps {
  children: ReactNode;
  icon: ReactNode;
}

function MetaItem({ children, icon }: MetaItemProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-muted)]">
      {icon}
      {children}
    </span>
  );
}
