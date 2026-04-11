"use server";

import { geocodeAddress, reverseGeocodeCoordinates } from "../geocoding";
import {
  formatCoordinateFallbackLabel,
  isValidLatitude,
  isValidLongitude,
} from "../map";
import { revalidateAppContentPaths } from "../revalidate-paths";
import { createClient } from "../supabase/server";
import type { ActivityCategory } from "../supabase/types";

export interface CreateActivityInput {
  title: string;
  location: string;
  startsAt: string;
  description: string;
  participantsMax: number;
  category: ActivityCategory;
  latitude?: number | null;
  longitude?: number | null;
}

export async function createActivity(input: CreateActivityInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const title = input.title.trim();
  let location = input.location.trim();
  const description = input.description.trim();
  const participantsMax = Number(input.participantsMax);
  let latitude =
    typeof input.latitude === "number" ? Number(input.latitude) : null;
  let longitude =
    typeof input.longitude === "number" ? Number(input.longitude) : null;

  if (!title) {
    throw new Error("Tittel mangler.");
  }

  if (!description) {
    throw new Error("Beskrivelse mangler.");
  }

  if (!Number.isInteger(participantsMax) || participantsMax < 1) {
    throw new Error("Maks deltakere må være minst 1.");
  }

  if ((latitude == null || longitude == null) && !location) {
    throw new Error("Legg inn en adresse eller sett et pin på kartet.");
  }

  if (latitude != null && longitude != null) {
    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      throw new Error("Koordinatene er ugyldige.");
    }
  } else if (location) {
    const geocodedLocation = await geocodeAddress(location);

    if (!geocodedLocation) {
      throw new Error("Fant ikke adressen på kartet.");
    }

    latitude = geocodedLocation.lat;
    longitude = geocodedLocation.lng;
    location = geocodedLocation.label;
  }

  if ((latitude == null || longitude == null) && !location) {
    throw new Error("Kunne ikke fastsette en plassering for arrangementet.");
  }

  if (!location && latitude != null && longitude != null) {
    const reverseLocation = await reverseGeocodeCoordinates({
      lat: latitude,
      lng: longitude,
    });

    location =
      reverseLocation?.label ??
      formatCoordinateFallbackLabel({ lat: latitude, lng: longitude });
  }

  const { error } = await supabase.from("activities").insert({
    title,
    host_user_id: user.id,
    location,
    starts_at: input.startsAt,
    description,
    participants_max: participantsMax,
    category: input.category,
    latitude,
    longitude,
  } as never);

  if (error) throw new Error(`Kunne ikke opprette arrangement: ${error.message}`);
  revalidateAppContentPaths();
}

export interface UpdateActivityInput {
  id: string;
  title: string;
  location: string;
  startsAt: string;
  description: string;
  participantsMax: number;
  category: ActivityCategory;
  latitude?: number | null;
  longitude?: number | null;
}

export async function updateActivity(input: UpdateActivityInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const { data: existing } = await supabase
    .from("activities")
    .select("host_user_id")
    .eq("id", input.id)
    .single();

  if (!existing || (existing as { host_user_id: string }).host_user_id !== user.id) {
    throw new Error("Du kan ikke redigere dette arrangementet.");
  }

  const title = input.title.trim();
  let location = input.location.trim();
  const description = input.description.trim();
  const participantsMax = Number(input.participantsMax);
  let latitude =
    typeof input.latitude === "number" ? Number(input.latitude) : null;
  let longitude =
    typeof input.longitude === "number" ? Number(input.longitude) : null;

  if (!title) throw new Error("Tittel mangler.");
  if (!description) throw new Error("Beskrivelse mangler.");
  if (!Number.isInteger(participantsMax) || participantsMax < 1)
    throw new Error("Maks deltakere må være minst 1.");
  if ((latitude == null || longitude == null) && !location)
    throw new Error("Legg inn en adresse eller sett et pin på kartet.");

  if (latitude != null && longitude != null) {
    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      throw new Error("Koordinatene er ugyldige.");
    }
  } else if (location) {
    const geocodedLocation = await geocodeAddress(location);
    if (!geocodedLocation) throw new Error("Fant ikke adressen på kartet.");
    latitude = geocodedLocation.lat;
    longitude = geocodedLocation.lng;
    location = geocodedLocation.label;
  }

  if (!location && latitude != null && longitude != null) {
    const reverseLocation = await reverseGeocodeCoordinates({ lat: latitude, lng: longitude });
    location =
      reverseLocation?.label ??
      formatCoordinateFallbackLabel({ lat: latitude, lng: longitude });
  }

  const { error } = await supabase
    .from("activities")
    .update({
      title,
      location,
      starts_at: input.startsAt,
      description,
      participants_max: participantsMax,
      category: input.category,
      latitude,
      longitude,
    } as never)
    .eq("id", input.id);

  if (error) throw new Error(`Kunne ikke oppdatere arrangement: ${error.message}`);
  revalidateAppContentPaths();
}

export async function deleteActivity(activityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const { data: existing } = await supabase
    .from("activities")
    .select("host_user_id")
    .eq("id", activityId)
    .single();

  if (!existing || (existing as { host_user_id: string }).host_user_id !== user.id) {
    throw new Error("Du kan ikke slette dette arrangementet.");
  }

  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId);

  if (error) throw new Error(`Kunne ikke slette arrangement: ${error.message}`);
  revalidateAppContentPaths();
}

export async function joinActivity(activityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const { error } = await supabase
    .from("activity_participants")
    .insert({ activity_id: activityId, user_id: user.id } as never);

  if (error) throw new Error(`Kunne ikke melde på: ${error.message}`);
  revalidateAppContentPaths();
}

export async function leaveActivity(activityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const { error } = await supabase
    .from("activity_participants")
    .delete()
    .eq("activity_id", activityId)
    .eq("user_id", user.id);

  if (error) throw new Error(`Kunne ikke melde av: ${error.message}`);
  revalidateAppContentPaths();
}
