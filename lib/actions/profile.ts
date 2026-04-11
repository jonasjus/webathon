"use server";

import { redirect } from "next/navigation";
import { categoryOptions } from "@/components/activity/category-tag";
import { BANNER_PRESETS, isHexColor } from "@/lib/banner-themes";
import { revalidateAppContentPaths } from "@/lib/revalidate-paths";
import { createClient } from "@/lib/supabase/server";
import type { ActivityCategory } from "@/lib/supabase/types";

const VALID_PRESET_IDS = new Set(BANNER_PRESETS.map((p) => p.id));
const VALID_CATEGORIES = new Set<string>(categoryOptions.map((c) => c.value));

export async function updateProfileDetails(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?error=Du+må+være+logget+inn");
  }

  // Parse bio
  const rawBio = String(formData.get("bio") ?? "").trim();
  const bio = rawBio.length > 0 ? rawBio : null;

  if (bio !== null && bio.length > 280) {
    redirect(
      `/profil/${user.id}?error=${encodeURIComponent("Bio kan maks være 280 tegn.")}`
    );
  }

  // Parse banner_theme
  const rawBanner = String(formData.get("banner_theme") ?? "").trim();
  let banner_theme: string | null = null;
  if (rawBanner.length > 0) {
    if (VALID_PRESET_IDS.has(rawBanner) || isHexColor(rawBanner)) {
      banner_theme = rawBanner;
    } else {
      redirect(
        `/profil/${user.id}?error=${encodeURIComponent("Ugyldig banner-tema.")}`
      );
    }
  }

  // Parse favorite_categories
  const rawCategories = formData.getAll("favorite_categories").map(String);
  const favorite_categories = rawCategories.filter((c) =>
    VALID_CATEGORIES.has(c)
  ) as ActivityCategory[];

  if (favorite_categories.length > 3) {
    redirect(
      `/profil/${user.id}?error=${encodeURIComponent("Du kan maks velge 3 favorittkategorier.")}`
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ bio, banner_theme, favorite_categories } as never)
    .eq("id", user.id);

  if (profileError) {
    redirect(
      `/profil/${user.id}?error=${encodeURIComponent(
        `Kunne ikke lagre profilen: ${profileError.message}`
      )}`
    );
  }

  await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      bio,
      banner_theme,
      favorite_categories,
    },
  });

  revalidateAppContentPaths();
  redirect(`/profil/${user.id}?success=Profilen+er+oppdatert`);
}
