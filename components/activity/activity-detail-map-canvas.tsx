"use client";

import { Marker, MapContainer, TileLayer } from "react-leaflet";
import type { Activity } from "@/lib/supabase/types";
import {
  ACTIVITY_DETAIL_MAP_ZOOM,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from "@/lib/map";
import { getActivityCategoryAppearance } from "./category-tag";
import { createMapPinIcon } from "./map-icons";

interface ActivityDetailMapCanvasProps {
  activity: Activity;
}

export function ActivityDetailMapCanvas({
  activity,
}: ActivityDetailMapCanvasProps) {
  const appearance = getActivityCategoryAppearance(activity.category);

  return (
    <MapContainer
      center={[activity.coordinates.lat, activity.coordinates.lng]}
      zoom={ACTIVITY_DETAIL_MAP_ZOOM}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label={`Kart over ${activity.title}`}
    >
      <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
      <Marker
        position={[activity.coordinates.lat, activity.coordinates.lng]}
        icon={createMapPinIcon({
          color: appearance.color,
          selected: true,
          size: "large",
        })}
      />
    </MapContainer>
  );
}
