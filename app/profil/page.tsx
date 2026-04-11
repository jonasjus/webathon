import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Du må være logget inn for å åpne profilen din."
      )}`
    );
  }

  redirect(`/profil/${user.id}`);
}
