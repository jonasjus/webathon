"use server";

import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const displayName = (formData.get("display_name") as string).trim();
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Avatar colour cycles through a small palette based on initials hash
  const palette = ["#5FA8D3", "#F08A6E", "#F1B24A", "#8E6BB1", "#7AA060"];
  const avatarColor = palette[initials.charCodeAt(0) % palette.length];

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        display_name: displayName,
        initials,
        avatar_color: avatarColor,
      },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
