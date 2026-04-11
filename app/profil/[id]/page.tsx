import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getActivities } from "@/lib/activities";
import { buildAppUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { ProfileActivityCard } from "../_components/profile-activity-card";
import { ProfileHero } from "../_components/profile-hero";

interface ProfileByIdPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function ProfileByIdPage({
  params,
  searchParams,
}: ProfileByIdPageProps) {
  const { id: profileId } = await params;
  const { error, success } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Du må være logget inn for å se profiler."
      )}`
    );
  }

  const [{ data: profile }, activities, { data: participations }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
      getActivities(),
      supabase
        .from("activity_participants")
        .select("activity_id")
        .eq("user_id", profileId),
    ]);

  if (!profile) {
    notFound();
  }

  const joinedActivityIds = new Set(
    (participations ?? []).map((p) => p.activity_id)
  );
  const profileActivities = activities.filter(
    (a) => a.hostUserId === profileId || joinedActivityIds.has(a.id)
  );
  const hostedActivities = profileActivities.filter(
    (a) => a.hostUserId === profileId
  );
  const joinedActivities = profileActivities.filter(
    (a) => a.hostUserId !== profileId
  );

  const isSelf = user.id === profileId;
  const currentUser = buildAppUser(user);

  const memberSince = new Date(profile.created_at).toLocaleDateString("nb-NO", {
    month: "long",
    year: "numeric",
  });

  const totalHostedParticipants = hostedActivities.reduce(
    (total, a) => total + a.participantsCurrent,
    0
  );

  const stats = {
    planer: profileActivities.length,
    arrangerer: hostedActivities.length,
    deltar: joinedActivities.length,
    reach: totalHostedParticipants,
  };

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar activeItem="Profil" user={currentUser} />
        </div>

        <div className="flex flex-col gap-6">
          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </p>
          )}
          {success && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {decodeURIComponent(success)}
            </p>
          )}

          <ProfileHero
            userId={profileId}
            displayName={profile.display_name}
            initials={profile.initials}
            avatarColor={profile.avatar_color}
            avatarUrl={profile.avatar_url}
            bio={profile.bio}
            bannerTheme={profile.banner_theme}
            favoriteCategories={profile.favorite_categories}
            memberSince={memberSince}
            isSelf={isSelf}
            stats={stats}
          />

          {/* Activities */}
          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ink-muted)]">
                  {isSelf ? "Kommende aktiviteter" : "Aktiviteter"}
                </p>
                <h2 className="card-title text-[2rem] text-[var(--ink)]">
                  {isSelf
                    ? "Din neste plan"
                    : `${profile.display_name}s aktiviteter`}
                </h2>
              </div>
              {isSelf && (
                <Link
                  href="/mine-aktiviteter"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                >
                  Se alle aktivitetene dine
                </Link>
              )}
            </div>

            {profileActivities.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-12 text-center">
                <h3 className="card-title text-[1.7rem] text-[var(--ink)]">
                  {isSelf
                    ? "Profilen din venter på første aktivitet"
                    : "Ingen aktiviteter enda"}
                </h3>
                <p className="card-copy mt-4 text-[15px]">
                  {isSelf
                    ? "Bli med på en aktivitet fra hjem-siden, eller opprett en ny for å fylle ut profilen din."
                    : "Denne brukeren har ikke registrert noen aktiviteter enda."}
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {profileActivities.slice(0, 5).map((activity) => (
                  <ProfileActivityCard
                    key={activity.id}
                    activity={activity}
                    currentUserId={isSelf ? user.id : profileId}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
