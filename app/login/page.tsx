import { signIn, signUp } from "./actions";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; mode?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, mode } = await searchParams;
  const isSignUp = mode === "signup";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--canvas)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {isSignUp ? "Opprett konto" : "Logg inn"}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {isSignUp
            ? "Lag en konto for å opprette og delta i aktiviteter."
            : "Logg inn for å delta i aktiviteter."}
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {decodeURIComponent(error)}
          </p>
        )}

        <form
          action={isSignUp ? signUp : signIn}
          className="mt-6 flex flex-col gap-4"
        >
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="display_name"
                className="text-sm font-medium text-[var(--ink)]"
              >
                Navn
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Lars Eriksen"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none ring-0 placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--ink)]"
            >
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="lars@eksempel.no"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none ring-0 placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--ink)]"
            >
              Passord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={6}
              placeholder="Minst 6 tegn"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none ring-0 placeholder:text-[var(--ink-subtle)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-600)] focus:ring-offset-2"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--sage-500)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            {isSignUp ? "Opprett konto" : "Logg inn"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--ink-muted)]">
          {isSignUp ? (
            <>
              Har du allerede konto?{" "}
              <a
                href="/login"
                className="font-medium text-[var(--sage-700)] hover:underline"
              >
                Logg inn
              </a>
            </>
          ) : (
            <>
              Ny bruker?{" "}
              <a
                href="/login?mode=signup"
                className="font-medium text-[var(--sage-700)] hover:underline"
              >
                Opprett konto
              </a>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
