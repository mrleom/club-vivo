import Link from "next/link";
import type { CurrentUser } from "../../lib/get-current-user";
import { canUseTie, roleLabel } from "../../lib/platform-navigation";
import { isAdminLikeRole } from "../../lib/roles";

export function OrganizationOverview({ user }: { user: CurrentUser }) {
  const tier = ({ free: "Free", pro: "Pro", org: "Organization" } as Record<string, string>)[user.tier] || user.tier;
  return (
    <section aria-labelledby="organization-heading" className="cv-panel p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92a3be]">YOUR ORGANIZATION</p>
          <h2 id="organization-heading" className="mt-3 text-xl font-semibold text-white">Your workspace, built around your people</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#a3b0c7]">Club Vivo adapts to your organization and role. A unified overview keeps your work in context.</p>
        </div>
        {isAdminLikeRole(user.role) ? <Link href="/organization" prefetch={false} className="platform-link text-sm font-semibold text-[#6ae4e0]">Organization overview →</Link> : null}
      </div>
      <dl className="mt-6 grid gap-5 border-t border-[#253249] pt-5 sm:grid-cols-3">
        <div><dt className="text-xs text-[#92a3be]">Assigned role</dt><dd className="mt-1 font-semibold text-white">{roleLabel(user.role)}</dd></div>
        <div><dt className="text-xs text-[#92a3be]">Workspace plan</dt><dd className="mt-1 font-semibold text-white">{tier}</dd></div>
        <div><dt className="text-xs text-[#92a3be]">Training Intelligence</dt><dd className="mt-1 font-semibold text-white">{canUseTie(user.role) ? "TIE · Available" : "TIE · Coach access required"}</dd></div>
      </dl>
      <details className="mt-5 text-xs text-[#92a3be]">
        <summary className="platform-link w-fit cursor-pointer">Workspace reference</summary>
        <p className="mt-2 break-all">Workspace ID: {user.tenantId}</p>
        <p className="mt-1">Organization profiles, memberships, and business reporting are coming soon.</p>
      </details>
    </section>
  );
}