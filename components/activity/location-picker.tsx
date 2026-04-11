"use client";

import dynamic from "next/dynamic";
import { LoaderCircle, MapPin, Search } from "lucide-react";
import { useRef, useState } from "react";
import type { GeocodedLocation, MapCoordinates } from "@/lib/map";
import { formatCoordinateFallbackLabel } from "@/lib/map";

interface LocationPickerProps {
  coordinates: MapCoordinates | null;
  disabled?: boolean;
  inputClassName: string;
  value: string;
  onCoordinatesChange: (coordinates: MapCoordinates | null) => void;
  onValueChange: (value: string) => void;
}

const DynamicLocationPickerMap = dynamic(
  () =>
    import("./location-picker-map").then((module) => module.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--ink-muted)]">
        Laster kart…
      </div>
    ),
  }
);

async function parseGeocodingResponse(response: Response): Promise<GeocodedLocation> {
  const payload = (await response.json()) as {
    error?: string;
    label?: string;
    lat?: number;
    lng?: number;
  };

  if (!response.ok || typeof payload.lat !== "number" || typeof payload.lng !== "number") {
    throw new Error(payload.error ?? "Karttjenesten svarte ikke.");
  }

  return {
    label: payload.label ?? "",
    lat: payload.lat,
    lng: payload.lng,
  };
}

export function LocationPicker({
  coordinates,
  disabled = false,
  inputClassName,
  value,
  onCoordinatesChange,
  onValueChange,
}: LocationPickerProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingPin, setIsResolvingPin] = useState(false);
  const reverseLookupIdRef = useRef(0);

  async function handleSearch() {
    const query = value.trim();

    if (!query) {
      setErrorMessage("Skriv inn en adresse eller sett et pin på kartet.");
      return;
    }

    setErrorMessage(null);
    setIsSearching(true);

    try {
      const result = await parseGeocodingResponse(
        await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
        })
      );

      onCoordinatesChange({ lat: result.lat, lng: result.lng });
      onValueChange(result.label || query);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Fant ikke adressen på kartet."
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function resolveCoordinates(nextCoordinates: MapCoordinates) {
    const lookupId = reverseLookupIdRef.current + 1;
    reverseLookupIdRef.current = lookupId;

    setErrorMessage(null);
    setIsResolvingPin(true);

    try {
      const result = await parseGeocodingResponse(
        await fetch(
          `/api/geocode/reverse?lat=${nextCoordinates.lat}&lng=${nextCoordinates.lng}`,
          { cache: "no-store" }
        )
      );

      if (reverseLookupIdRef.current === lookupId) {
        onValueChange(result.label || formatCoordinateFallbackLabel(nextCoordinates));
      }
    } catch {
      if (reverseLookupIdRef.current === lookupId) {
        onValueChange(formatCoordinateFallbackLabel(nextCoordinates));
      }
    } finally {
      if (reverseLookupIdRef.current === lookupId) {
        setIsResolvingPin(false);
      }
    }
  }

  function handleSelectCoordinates(nextCoordinates: MapCoordinates) {
    onCoordinatesChange(nextCoordinates);
    void resolveCoordinates(nextCoordinates);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--ink)]">
            Sted eller adresse
          </label>
          <input
            name="location"
            value={value}
            onChange={(event) => {
              reverseLookupIdRef.current += 1;
              setErrorMessage(null);
              setIsResolvingPin(false);
              onValueChange(event.target.value);
              onCoordinatesChange(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSearch();
              }
            }}
            placeholder="Frognerparken, Bergen sentrum eller klikk i kartet"
            className={inputClassName}
            disabled={disabled}
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSearch()}
          disabled={disabled || isSearching}
          className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Finn på kartet
        </button>
      </div>

      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
            <MapPin className="h-3.5 w-3.5" />
            Klikk i kartet eller dra pinnen for å velge sted
          </span>
          {coordinates ? (
            <span className="rounded-full bg-[var(--surface)] px-3 py-1">
              {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
            </span>
          ) : null}
          {isResolvingPin ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              Oppdaterer adresse…
            </span>
          ) : null}
        </div>

        <div className="h-72 overflow-hidden rounded-[20px] border border-[var(--border)]">
          <DynamicLocationPickerMap
            coordinates={coordinates}
            disabled={disabled}
            onSelectCoordinates={handleSelectCoordinates}
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-[#a64532]">{errorMessage}</p>
      ) : (
        <p className="text-xs leading-5 text-[var(--ink-muted)]">
          Du kan sende inn skjemaet med bare adresse eller bare pin. Hvis én av
          delene mangler, fyller vi inn resten automatisk.
        </p>
      )}
    </div>
  );
}
