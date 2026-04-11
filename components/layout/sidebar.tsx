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
    <aside className="flex h-full min-h-0 flex-col border-b border-[var(--border)] bg-[var(--sidebar-surface)] px-4 py-4 xl:border-b-0 xl:border-r xl:px-4 xl:py-5 xl:pr-5">
      <div className="w-full border-b border-[var(--border)] pb-5">
        <Image
          src="/full_venue_logo_cropped.png"
          alt="Venue logo"
          width={1024}
          height={1024}
          sizes="(min-width: 1280px) 248px, 100vw"
          priority
          className="mx-auto h-auto w-[92%] object-contain"
        />
      </div>

      <nav
        className="mt-5 flex-1 space-y-1.5 overflow-y-auto pr-2"
        aria-label="Hovednavigasjon"
      >
        {navigation.map((item) => {
          const isActive = item.label === activeItem;
          const Icon = item.icon;
          const className = `group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
            isActive
              ? "border-[var(--sidebar-active-border)] bg-[var(--sidebar-active-bg)] text-[var(--ink)] shadow-[var(--shadow-card)]"
              : "border-transparent text-[var(--ink-muted)] hover:border-[var(--border)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--ink)]"
          }`;

          const content = (
            <>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  isActive
                    ? "border-[var(--sidebar-active-border)] bg-[var(--surface-muted)] text-[var(--sage-700)]"
                    : "border-transparent bg-transparent text-[var(--ink-subtle)] group-hover:border-[var(--border)] group-hover:bg-[var(--surface)] group-hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">{item.label}</span>
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

      <div className="mt-6 flex-shrink-0 border-t border-[var(--border)] pt-5">
        {user ? (
          <div className="w-full">
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
                <p className="text-xs text-[var(--ink-subtle)]">
                  Din profil er aktiv
                </p>
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
            className="flex h-11 w-full items-center justify-center rounded-xl border border-[var(--sage-500)] text-sm font-semibold text-[var(--sage-700)] transition hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
          >
            Logg inn
          </Link>
        )}
      </div>
    </aside>
  );
}
