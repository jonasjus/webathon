export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface GeocodedLocation extends MapCoordinates {
  label: string;
}

export const BERGEN_CENTER: MapCoordinates = {
  lat: 60.39299,
  lng: 5.32415,
};

export const ACTIVITY_MAP_DEFAULT_ZOOM = 11;
export const ACTIVITY_DETAIL_MAP_ZOOM = 16;
export const LOCATION_PICKER_DEFAULT_ZOOM = 11;
export const LOCATION_PICKER_SELECTED_ZOOM = 14;

export const MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function hasValidCoordinates(
  value: Partial<MapCoordinates> | null | undefined
): value is MapCoordinates {
  return (
    value != null &&
    typeof value.lat === "number" &&
    typeof value.lng === "number" &&
    isValidLatitude(value.lat) &&
    isValidLongitude(value.lng)
  );
}

export function formatCoordinateFallbackLabel({ lat, lng }: MapCoordinates): string {
  return `Pin på kartet (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
}
