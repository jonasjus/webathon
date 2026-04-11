"use client";

import type { LeafletEventHandlerFnMap, Marker as LeafletMarker } from "leaflet";
import { useEffect } from "react";
import {
  Marker,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  BERGEN_CENTER,
  LOCATION_PICKER_DEFAULT_ZOOM,
  LOCATION_PICKER_SELECTED_ZOOM,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
  type MapCoordinates,
} from "@/lib/map";
import { createMapPinIcon } from "./map-icons";

interface LocationPickerMapProps {
  coordinates: MapCoordinates | null;
  disabled?: boolean;
  onSelectCoordinates: (coordinates: MapCoordinates) => void;
}

function LocationPickerMapEvents({
  disabled,
  onSelectCoordinates,
}: Pick<LocationPickerMapProps, "disabled" | "onSelectCoordinates">) {
  useMapEvents({
    click(event) {
      if (disabled) {
        return;
      }

      onSelectCoordinates({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapViewportController({
  coordinates,
}: Pick<LocationPickerMapProps, "coordinates">) {
  const map = useMap();

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    map.flyTo(
      [coordinates.lat, coordinates.lng],
      Math.max(map.getZoom(), LOCATION_PICKER_SELECTED_ZOOM),
      { duration: 0.35 }
    );
  }, [coordinates, map]);

  return null;
}

export function LocationPickerMap({
  coordinates,
  disabled = false,
  onSelectCoordinates,
}: LocationPickerMapProps) {
  const markerHandlers: LeafletEventHandlerFnMap | undefined = coordinates
    ? {
        dragend(event) {
          const target = event.target as LeafletMarker;
          const nextPosition = target.getLatLng();

          onSelectCoordinates({
            lat: nextPosition.lat,
            lng: nextPosition.lng,
          });
        },
      }
    : undefined;

  return (
    <MapContainer
      center={[coordinates?.lat ?? BERGEN_CENTER.lat, coordinates?.lng ?? BERGEN_CENTER.lng]}
      zoom={coordinates ? LOCATION_PICKER_SELECTED_ZOOM : LOCATION_PICKER_DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Velg plassering på kartet"
    >
      <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
      <LocationPickerMapEvents
        disabled={disabled}
        onSelectCoordinates={onSelectCoordinates}
      />
      <MapViewportController coordinates={coordinates} />

      {coordinates ? (
        <Marker
          position={[coordinates.lat, coordinates.lng]}
          icon={createMapPinIcon({
            color: "var(--sage-600)",
            selected: true,
            size: "large",
          })}
          draggable={!disabled}
          eventHandlers={markerHandlers}
        />
      ) : null}
    </MapContainer>
  );
}
