import Link from "next/link";
import { redirect } from "next/navigation";
import { DisplayNamePanel, PasswordPanel } from "@/components/account/account-panels";
import { Avatar } from "@/components/account/avatar";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { DeleteAccountForm } from "@/components/account/delete-account-form";
import { CategoryTag } from "@/components/activity/category-tag";
import { Sidebar } from "@/components/layout/sidebar";
import { getActivities } from "@/lib/activities";
import { buildAppUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import type { Activity, SportCategory } from "@/lib/supabase/types";
import { InsightCard } from "./_components/insight-card";
import { ProfileActivityCard } from "./_components/profile-activity-card";
import { ProfileStat } from "./_components/profile-stat";
import { QuickLink } from "./_components/quick-link";

interface ProfilePageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { error, success } = await searchParams;
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

  const [{ data: profile }, activities] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    getActivities(),
  ]);

  const currentUser = buildAppUser(user, profile ?? null);
  const myActivities = activities.filter(
    (activity) => activity.hostUserId === user.id || activity.isJoined
  );
  const hostedActivities = myActivities.filter(
    (activity) => activity.hostUserId === user.id
  );
  const joinedActivities = myActivities.filter(
    (activity) => activity.hostUserId !== user.id && activity.isJoined
  );
  const favoriteCategories = getTopCategories(myActivities);
  const nextActivity = myActivities[0] ?? null;
  const totalHostedParticipants = hostedActivities.reduce(
    (total, activity) => total + activity.participantsCurrent,
    0
  );
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("nb-NO", {
        month: "long",
        year: "numeric",
      })
    : "nå";

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <Sidebar activeItem="Profil" user={currentUser} />
        </div>

        <div className="flex flex-col gap-6">
          <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[linear-gradient(150deg,rgba(142,107,177,0.12),rgba(95,168,211,0.14),rgba(255,255,255,0.96))] p-6 shadow-[var(--shadow-card-strong)] sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_340px]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink-subtle)]">
                  Profil
                </p>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end">
                  <Avatar
                    src={currentUser.avatarUrl}
                    initials={currentUser.initials}
                    color={currentUser.avatarColor}
                    size={108}
                    className="shadow-[var(--shadow-card-strong)]"
                  />

                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
                      {currentUser.displayName}
                    </h1>
                    <p className="mt-2 text-base text-[var(--ink-muted)]">
                      {currentUser.email}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-muted)]">
                      Medlem siden {memberSince}.{" "}
                      {getProfileSummary(hostedActivities.length, joinedActivities.length)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ProfileStat label="Planer" value={myActivities.length} />
                  <ProfileStat label="Arrangerer" value={hostedActivities.length} />
                  <ProfileStat label="Deltar" value={joinedActivities.length} />
                  <ProfileStat label="Reach" value={totalHostedParticipants} />
                </div>
              </div>

              <section className="rounded-[28px] border border-white/60 bg-white/80 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-subtle)]">
                  Preferanser
                </p>
                <p className="card-copy mt-3 text-[15px]">
                  Her ser du hva slags aktiviteter du oftest trekkes mot, og hvor du raskest kan justere profilen din.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {favoriteCategories.length > 0 ? (
                    favoriteCategories.map((category) => (
                      <CategoryTag key={category} category={category} />
                    ))
                  ) : (
                    <p className="text-sm text-[var(--ink-muted)]">
                      Preferansene dine bygges så snart du blir med på eller oppretter aktiviteter.
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <QuickLink
                    href="/mine-aktiviteter"
                    title="Mine aktiviteter"
                    description="Se alle økter du arrangerer eller deltar i."
                  />
                  <QuickLink
                    href="/meldinger"
                    title="Meldinger"
                    description="Åpne gruppechattene til aktivitetene dine."
                  />
                  <QuickLink
                    href="/instillinger"
                    title="Konto og sikkerhet"
                    description="Gå til den separate innstillingssiden ved behov."
                  />
                </div>
              </section>
            </div>
          </section>

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

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
            <div className="space-y-6">
              <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
                <h2 className="card-title text-[2rem] text-[var(--ink)]">
                  Din aktivitetsprofil
                </h2>
                <p className="card-copy mt-3 text-[15px]">
                  En rask oversikt over hvordan du bruker Puls akkurat nå.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InsightCard
                    title="Foretrukket stil"
                    body={
                      favoriteCategories.length > 0
                        ? "Du trekkes mot disse aktivitetene akkurat nå."
                        : "Profilen din er klar for første preferanse."
                    }
                  >
                    <div className="mt-3 flex flex-wrap gap-2">
                      {favoriteCategories.length > 0 ? (
                        favoriteCategories.map((category) => (
                          <CategoryTag key={category} category={category} />
                        ))
                      ) : (
                        <span className="text-sm text-[var(--ink-muted)]">
                          Ingen mønster enda
                        </span>
                      )}
                    </div>
                  </InsightCard>

                  <InsightCard
                    title="Neste aktivitet"
                    body={
                      nextActivity
                        ? `${nextActivity.date} kl. ${nextActivity.time}`
                        : "Ingen kommende aktivitet registrert enda."
                    }
                  >
                    {nextActivity ? (
                      <div className="mt-3 space-y-1">
                        <p className="card-title text-base text-[var(--ink)]">
                          {nextActivity.title}
                        </p>
                        <p className="card-copy text-sm">
                          {nextActivity.location}
                        </p>
                      </div>
                    ) : null}
                  </InsightCard>

                  <InsightCard
                    title="Profilsignal"
                    body={getMomentumSummary(hostedActivities.length, joinedActivities.length)}
                  >
                    <div className="mt-3 text-sm text-[var(--ink-muted)]">
                      {hostedActivities.length > 0
                        ? "Du skaper aktivitet for andre og setter tempoet i nettverket ditt."
                        : "Når du starter din første aktivitet, får profilen din et tydeligere vertskapspreg."}
                    </div>
                  </InsightCard>
                </div>
              </section>

              <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
                <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--ink-muted)]">
                      Kommende aktiviteter
                    </p>
                    <h2 className="card-title mt-1 text-[2rem] text-[var(--ink)]">
                      Din neste plan
                    </h2>
                  </div>
                  <Link
                    href="/mine-aktiviteter"
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                  >
                    Se alle aktivitetene dine
                  </Link>
                </div>

                {myActivities.length === 0 ? (
                  <div className="mt-6 rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-12 text-center">
                    <h3 className="card-title text-[1.7rem] text-[var(--ink)]">
                      Profilen din venter på første aktivitet
                    </h3>
                    <p className="card-copy mt-3 text-[15px]">
                      Bli med på en aktivitet fra hjem-siden, eller opprett en ny for å fylle ut profilen din.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {myActivities.slice(0, 3).map((activity) => (
                      <ProfileActivityCard
                        key={activity.id}
                        activity={activity}
                        currentUserId={user.id}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
                <h2 className="card-title text-[1.45rem] text-[var(--ink)]">
                  Profilbilde
                </h2>
                <p className="card-copy mt-2 text-[15px]">
                  Bytt avataren din direkte her slik at andre kjenner deg igjen i aktivitetene og meldingene.
                </p>
                <div className="mt-5">
                  <AvatarUpload
                    userId={user.id}
                    currentSrc={currentUser.avatarUrl}
                    initials={currentUser.initials}
                    color={currentUser.avatarColor}
                  />
                </div>
              </section>

              <DisplayNamePanel
                displayName={currentUser.displayName}
                redirectPath="/profil"
                title="Rediger profilen"
                description="Oppdater navnet ditt slik at profilen og aktivitetene dine føles konsistente."
              />

              <PasswordPanel
                redirectPath="/profil"
                title="Passord"
                description="Hold profilen trygg uten å forlate profilsiden."
              />

              <section className="rounded-[32px] border border-red-200 bg-[color:rgba(239,68,68,0.04)] p-5 shadow-[var(--shadow-card)]">
                <h2 className="card-title text-[1.45rem] text-red-950">Slett konto</h2>
                <p className="mt-3 text-[15px] leading-7 text-gray-700">
                  Dette fjerner kontoen din permanent, inkludert aktiviteter, deltakelser og profildata.
                </p>
                <div className="mt-5">
                  <DeleteAccountForm redirectPath="/profil" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getTopCategories(activities: Activity[], limit = 3) {
  const counts = new Map<SportCategory, number>();
  for (const activity of activities) {
    counts.set(activity.category, (counts.get(activity.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([category]) => category);
}

function getProfileSummary(hostedCount: number, joinedCount: number) {
  if (hostedCount > 0 && joinedCount > 0) {
    return "Du både arrangerer egne økter og dukker opp hos andre.";
  }
  if (hostedCount > 0) {
    return "Du bygger profilen din som vert og samler folk rundt egne økter.";
  }
  if (joinedCount > 0) {
    return "Du bruker profilen din til å finne gode aktiviteter å bli med på.";
  }
  return "Profilen din er klar til å fylles med den første aktiviteten.";
}

function getMomentumSummary(hostedCount: number, joinedCount: number) {
  if (hostedCount > joinedCount && hostedCount > 0) {
    return "Du fremstår som en tydelig arrangør.";
  }
  if (joinedCount > 0) {
    return "Du er mest i deltaker-modus akkurat nå.";
  }
  return "Du er i oppstartsfasen og kan forme profilen slik du vil.";
}
