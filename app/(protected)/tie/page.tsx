import Link from "next/link";
import { redirect } from "next/navigation";
import { CoachPageHeader } from "../../../components/coach/CoachPageHeader";
import { HomeSessionStartCard } from "../../../components/coach/HomeSessionStartCard";
import { getPlatformUser } from "../../../lib/get-platform-user";
import { canUseTie } from "../../../lib/platform-navigation";
import { createQuickSessionAction } from "../sessions/quick-session-actions";

const TOOLS = [
  { title: "Session Builder", href: "/sessions/new", description: "Plan a full session or focused drill using the team, time, space, equipment, and objective you have today." },
  { title: "Saved Sessions", href: "/sessions", description: "Return to your coaching work. Reuse ideas, export a plan, and leave feedback from the field." },
  { title: "Teams", href: "/teams", description: "Keep age band, program type, and player count close to the planning process." },
  { title: "Equipment Essentials", href: "/equipment", description: "Set the equipment context that helps the builder shape practical activities." },
  { title: "Methodology", href: "/methodology", description: "Review and work with the coaching principles and guidance available in your workspace." }
];
export default async function TiePage() {
  const user = await getPlatformUser();
  if (!canUseTie(user.role)) redirect("/home");
  return <div className="grid gap-6">
    <CoachPageHeader title="TIE · Coach Workspace" description="Club Vivo's first flagship app. Build, coach, reflect, and reuse — with your coaching judgment at the center. Current creation tools focus on soccer." />
    <div className="grid gap-4 md:grid-cols-2">
      {TOOLS.map((tool) => <Link key={tool.href} href={tool.href} prefetch={false} className="platform-link rounded-3xl border border-slate-200 bg-white/80 p-6 transition hover:border-teal-400 hover:bg-white">
        <h2 className="text-lg font-semibold text-slate-900">{tool.title} <span className="text-teal-700" aria-hidden="true">→</span></h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
      </Link>)}
    </div>
    <div id="quick-soccer-game" className="scroll-mt-6"><HomeSessionStartCard createQuickSessionAction={createQuickSessionAction} /></div>
    <section className="rounded-3xl border border-slate-200 bg-white/60 p-6">
      <h2 className="text-lg font-semibold text-slate-900">The next intelligence loop · Coming soon</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Match evidence, training prescriptions, athlete progress, and broader sports support are planned. Today, use the existing planning, saved-session, feedback, and export workflows.</p>
    </section>
  </div>;
}
