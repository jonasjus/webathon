"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAvatarColor, getInitials, normalizeDisplayName } from "../lib/profile";
import { createAdminClient } from "../lib/supabase/admin";
import { createClient } from "../lib/supabase/server";

const SETTINGS_PATH = "/instillinger";

function redirectToSettings(type: "error" | "success", message: string): never {
  redirect(`${SETTINGS_PATH}?${type}=${encodeURIComponent(message)}`);
}

function redirectToLogin(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirectToLogin("Du må være logget inn for å åpne innstillinger.");
  }

  return { supabase, user };
}

export async function updateDisplayName(formData: FormData) {
  const displayName = normalizeDisplayName(formData.get("display_name"));

  if (displayName.length < 2) {
    redirectToSettings("error", "Navnet må være minst 2 tegn.");
  }

  const { supabase, user } = await requireAuthenticatedUser();
  const initials = getInitials(displayName);
  const avatarColor =
    typeof user.user_metadata?.avatar_color === "string" &&
    user.user_metadata.avatar_color.length > 0
      ? user.user_metadata.avatar_color
      : getAvatarColor(initials);

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      display_name: displayName,
      initials,
      avatar_color: avatarColor,
    },
  });

  if (authError) {
    redirectToSettings(
      "error",
      `Kunne ikke oppdatere navnet: ${authError.message}`
    );
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
    initials,
    avatar_color: avatarColor,
  } as never);

  if (profileError) {
    redirectToSettings(
      "error",
      `Navnet ble oppdatert i kontoen, men ikke i profilen: ${profileError.message}`
    );
  }

  revalidatePath("/");
  revalidatePath(SETTINGS_PATH);
  redirectToSettings("success", "Navnet er oppdatert.");
}

export async function updatePassword(formData: FormData) {
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (newPassword.length < 6) {
    redirectToSettings("error", "Passordet må være minst 6 tegn.");
  }

  if (newPassword !== confirmPassword) {
    redirectToSettings("error", "Passordene må være like.");
  }

  const { supabase } = await requireAuthenticatedUser();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    redirectToSettings(
      "error",
      `Kunne ikke endre passordet: ${error.message}`
    );
  }

  redirectToSettings("success", "Passordet er oppdatert.");
}

export async function deleteAccount(formData: FormData) {
  const confirmation = normalizeDisplayName(formData.get("confirmation"));

  if (confirmation.toUpperCase() !== "SLETT") {
    redirectToSettings("error", "Skriv SLETT for å bekrefte kontosletting.");
  }

  const { user } = await requireAuthenticatedUser();

  let adminClient;

  try {
    adminClient = createAdminClient();
  } catch (error) {
    redirectToSettings(
      "error",
      error instanceof Error ? error.message : "Klarte ikke å opprette admin-klient."
    );
  }

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    redirectToSettings("error", `Kunne ikke slette kontoen: ${error.message}`);
  }

  const cookieStore = await cookies();

  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      cookieStore.delete(cookie.name);
    }
  });

  revalidatePath("/");
  redirect(`/login?success=${encodeURIComponent("Kontoen er slettet.")}`);
}
