# Map Setup Guide

This project now uses a real interactive map built with:

- `leaflet`
- `react-leaflet`
- OpenStreetMap raster tiles
- Nominatim-compatible geocoding for address lookup and reverse lookup

No Google Maps key is required for the default setup.

## 1. Install dependencies

```bash
npm install
```

The required map packages are already in `package.json`.

## 2. Use the default open-source setup

By default, the app uses:

- OpenStreetMap tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Nominatim geocoding: `https://nominatim.openstreetmap.org`

This is enough for local development and low-volume usage.

## 3. Optional environment variables

You can override the geocoding service if you want to use your own Nominatim instance or another compatible endpoint:

```bash
GEOCODING_BASE_URL=https://nominatim.openstreetmap.org
GEOCODING_USER_AGENT=venue-webathon/1.0
```

`GEOCODING_USER_AGENT` is recommended outside local development so your deployment identifies itself clearly to the geocoding provider.

## 4. Supabase migration for existing projects

If your database still uses `map_pin_x` and `map_pin_y`, and you have already cleared the old `activities` rows, run:

1. `supabase/migrations/20260411_activity_coordinates.sql`
2. `supabase/migrations/20260411_optimize_activity_related_rls_and_indexes.sql`

For a brand-new project, `supabase/schema.sql` already contains the new `latitude` / `longitude` columns.

## 5. Attribution and usage note

OpenStreetMap attribution must stay visible on the map.

The default tile and geocoding services are public community services. They are fine for development and small demos, but if this app gets real traffic, move tiles/geocoding to your own provider or hosted infrastructure instead of leaning on the public endpoints.
