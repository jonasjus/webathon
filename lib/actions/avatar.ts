"use server";

import { revalidateAppContentPaths } from "../revalidate-paths";
import { createClient } from "../supabase/server";

export async function updateAvatarUrl(url: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke innlogget");

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: url } as never)
    .eq("id", user.id);

  if (error) throw new Error(`Kunne ikke oppdatere avatar: ${error.message}`);

  await supabase.auth.updateUser({ data: { avatar_url: url } });

  revalidateAppContentPaths();
}
