import Link from "next/link";
import type { CurrentUser } from "../../lib/get-current-user";
import { canUseTie, roleLabel } from "../../lib/platform-navigation";
import { isAdminLikeRole } from "../../lib/roles";

export function OrganizationOverview({ user }: { user: CurrentUser }) {
  const tier = ({ free: "Free", pro: "Pro", org: "Organization" } as Record<string, string>)[user.tier] || user.tier;
  return (
    <section aria-labelledby="organization-heading" className="rounded-3xl border border-slate-200 bg-white/80 p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-800">Your organization</p>
          <h2 id="organization-heading" className="mt-2 text-xl font-semibold text-slate-900">A shared home for your work</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Your workspace brings coaching and future organization tools together, with access based on your assigned role.</p>
        </div>
        {isAdminLikeRole(user.role) ? <Link href="/organization" prefetch={false} className="platform-link text-sm font-semibold text-teal-800">Organization overview →</Link> : null}
      </div>
      <dl className="mt-6 grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-3">
        <div><dt className="text-xs text-slate-500">Your role</dt><dd className="mt-1 font-semibold text-slate-900">{roleLabel(user.role)}</dd></div>
        <div><dt className="text-xs text-slate-500">Workspace tier</dt><dd className="mt-1 font-semibold text-slate-900">{tier}</dd></div>
        <div><dt className="text-xs text-slate-500">Coaching application</dt><dd className="mt-1 font-semibold text-slate-900">{canUseTie(user.role) ? "TIE · Available" : "TIE · Coach access required"}</dd></div>
      </dl>
      <details className="mt-5 text-xs text-slate-500">
        <summary className="platform-link w-fit cursor-pointer">Workspace reference</summary>
        <p className="mt-2 break-all">Workspace ID: {user.tenantId}</p>
        <p className="mt-1">Organization profile, membership, and business reporting are coming soon.</p>
      </details>
    </section>
  );
}
