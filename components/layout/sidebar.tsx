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
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
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

          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[var(--ink)]">
            VENUE
          </h1>
        </div>
      </div>

      <nav
        className="mt-8 flex-1 space-y-2 overflow-y-auto pr-1"
        aria-label="Hovednavigasjon"
      >
        {navigation.map((item) => {
          const isActive = item.label === activeItem;
          const Icon = item.icon;
          const className = `group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
            isActive
              ? "bg-[var(--sage-50)] text-[var(--sage-700)]"
              : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
          }`;

          const content = (
            <>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                  isActive
                    ? "bg-[var(--sage-500)] text-white shadow-sm"
                    : "bg-[var(--surface-muted)] text-[var(--ink-muted)] group-hover:bg-white group-hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive ? (
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--sage-500)]" />
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

      <div className="mt-6 flex-shrink-0">
        {user ? (
          <div className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
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
                <p className="text-xs text-[var(--ink-subtle)]">Din profil er aktiv</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
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
            className="flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--sage-500)] text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            Logg inn
          </Link>
        )}
      </div>
    </aside>
  );
}
