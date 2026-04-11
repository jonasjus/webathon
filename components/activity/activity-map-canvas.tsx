"use client";

import { Marker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { Activity } from "@/lib/supabase/types";
import {
  ACTIVITY_MAP_DEFAULT_ZOOM,
  BERGEN_CENTER,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from "@/lib/map";
import { getActivityCategoryAppearance } from "./category-tag";
import { createMapTextPinIcon } from "./map-icons";
import { MapPopupCard } from "./map-popup-card";

interface ActivityMapCanvasProps {
  activities: Activity[];
  currentUserId?: string | null;
  isLoggedIn: boolean;
  selectedActivityId?: string;
  onSelectActivity: (activityId: string) => void;
  onClearSelection: () => void;
}

export function ActivityMapCanvas({
  activities,
  currentUserId,
  isLoggedIn,
  selectedActivityId,
  onSelectActivity,
  onClearSelection,
}: ActivityMapCanvasProps) {
  return (
    <MapContainer
      center={[BERGEN_CENTER.lat, BERGEN_CENTER.lng]}
      zoom={ACTIVITY_MAP_DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Interaktivt kart over arrangementer"
    >
      <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />

      {isLoggedIn && activities.map((activity) => {
        const appearance = getActivityCategoryAppearance(activity.category);
        const isSelected = activity.id === selectedActivityId;

        return (
          <Marker
            key={activity.id}
            position={[activity.coordinates.lat, activity.coordinates.lng]}
            icon={createMapTextPinIcon({
              color: appearance.color,
              label: activity.title,
              selected: isSelected,
            })}
            eventHandlers={{
              click: () => onSelectActivity(activity.id),
              popupopen: () => onSelectActivity(activity.id),
              popupclose: onClearSelection,
            }}
          >
            <Popup closeButton={false} className="activity-map-popup">
              <MapPopupCard
                activity={activity}
                currentUserId={currentUserId}
              />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
