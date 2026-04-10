import { InteractiveMap } from "./components/interactive-map";

export default function Home() {
  const navigation = [
    "Hjem",
    "Utforsk",
    "Meldinger",
    "Turneringer",
    "Lag",
  ];

  const activities = [
    {
      title: "Etter-jobb padel på Vulkan",
      category: "Padel",
      date: "Tor 10. april",
      time: "18:30 - 20:00",
      description:
        "Åpen miks med middels nivå, fokus på raske matcher og god flyt. To baner er reservert.",
      participants: "12 deltakere",
      host: "Arrangert av Nora",
      accent: "from-[#f6dfc7] via-[#fff9f2] to-[#ffffff]",
      badge: "Populær",
    },
    {
      title: "Morgenløp rundt Sognsvann",
      category: "Løping",
      date: "Fre 11. april",
      time: "07:15 - 08:00",
      description:
        "Rolig sosial tur med to tempo-grupper. Perfekt for å starte dagen med litt puls og kaffe etterpå.",
      participants: "8 deltakere",
      host: "Vertskap: Elias",
      accent: "from-[#dcefdc] via-[#f8fdf8] to-[#ffffff]",
      badge: "Nytt",
    },
    {
      title: "Søndag futsal i Bjørvika-hallen",
      category: "Futsal",
      date: "Søn 13. april",
      time: "16:00 - 17:30",
      description:
        "Teknisk og sosial økt med rullerende lag. Vi trenger to spillere til for full tropp.",
      participants: "14 deltakere",
      host: "Koordinert av Mikael",
      accent: "from-[#d8e9ff] via-[#f7fbff] to-[#ffffff]",
      badge: "Snart fullt",
    },
  ];

  const suggestions = [
    {
      name: "Ingrid Solheim",
      sport: "Tennis og yoga",
      mutuals: "9 felles venner",
      initials: "IS",
      tone: "from-[#d8eadb] to-[#f7fbf8]",
    },
    {
      name: "Henrik Aasen",
      sport: "Løpeklubb",
      mutuals: "5 felles venner",
      initials: "HA",
      tone: "from-[#ffe4cd] to-[#fff8f2]",
    },
    {
      name: "Sara Lunde",
      sport: "Padel og styrke",
      mutuals: "3 felles venner",
      initials: "SL",
      tone: "from-[#dde8ff] to-[#f8faff]",
    },
  ];

  const quickStats = [
    { label: "Dine neste", value: "4 aktiviteter" },
    { label: "Nye invitasjoner", value: "11 foreslått" },
    { label: "Nær deg", value: "26 spillere" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[8%] h-56 w-56 rounded-full bg-[rgba(135,191,149,0.18)] blur-3xl" />
        <div className="absolute bottom-[8%] right-[6%] h-72 w-72 rounded-full bg-[rgba(255,198,157,0.20)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1560px] flex-col gap-6 xl:flex-row">
        <aside className="w-full rounded-[32px] border border-white/70 bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_24px_80px_rgba(33,44,39,0.08)] backdrop-blur xl:min-h-full xl:w-[260px]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#3c7553,_#5e9e78)] text-lg font-semibold text-white shadow-[0_14px_36px_rgba(60,117,83,0.32)]">
              P
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Sosial sport
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Puls
              </h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  index === 0
                    ? "bg-[var(--sage)] text-white shadow-[0_16px_36px_rgba(60,117,83,0.28)]"
                    : "text-[var(--ink)] hover:bg-[var(--sage-soft)]"
                }`}
              >
                <span>{item}</span>
                <span className="text-xs opacity-70">0{index + 1}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-[28px] bg-[linear-gradient(180deg,_rgba(246,250,247,0.98),_rgba(255,255,255,0.92))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Denne uken
            </p>
            <div className="mt-4 space-y-4">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white px-4 py-3 shadow-[0_10px_28px_rgba(38,49,43,0.06)]">
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                  <p className="mt-1 text-base font-semibold text-[var(--ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[28px] bg-[var(--ink)] p-5 text-white">
            <p className="text-sm font-medium text-white/90">Teamboost</p>
            <h2 className="mt-2 text-xl font-semibold leading-8">
              Lag en privat økt og inviter favorittgjengen.
            </h2>
            <button
              type="button"
              className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--sand)]"
            >
              Opprett aktivitet
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(33,44,39,0.08)] backdrop-blur sm:p-7 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-[rgba(44,63,54,0.08)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--muted)]">
                Oslo akkurat nå
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                Aktivitetsstrøm
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Oppdag sosiale sportsaktiviteter, se hvem som blir med og finn raske muligheter for å hoppe inn i dagens økter.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[var(--ink)] shadow-[0_10px_24px_rgba(33,44,39,0.06)] transition hover:bg-[var(--sage-soft)]"
              >
                Denne uken
              </button>
              <button
                type="button"
                className="rounded-full bg-[var(--sand)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[#f1dbc4]"
              >
                Alle nivåer
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {activities.map((activity) => (
              <article
                key={activity.title}
                className="group grid gap-5 rounded-[32px] border border-white/80 bg-white p-5 shadow-[0_18px_50px_rgba(33,44,39,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(33,44,39,0.10)] lg:grid-cols-[210px_minmax(0,1fr)_auto]"
              >
                <div
                  className={`rounded-[26px] bg-gradient-to-br ${activity.accent} p-5`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <span className="inline-flex w-fit rounded-full bg-white/78 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                      {activity.category}
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                        <ParticipantIcon />
                        <span>{activity.participants}</span>
                      </div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {activity.badge}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[var(--sage-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sage-strong)]">
                      {activity.badge}
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {activity.host}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)]">
                    {activity.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">
                    {activity.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--ink)]">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2">
                      <CalendarIcon />
                      {activity.date}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2">
                      <ClockIcon />
                      {activity.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center lg:justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full bg-[var(--sage)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--sage-strong)] hover:shadow-[0_16px_36px_rgba(60,117,83,0.30)]"
                  >
                    Bli med
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="w-full rounded-[32px] border border-white/70 bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_24px_80px_rgba(33,44,39,0.08)] backdrop-blur xl:w-[340px]">
          <InteractiveMap />

          <section className="mt-6 rounded-[28px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,248,0.98))] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                  Nettverk
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--ink)]">
                  Foreslåtte venner
                </h3>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-[var(--sage-strong)] transition hover:text-[var(--ink)]"
              >
                Se alle
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {suggestions.map((friend) => (
                <article
                  key={friend.name}
                  className="rounded-[24px] bg-white p-4 shadow-[0_12px_32px_rgba(32,45,38,0.06)]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${friend.tone} text-sm font-semibold text-[var(--ink)]`}
                    >
                      {friend.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-semibold text-[var(--ink)]">
                        {friend.name}
                      </h4>
                      <p className="text-sm text-[var(--muted)]">{friend.sport}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                        {friend.mutuals}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full rounded-full border border-[rgba(62,90,71,0.12)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:border-transparent hover:bg-[var(--sage-soft)]"
                  >
                    Legg til venn
                  </button>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function ParticipantIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M16 19a4 4 0 0 0-8 0" />
      <circle cx="12" cy="9" r="3" />
      <path d="M20 19a4 4 0 0 0-3-3.87" />
      <path d="M17.5 6.5a2.5 2.5 0 1 1 0 5" />
      <path d="M4 19a4 4 0 0 1 3-3.87" />
      <path d="M6.5 6.5a2.5 2.5 0 1 0 0 5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}
