import Link from "next/link";
import { ApplicationsHub } from "../../../components/platform/ApplicationsHub";
import { OrganizationOverview } from "../../../components/platform/OrganizationOverview";
import { getPlatformUser } from "../../../lib/get-platform-user";
import { canUseTie, roleLabel } from "../../../lib/platform-navigation";
import { getVisibleApplications } from "../../../lib/application-catalog";

export default async function HomePage() {
  const user = await getPlatformUser();
  const tieEnabled = canUseTie(user.role);
  const apps = getVisibleApplications(user.role);
  const tierName = ({free: "Free", pro: "Pro", org: "Organization"} as Record<string, string>)[user.tier] || user.tier;

  return (
    <div className="grid gap-7 text-[#e9edf7]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.19em] text-[#92a3be]">WORKSPACE / OVERVIEW</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-[42px]">Your club. <span className="text-[#92a3be]">One clear picture.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a3b0c7]">Where sport, people, and operations come together. Make smarter decisions without losing what makes your organization unique.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#25454c] bg-[#11262e] px-3 py-2 text-xs text-[#a4d7d5]"><span className="h-2 w-2 rounded-full bg-[#6ae4e0]" /> Your private workspace</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="cv-metric"><span className="cv-metric-label">YOUR ROLE</span><strong className="text-[#6ae4e0]">{roleLabel(user.role)}</strong><p>Assigned access</p></div>
        <div className="cv-metric"><span className="cv-metric-label">WORKSPACE PLAN</span><strong className="text-[#b7a3ff]">{tierName}</strong><p>Current plan</p></div>
        <div className="cv-metric"><span className="cv-metric-label">AVAILABLE TO YOU</span><strong className="text-white">{tieEnabled ? "01" : "00"}</strong><p>Applications ready to open</p></div>
        <div className="cv-metric"><span className="cv-metric-label">APPLICATION DIRECTORY</span><strong className="text-[#f3c782]">{String(apps.length).padStart(2, "0")}</strong><p>Including future modules</p></div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <section className="cv-panel cv-feature relative min-h-[325px] overflow-hidden p-7 sm:p-9">
          <div className="relative z-10 max-w-lg">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6ae4e0]">FLAGSHIP APPLICATION / TRAINING INTELLIGENCE</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Train with purpose.<br />Develop with insight.</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#b6c5da]">TIE brings coaching context, your club's philosophy, and practical training decisions into one place. Current tools focus on soccer.</p>
            {tieEnabled ? <Link href="/tie" prefetch={false} className="platform-link mt-6 inline-flex rounded-lg border border-[#6ae4e0] bg-[#6ae4e0] px-5 py-3 text-sm font-bold text-[#092126] transition hover:bg-[#9af2eb]">Open TIE <span className="ml-2" aria-hidden="true">→</span></Link> :
              <p className="mt-6 inline-flex rounded-lg border border-[#35435b] px-4 py-3 text-sm text-slate-300">TIE requires a coaching role</p>}
          </div>
          <div className="cv-orbit" aria-hidden="true"><div className="cv-orbit-ring" /><div className="cv-orbit-ring cv-orbit-ring-second" /><div className="cv-orbit-core">TIE</div><span className="cv-orbit-node" /></div>
        </section>
        <section className="cv-panel p-7 sm:p-9">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92a3be]">READY WHEN YOU ARE</p><h2 className="mt-3 text-xl font-semibold text-white">Your next move</h2></div><span className="text-xl text-[#b7a3ff]" aria-hidden="true">✧</span></div>
          {tieEnabled ? (
            <div className="mt-5 grid gap-1">
              <Link href="/sessions/new" prefetch={false} className="platform-link cv-action-row"><span className="cv-action-dot bg-[#6ae4e0]" /><span><strong>Plan your next training</strong><small>Start with your team, objectives, and constraints.</small></span><span aria-hidden="true">→</span></Link>
              <Link href="/tie#quick-soccer-game" prefetch={false} className="platform-link cv-action-row"><span className="cv-action-dot bg-[#f3c782]" /><span><strong>Create a quick soccer game</strong><small>Turn a coaching idea into an activity.</small></span><span aria-hidden="true">→</span></Link>
              <Link href="/sessions" prefetch={false} className="platform-link cv-action-row"><span className="cv-action-dot bg-[#b7a3ff]" /><span><strong>Return to training plans</strong><small>Review, reuse, and reflect on saved work.</small></span><span aria-hidden="true">→</span></Link>
            </div>
          ) : <p className="mt-5 text-sm leading-7 text-[#a3b0c7]">Your applications will appear here as they become available for your assigned role.</p>}
          <Link href="/applications" prefetch={false} className="platform-link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6ae4e0]">Explore your applications <span aria-hidden="true">→</span></Link>
        </section>
      </div>

      <OrganizationOverview user={user} />
      <ApplicationsHub role={user.role} />

      <section className="cv-panel p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6ae4e0]">DESIGNED AROUND PEOPLE</p>
        <h2 className="mt-3 text-xl font-semibold text-white">Your club's philosophy. Your club's future.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a3b0c7]">Club Vivo is built to adapt to many sports, organizational structures, and development approaches. New intelligence and business modules will arrive as verified capabilities—not as promises disguised as live tools.</p>
      </section>
    </div>
  );
}