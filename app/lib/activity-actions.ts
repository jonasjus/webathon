"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import type { SportCategory } from "./supabase/types";

export interface CreateActivityInput {
  title: string;
  location: string;
  startsAt: string;
  description: string;
  participantsMax: number;
  category: SportCategory;
  mapPinX: number;
  mapPinY: number;
}

export async function createActivity(input: CreateActivityInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const { error } = await supabase.from("activities").insert({
    title: input.title,
    host_user_id: user.id,
    location: input.location,
    starts_at: input.startsAt,
    description: input.description,
    participants_max: input.participantsMax,
    category: input.category,
    map_pin_x: input.mapPinX,
    map_pin_y: input.mapPinY,
  } as never);

  if (error) throw new Error(`Kunne ikke opprette aktivitet: ${error.message}`);
  revalidatePath("/");
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
  revalidatePath("/");
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
  revalidatePath("/");
}
