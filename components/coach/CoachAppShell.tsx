"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CoachPrimaryNav } from "./CoachPrimaryNav";
import { roleLabel } from "../../lib/platform-navigation";

export function CoachAppShell({ children, coachIdentity, role }: {
  children: ReactNode;
  coachIdentity: string | null;
  role: string;
}) {
  const pathname = usePathname();
  const isDashboard = ["/home", "/applications", "/tie", "/organization"].some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  return (
    <div className="cv-app min-h-screen bg-[#080d19] text-slate-100">
      <a href="#workspace-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-200 focus:px-4 focus:py-3 focus:text-slate-950">Skip to content</a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#263249] bg-[#0b1220] px-5 py-7 lg:flex">
        <Link href="/home" prefetch={false} className="platform-link mb-11 flex items-center gap-3" aria-label="Club Vivo home">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-600/40 bg-[#12313a] text-xl font-black text-[#6ae4e0]">V</span>
          <span><span className="block text-xl font-extrabold tracking-[0.06em]">CLUB VIVO</span><span className="mt-1 block text-[9px] font-semibold tracking-[0.16em] text-slate-400">SPORTS & BUSINESS INTELLIGENCE</span></span>
        </Link>
        <CoachPrimaryNav role={role} mode="desktop" />
        <div className="mt-auto border-t border-[#263249] pt-5">
          <div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2 w-2 rounded-full bg-[#6ae4e0]" />Your club workspace</div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Connected people. Better decisions.</p>
          <Link href="/logout" prefetch={false} className="platform-link mt-4 inline-flex text-sm font-medium text-slate-300 hover:text-[#6ae4e0]">Sign out →</Link>
        </div>
      </aside>
      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 border-b border-[#253249] bg-[#0c1423]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium tracking-[0.04em] text-slate-400">Club Vivo <span className="px-2 text-slate-600">/</span> <span className="text-slate-100">{isDashboard ? "Workspace" : "TIE"}</span></div>
              <Link href="/home" className="mt-1 inline-block text-lg font-bold tracking-tight text-white lg:hidden">CLUB VIVO<span className="text-[#6ae4e0]">.</span></Link>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#20293e] text-sm font-bold text-[#b7a3ff]" aria-hidden="true">{(coachIdentity || "M").trim().charAt(0).toUpperCase()}</span>
              <span><span className="block max-w-36 truncate text-xs font-semibold text-white sm:max-w-56" title={coachIdentity || undefined}>{coachIdentity || "Signed-in member"}</span><span className="mt-1 block text-[11px] text-slate-400">{roleLabel(role)}</span></span>
              <Link href="/logout" prefetch={false} className="platform-link ml-2 text-xs text-[#6ae4e0] lg:hidden">Sign out</Link>
            </div>
          </div>
          <div className="mt-4 lg:hidden"><CoachPrimaryNav role={role} mode="mobile" /></div>
        </header>
        <main id="workspace-content" tabIndex={-1}
          className={"min-h-[calc(100vh-90px)] px-4 py-7 sm:px-8 sm:py-9 lg:px-10 " + (isDashboard ? "bg-[#080d19]" : "bg-[#f4f7fb]")}>
          <div className="mx-auto w-full max-w-[1380px]">{children}</div>
        </main>
      </div>
    </div>
  );
}