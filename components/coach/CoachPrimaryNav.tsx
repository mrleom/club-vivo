"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canUseTie, COACHING_NAVIGATION, getPlatformNavigation, isNavigationActive } from "../../lib/platform-navigation";

const iconPath: Record<string, string> = {
  Home: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  Applications: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  Organization: "M4 21V7l8-4 8 4v14M9 21v-7h6v7M4 10h16",
  TIE: "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7",
};
function NavIcon({ label }: { label: string }) {
  const key = label.startsWith("TIE") ? "TIE" : label;
  return <svg viewBox="0 0 24 24" aria-hidden="true" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" className="shrink-0"><path d={iconPath[key] || "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7"} /></svg>;
}
export function CoachPrimaryNav({ role, mode = "desktop" }: { role: string; mode?: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const isMobile = mode === "mobile";
  const inTie = isNavigationActive(pathname, "/tie");
  function navigation(items: { href: string; label: string }[], label: string) {
    return (
      <nav className={isMobile ? "flex flex-wrap gap-2" : "flex flex-col gap-1.5"} aria-label={label}>
        {items.map((item) => {
          const active = isNavigationActive(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} prefetch={false} aria-current={active ? (pathname === item.href ? "page" : "location") : undefined}
              className={"platform-link flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition " + (
                active ? "border-[#28515b] bg-[#15333c] text-[#6ae4e0]" : "border-transparent text-slate-400 hover:border-[#35435b] hover:bg-[#172237] hover:text-white"
              )}>
              <NavIcon label={item.label} /><span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }
  return (
    <div className={isMobile ? "grid gap-2" : "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto"}>
      {!isMobile && <p className="px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-500">YOUR WORKSPACE</p>}
      {navigation(getPlatformNavigation(role), "Club Vivo")}
      {canUseTie(role) && inTie ? (
        <div className={"border-t border-[#263249] pt-4 " + (isMobile ? "" : "mt-2")}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">TIE · TOOLS</p>
          {navigation(COACHING_NAVIGATION, "TIE tools")}
        </div>
      ) : null}
    </div>
  );
}