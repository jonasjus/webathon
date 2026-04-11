"use client";

import { divIcon, type DivIcon } from "leaflet";

interface CreateMapPinIconOptions {
  color: string;
  selected?: boolean;
  size?: "default" | "large";
}

export function createMapPinIcon({
  color,
  selected = false,
  size = "default",
}: CreateMapPinIconOptions): DivIcon {
  const classes = [
    "map-pin",
    size === "large" ? "map-pin--large" : "",
    selected ? "map-pin--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconWidth = size === "large" ? 42 : 34;
  const iconHeight = size === "large" ? 56 : 46;

  return divIcon({
    className: "map-pin-icon",
    html: `<span class="${classes}" style="--map-pin-color:${color}">
      <span class="map-pin__halo"></span>
      <span class="map-pin__body"></span>
      <span class="map-pin__dot"></span>
    </span>`,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight],
    tooltipAnchor: [0, -iconHeight + 4],
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function estimateTextPinWidth(label: string): number {
  return Math.min(228, Math.max(92, Math.round(label.length * 7.1 + 34)));
}

export function createMapTextPinIcon({
  color,
  selected = false,
  label,
}: {
  color: string;
  selected?: boolean;
  label: string;
}): DivIcon {
  const safeLabel = escapeHtml(label);
  const iconWidth = estimateTextPinWidth(label);
  const iconHeight = 46;
  const classes = [
    "map-text-pin",
    selected ? "map-text-pin--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return divIcon({
    className: "map-text-pin-icon",
    html: `<span class="${classes}" style="--map-pin-color:${color}">
      <span class="map-text-pin__body">
        <span class="map-text-pin__dot"></span>
        <span class="map-text-pin__label">${safeLabel}</span>
      </span>
      <span class="map-text-pin__tail"></span>
    </span>`,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight],
    popupAnchor: [0, -iconHeight + 12],
  });
}
