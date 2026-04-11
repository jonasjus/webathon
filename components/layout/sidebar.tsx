import Image from "next/image";
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
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-[clamp(0.8rem,1.8vh,1.25rem)] shadow-[var(--shadow-card)]">
        <div className="rounded-[24px] bg-[linear-gradient(160deg,rgba(122,160,96,0.18),rgba(95,168,211,0.14),rgba(255,255,255,0.95))] p-4">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/80 bg-white/80 p-2 shadow-sm">
            <Image
              src="/venue_logo.png"
              alt="Venue logo"
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-[clamp(2rem,4.8vh,2.25rem)] font-semibold tracking-[-0.06em] text-[var(--ink)]">
            VENUE
          </h1>
        </div>
      </div>

      <nav
        className="mt-[clamp(0.75rem,2.2vh,2rem)] flex-1 space-y-[clamp(0.2rem,0.55vh,0.5rem)] overflow-hidden"
        aria-label="Hovednavigasjon"
      >
        {navigation.map((item) => {
          const isActive = item.label === activeItem;
          const Icon = item.icon;
          const className = `group flex w-full items-center gap-[clamp(0.45rem,1.1vh,0.75rem)] rounded-2xl px-[clamp(0.45rem,1.2vh,0.75rem)] py-[clamp(0.35rem,1.05vh,0.75rem)] text-left text-[clamp(0.72rem,1.22vh,0.875rem)] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
            isActive
              ? "bg-[var(--sage-50)] text-[var(--sage-700)]"
              : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
          }`;

          const content = (
            <>
              <span
                className={`flex h-[clamp(2.67rem,4.5vh,2.5rem)] w-[clamp(2.67rem,4.5vh,2.5rem)] items-center justify-center rounded-2xl transition ${
                  isActive
                    ? "bg-[var(--sage-500)] text-white shadow-sm"
                    : "bg-[var(--surface-muted)] text-[var(--ink-muted)] group-hover:bg-white group-hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="h-[clamp(0.8rem,1.85vh,1rem)] w-[clamp(0.8rem,1.85vh,1rem)]" />
              </span>
              <span className="flex-1 text-[clamp(0.72rem,2vh,0.875rem)]">{item.label}</span>
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

      <div className="mt-[clamp(0.7rem,1.8vh,1.5rem)] flex-shrink-0">
        {user ? (
          <div className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-[clamp(0.55rem,1.6vh,1rem)]">
            <div className="flex items-center gap-[clamp(0.45rem,1.15vh,0.75rem)]">
              <Avatar
                src={user.avatarUrl}
                initials={user.initials}
                color={user.avatarColor}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[clamp(0.72rem,1.22vh,0.875rem)] font-semibold text-[var(--ink)]">
                  {user.displayName}
                </p>
                <p className="text-[clamp(0.65rem,1.05vh,0.75rem)] text-[var(--ink-subtle)]">Din profil er aktiv</p>
              </div>
            </div>

            <div className="mt-[clamp(0.45rem,1.3vh,1rem)] flex items-center justify-between gap-[clamp(0.45rem,1.15vh,0.75rem)]">
              <Link
                href={profileHref}
                className="text-[clamp(0.72rem,1.22vh,0.875rem)] font-medium text-[var(--sage-700)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
              >
                Åpne profil
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[clamp(0.72rem,1.22vh,0.875rem)] font-medium text-[var(--sage-700)] transition hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                >
                  Logg ut
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--sage-500)] text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            Logg inn
          </Link>
        )}
      </div>
    </aside>
  );
}
