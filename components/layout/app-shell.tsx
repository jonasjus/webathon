import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="app-shell bg-[var(--canvas)] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)]">
        {children}
      </div>
    </main>
  );
}

interface AppSidebarColumnProps {
  children: ReactNode;
}

export function AppSidebarColumn({ children }: AppSidebarColumnProps) {
  return <div className="app-sidebar-frame xl:sticky xl:top-6">{children}</div>;
}
