import Link from "next/link";
import { ApplicationsHub } from "../../../components/platform/ApplicationsHub";
import { OrganizationOverview } from "../../../components/platform/OrganizationOverview";
import { getPlatformUser } from "../../../lib/get-platform-user";
import { canUseTie } from "../../../lib/platform-navigation";

export default async function HomePage() {
  const user = await getPlatformUser();
  return (
    <div className="grid gap-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-teal-950 px-6 py-9 text-white sm:px-9 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[40px] border-teal-900" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Club Vivo Home · v1</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Help your people develop.<br />Help your organization thrive.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-teal-100">One home for Sports and Business Intelligence. Start with practical coaching tools in TIE, and grow into the capabilities your organization needs.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {canUseTie(user.role) ? <Link href="/tie" prefetch={false} className="platform-link rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-teal-950 hover:bg-amber-200">Open TIE →</Link> : null}
            <Link href="/applications" prefetch={false} className="platform-link rounded-full border border-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">Explore applications</Link>
          </div>
        </div>
      </section>
      <OrganizationOverview user={user} />
      {canUseTie(user.role) ? (
        <section aria-labelledby="continue-heading" className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-800">TIE · Your first flagship app</p>
          <h2 id="continue-heading" className="mt-2 text-xl font-semibold text-slate-900">Make your next practice count</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Build from your team, time, space, equipment, and coaching objective. Your judgment leads the plan.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/sessions/new" prefetch={false} className="platform-link rounded-full bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">Build a session</Link>
            <Link href="/tie#quick-soccer-game" prefetch={false} className="platform-link rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Quick Soccer Game</Link>
            <Link href="/sessions" prefetch={false} className="platform-link rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Saved Sessions</Link>
          </div>
        </section>
      ) : <p className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm leading-6 text-slate-600">TIE currently supports coaches and club admins. Applications for other roles are coming soon. Contact your organization admin if your assigned role needs updating.</p>}
      <ApplicationsHub role={user.role} />
      <p className="px-1 text-sm leading-6 text-slate-600">Built for different sports, organizations, and development philosophies. TIE&apos;s current planning workflows focus on soccer.</p>
    </div>
  );
}
