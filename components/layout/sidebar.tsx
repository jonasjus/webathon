import Link from "next/link";
import {
  Calendar,
  Home,
  Map,
  MessageCircle,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/account/avatar";
import { signOut } from "@/lib/actions/auth";
import { SidebarMessagesIndicator } from "@/components/layout/sidebar-messages-indicator";

const baseNavigation: ReadonlyArray<{
  label: string;
  href?: string;
  icon: LucideIcon;
}> = [
  { label: "Hjem", href: "/", icon: Home },
  { label: "Profil", icon: User },
  { label: "Mine arrangementer", href: "/mine-aktiviteter", icon: Calendar },
  { label: "Meldinger", href: "/meldinger", icon: MessageCircle },
  { label: "Kart", href: "/kart", icon: Map },
  { label: "Innstillinger", href: "/instillinger", icon: Settings },
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
  const profileHref = user?.id ? `/profil/${user.id}` : "/profil";
  const navigation = baseNavigation.map((item) =>
    item.label === "Profil" ? { ...item, href: profileHref } : item
  );

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-[clamp(1rem,1.3vw,1.25rem)] shadow-[var(--shadow-card)] xl:h-[calc(100dvh-3rem)]">
      <div className="shrink-0 rounded-[24px] bg-[linear-gradient(160deg,rgba(122,160,96,0.18),rgba(95,168,211,0.14),rgba(255,255,255,0.95))] p-[clamp(0.875rem,1.1vw,1rem)]">
        <div className="flex flex-col items-center gap-[clamp(0.75rem,1.5vh,1rem)] py-[clamp(0.125rem,0.8vh,0.5rem)] text-center">
          <div className="flex h-[clamp(3rem,7vh,4rem)] w-[clamp(3rem,7vh,4rem)] items-center justify-center rounded-[22px] border border-dashed border-[var(--sage-400)] bg-white/70 text-[clamp(0.55rem,1.1vh,0.625rem)] font-semibold uppercase tracking-[0.22em] text-[var(--ink-subtle)] shadow-sm">
            Logo
          </div>

          <h1 className="text-[clamp(2rem,4.8vh,2.25rem)] font-semibold tracking-[-0.06em] text-[var(--ink)]">
            VENUE
          </h1>
        </div>
      </div>

      <nav
        className="mt-[clamp(1rem,2.4vh,2rem)] flex-1 space-y-[clamp(0.375rem,0.9vh,0.5rem)] overflow-y-auto pr-1"
        aria-label="Hovednavigasjon"
      >
        {navigation.map((item) => {
          const isActive = item.label === activeItem;
          const Icon = item.icon;
          const className = `group flex w-full items-center gap-[clamp(0.625rem,1.2vw,0.75rem)] rounded-2xl px-[clamp(0.75rem,1vw,0.875rem)] py-[clamp(0.625rem,1.5vh,0.75rem)] text-left text-[clamp(0.8125rem,1.6vh,0.875rem)] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
            isActive
              ? "bg-[var(--sage-50)] text-[var(--sage-700)]"
              : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
          }`;

          const content = (
            <>
              <span
                className={`flex h-[clamp(2.25rem,4.5vh,2.5rem)] w-[clamp(2.25rem,4.5vh,2.5rem)] items-center justify-center rounded-2xl transition ${
                  isActive
                    ? "bg-[var(--sage-500)] text-white shadow-sm"
                    : "bg-[var(--surface-muted)] text-[var(--ink-muted)] group-hover:bg-white group-hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="h-[clamp(0.875rem,1.8vh,1rem)] w-[clamp(0.875rem,1.8vh,1rem)]" />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.label === "Meldinger" ? (
                <SidebarMessagesIndicator currentUserId={user?.id ?? null} />
              ) : null}
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

      <div className="mt-[clamp(1rem,2vh,1.5rem)] flex-shrink-0">
        {user ? (
          <div className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-[clamp(0.875rem,1vw,1rem)]">
            <div className="flex items-center gap-[clamp(0.625rem,1vw,0.75rem)]">
              <Avatar
                src={user.avatarUrl}
                initials={user.initials}
                color={user.avatarColor}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--ink)]">
                  {user.displayName}
                </p>
                <p className="text-xs text-[var(--ink-subtle)]">Din profil er aktiv</p>
              </div>
            </div>

            <div className="mt-[clamp(0.75rem,1.5vh,1rem)] flex items-center justify-between gap-[clamp(0.625rem,1vw,0.75rem)]">
              <Link
                href={profileHref}
                className="text-sm font-medium text-[var(--sage-700)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
              >
                Åpne profil
              </Link>
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
        ) : (
          <Link
            href="/login"
            className="flex h-[clamp(2.75rem,5vh,2.875rem)] w-full items-center justify-center rounded-2xl border border-[var(--sage-500)] text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            Logg inn
          </Link>
        )}
      </div>
    </aside>
  );
}
