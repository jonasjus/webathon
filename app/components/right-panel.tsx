import type { Activity } from "../lib/supabase/types";
import { InteractiveMap } from "./interactive-map";

interface RightPanelProps {
  activities: Activity[];
}

export function RightPanel({ activities }: RightPanelProps) {
  return (
    <aside className="space-y-5 xl:h-full xl:overflow-y-auto">
      <InteractiveMap activities={activities} />
    </aside>
  );
}
