import type { Activity, Friend } from "../lib/mock-data";
import { InteractiveMap } from "./interactive-map";
import { SuggestedFriends } from "./suggested-friends";

interface RightPanelProps {
  activities: Activity[];
  friends: Friend[];
}

export function RightPanel({ activities, friends }: RightPanelProps) {
  return (
    <aside className="space-y-5 xl:h-full xl:overflow-y-auto">
      <InteractiveMap activities={activities} />
      <SuggestedFriends friends={friends} />
    </aside>
  );
}
