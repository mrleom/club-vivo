import Link from "next/link";
import type { ReactNode } from "react";
import { CoachPrimaryNav } from "./CoachPrimaryNav";
import { roleLabel } from "../../lib/platform-navigation";

export function CoachAppShell({ children, coachIdentity, role }: {
  children: ReactNode;
  coachIdentity: string | null;
  role: string;
}) {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <a href="#workspace-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3 focus:text-teal-900">Skip to content</a>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="club-vivo-shell rounded-[2rem] border px-6 py-6 backdrop-blur sm:px-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Link href="/home" prefetch={false} className="platform-link text-2xl font-black tracking-tight text-teal-950">CLUB VIVO<span className="ml-1 text-amber-600" aria-hidden="true">.</span></Link>
                <p className="mt-1 text-xs font-medium text-slate-600">Sports &amp; Business Intelligence</p>
              </div>
              <div className="flex flex-col items-start gap-1 text-sm lg:items-end">
                <p className="max-w-56 truncate font-medium text-slate-700" title={coachIdentity || undefined}>{coachIdentity || "Signed-in member"}</p>
                <p className="text-xs text-slate-500">{roleLabel(role)}</p>
                <Link href="/logout" prefetch={false} className="platform-link font-medium text-slate-500 hover:text-slate-700 hover:underline">Log out</Link>
              </div>
            </div>
            <div className="border-t border-slate-200/80 pt-4"><CoachPrimaryNav role={role} /></div>
          </div>
        </header>
        <main id="workspace-content" tabIndex={-1} className="mx-auto w-full max-w-6xl pb-2">{children}</main>
      </div>
    </div>
  );
}
