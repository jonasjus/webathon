import { Avatar } from "@/components/account/avatar";
import type { ActivityParticipantPreview } from "@/lib/supabase/types";

interface ParticipantStackProps {
  current: number;
  max: number;
  participants: ActivityParticipantPreview[];
}

export function ParticipantStack({
  current,
  max,
  participants,
}: ParticipantStackProps) {
  const visibleParticipants = participants.slice(0, Math.min(current, 3));
  const overflowCount = Math.max(current - visibleParticipants.length, 0);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center -space-x-2">
        {visibleParticipants.map((participant) => (
          <Avatar
            key={participant.id}
            src={participant.avatarUrl}
            initials={participant.initials}
            color={participant.avatarColor}
            size={32}
            className="border-2 border-white shadow-sm"
          />
        ))}

        {overflowCount > 0 ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--surface-muted)] text-[10px] font-semibold text-[var(--ink)] shadow-sm">
            +{overflowCount}
          </span>
        ) : null}
      </div>

      <span className="text-sm text-[var(--ink-muted)]">
        {`${current}/${max} p\u00E5meldte`}
      </span>
    </div>
  );
}
