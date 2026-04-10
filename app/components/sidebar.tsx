import Link from "next/link";
import { signOut } from "../login/actions";
import { Avatar } from "./avatar";

const navigation: ReadonlyArray<{ label: string; href?: string }> = [
  { label: "Hjem", href: "/" },
  { label: "Aktivitetsstrøm", href: "/" },
  { label: "Mine aktiviteter", href: "/mine-aktiviteter" },
  { label: "Meldinger" },
  { label: "Kart" },
  { label: "Innstillinger", href: "/instillinger" },
];

interface SidebarUser {
  id: string;
  displayName: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string | null;
}

interface SidebarProps {
  activeItem?: string;
  user?: SidebarUser | null;
}

export function Sidebar({ activeItem, user }: SidebarProps) {
  return (
    <aside className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sage-500)] text-sm font-semibold text-white">
          P
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
            Sosial sport
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--ink)]">
            Puls
          </h1>
        </div>
      </div>

      <nav className="mt-8 space-y-1.5" aria-label="Hovednavigasjon">
        {navigation.map((item) => {
          const isActive = item.label === activeItem;
          const className = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
            isActive
              ? "bg-[var(--sage-50)] text-[var(--sage-700)]"
              : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
          }`;
          const content = (
            <>
              <span
                className={`h-6 w-1 rounded-full ${
                  isActive ? "bg-[var(--sage-500)]" : "bg-transparent"
                }`}
              />
              <span>{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <button key={item.label} type="button" className={className}>
              {content}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        {user ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatarUrl}
                initials={user.initials}
                color={user.avatarColor}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--ink)]">
                  {user.displayName}
                </p>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-[var(--sage-700)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                  >
                    Logg ut
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <a
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-[var(--sage-500)] text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            Logg inn
          </a>
        )}
      </div>
    </aside>
  );
}
