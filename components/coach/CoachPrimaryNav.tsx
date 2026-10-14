"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canUseTie, COACHING_NAVIGATION, getPlatformNavigation, isNavigationActive } from "../../lib/platform-navigation";

export function CoachPrimaryNav({ role }: { role: string }) {
  const pathname = usePathname();
  const inTie = isNavigationActive(pathname, "/tie");
  function navigation(items: { href: string; label: string }[], label: string) {
    return (
      <nav className="flex flex-wrap gap-2" aria-label={label}>
        {items.map((item) => {
          const active = isNavigationActive(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} prefetch={false} aria-current={active ? (pathname === item.href ? "page" : "location") : undefined}
              className={`platform-link inline-flex rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-teal-700 text-white" : "border border-slate-300 bg-white/70 text-slate-700 hover:bg-white"}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }
  return (
    <div className="grid gap-4">
      {navigation(getPlatformNavigation(role), "Club Vivo")}
      {canUseTie(role) && inTie ? (
        <div className="border-t border-slate-200 pt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">TIE workspace</p>
          {navigation(COACHING_NAVIGATION, "TIE coaching")}
        </div>
      ) : null}
    </div>
  );
}
