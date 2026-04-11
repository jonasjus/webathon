import "server-only";

import type { GeocodedLocation, MapCoordinates } from "./map";
import {
  formatCoordinateFallbackLabel,
  hasValidCoordinates,
  isValidLatitude,
  isValidLongitude,
} from "./map";

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface NominatimReverseResult {
  lat?: string;
  lon?: string;
  display_name?: string;
}

const DEFAULT_GEOCODING_BASE_URL = "https://nominatim.openstreetmap.org";
const DEFAULT_GEOCODING_USER_AGENT = "webathon-venue-map/1.0";
const GEOCODING_ACCEPT_LANGUAGE = "nb-NO,nb;q=0.9,no;q=0.8,en;q=0.7";

function buildGeocodingUrl(pathname: string, searchParams: URLSearchParams): string {
  const baseUrl = process.env.GEOCODING_BASE_URL ?? DEFAULT_GEOCODING_BASE_URL;
  const url = new URL(pathname, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  url.search = searchParams.toString();
  return url.toString();
}

async function fetchGeocodingJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Accept-Language": GEOCODING_ACCEPT_LANGUAGE,
      "User-Agent":
        process.env.GEOCODING_USER_AGENT ?? DEFAULT_GEOCODING_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeLabel(label: string | undefined, fallback: string): string {
  return label?.trim() || fallback;
}

export async function geocodeAddress(query: string): Promise<GeocodedLocation | null> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return null;
  }

  const searchParams = new URLSearchParams({
    q: normalizedQuery,
    format: "jsonv2",
    limit: "1",
    addressdetails: "0",
    countrycodes: "no",
  });

  const [result] = await fetchGeocodingJson<NominatimSearchResult[]>(
    buildGeocodingUrl("search", searchParams)
  );

  if (!result) {
    return null;
  }

  const lat = Number(result.lat);
  const lng = Number(result.lon);

  if (!hasValidCoordinates({ lat, lng })) {
    return null;
  }

  return {
    lat,
    lng,
    label: normalizeLabel(result.display_name, normalizedQuery),
  };
}

export async function reverseGeocodeCoordinates(
  coordinates: MapCoordinates
): Promise<GeocodedLocation | null> {
  if (
    !isValidLatitude(coordinates.lat) ||
    !isValidLongitude(coordinates.lng)
  ) {
    return null;
  }

  const searchParams = new URLSearchParams({
    lat: String(coordinates.lat),
    lon: String(coordinates.lng),
    format: "jsonv2",
    zoom: "18",
    addressdetails: "0",
  });

  const result = await fetchGeocodingJson<NominatimReverseResult>(
    buildGeocodingUrl("reverse", searchParams)
  );

  const lat = Number(result.lat ?? coordinates.lat);
  const lng = Number(result.lon ?? coordinates.lng);

  if (!hasValidCoordinates({ lat, lng })) {
    return null;
  }

  return {
    lat,
    lng,
    label: normalizeLabel(
      result.display_name,
      formatCoordinateFallbackLabel(coordinates)
    ),
  };
}
