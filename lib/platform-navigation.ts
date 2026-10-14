import { isAdminLikeRole, normalizeRole } from "./roles";

// Presentation policy only. SIC authorizes every protected action and data request.
export function canUseTie(role: string | null | undefined) {
  return normalizeRole(role) === "coach" || isAdminLikeRole(role);
}
export function roleLabel(role: string) {
  const normalized = normalizeRole(role);
  if (["admin", "club admin", "club_admin"].includes(normalized)) return "Club admin";
  if (normalized === "coach") return "Coach";
  if (normalized === "athlete") return "Athlete";
  if (normalized === "medical") return "Medical staff";
  if (isAdminLikeRole(role)) return "Admin coach";
  return "Member";
}
export function getPlatformNavigation(role: string) {
  return [
    { href: "/home", label: "Home" },
    { href: "/applications", label: "Applications" },
    ...(canUseTie(role) ? [{ href: "/tie", label: "TIE · Coaching" }] : []),
    ...(isAdminLikeRole(role) ? [{ href: "/organization", label: "Organization" }] : [])
  ];
}
export const COACHING_NAVIGATION = [
  { href: "/sessions/new", label: "Session Builder" },
  { href: "/tie#quick-soccer-game", label: "Quick Soccer Game" },
  { href: "/sessions", label: "Saved Sessions" },
  { href: "/teams", label: "Teams" },
  { href: "/equipment", label: "Equipment" },
  { href: "/methodology", label: "Methodology" }
];
export function isNavigationActive(pathname: string, href: string) {
  if (href === "/sessions") {
    return pathname === href || (pathname.startsWith("/sessions/") &&
      !["/sessions/new", "/sessions/quick", "/sessions/quick-review"].some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      ));
  }
  if (href === "/tie#quick-soccer-game") {
    return pathname === "/sessions/quick" || pathname === "/sessions/quick-review";
  }
  if (href === "/tie") {
    return pathname === href || COACHING_NAVIGATION.some(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
