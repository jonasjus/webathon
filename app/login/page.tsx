import { AuthCard } from "./_components/auth-card";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; mode?: string; success?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, mode, success } = await searchParams;
  const isSignUp = mode === "signup";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--canvas)] px-4">
      <AuthCard error={error} success={success} isSignUp={isSignUp} />
    </main>
  );
}
