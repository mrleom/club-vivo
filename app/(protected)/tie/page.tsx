import Link from "next/link";
import { redirect } from "next/navigation";
import { HomeSessionStartCard } from "../../../components/coach/HomeSessionStartCard";
import { getPlatformUser } from "../../../lib/get-platform-user";
import { canUseTie } from "../../../lib/platform-navigation";
import { createQuickSessionAction } from "../sessions/quick-session-actions";

const TOOLS = [
  { title: "Plan training", href: "/sessions/new", number: "01", description: "Turn team context, available resources, and your goals into a practical training plan." },
  { title: "Training library", href: "/sessions", number: "02", description: "Review coaching work, reuse ideas, and reflect on what happened on the field." },
  { title: "My teams", href: "/teams", number: "03", description: "Use the team details that help shape practical, age-appropriate training." },
  { title: "Equipment", href: "/equipment", number: "04", description: "Make the most of the equipment available to your team." },
  { title: "Club philosophy", href: "/methodology", number: "05", description: "Review your coaching principles and the guidance available in your club." }
];

export default async function TiePage() {
  const user = await getPlatformUser();
  if (!canUseTie(user.role)) redirect("/home");
  return (
    <div className="grid gap-7 text-[#e9edf7]">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.19em] text-[#92a3be]">CLUB VIVO / FLAGSHIP APP</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-[42px]">TIE <span className="text-[#6ae4e0]">· Training Intelligence</span></h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a3b0c7]">Better decisions for better development. Begin with the tools you can use today; each club's philosophy and real-world constraints should guide the future intelligence.</p>
      </div>
      <section className="cv-panel cv-feature relative overflow-hidden p-7 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6ae4e0]">YOUR COACHING WORKSPACE</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Every practice has a purpose.</h2>
          <p className="mt-3 text-sm leading-7 text-[#b6c5da]">Prepare for your next session, explore creative activities, and revisit what you have learned. The current planning experience focuses on soccer.</p>
          <Link href="/sessions/new" prefetch={false} className="platform-link mt-6 inline-flex rounded-lg bg-[#6ae4e0] px-5 py-3 text-sm font-bold text-[#092126] hover:bg-[#9af2eb]">Plan training <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) =>
          <Link key={tool.href} href={tool.href} prefetch={false} className="platform-link cv-panel group flex min-h-[180px] flex-col p-6 transition hover:border-[#4b7e81] hover:bg-[#17283b]">
            <span className="text-[11px] font-bold tracking-widest text-[#6ae4e0]">{tool.number}</span>
            <h2 className="mt-4 text-lg font-semibold text-white group-hover:text-[#6ae4e0]">{tool.title} <span aria-hidden="true">→</span></h2>
            <p className="mt-2 text-sm leading-6 text-[#a3b0c7]">{tool.description}</p>
          </Link>
        )}
      </div>
      <section id="quick-soccer-game" className="scroll-mt-28">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#92a3be]">QUICK START / CREATIVE GAME</p>
        <HomeSessionStartCard createQuickSessionAction={createQuickSessionAction} />
      </section>
      <section className="cv-panel p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b7a3ff]">THE NEXT INTELLIGENCE LOOP</p>
        <h2 className="mt-3 text-xl font-semibold text-white">From match evidence to purposeful development</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a3b0c7]">Match analysis, methodology-aware training recommendations, next-opponent context, and athlete progress are planned—not live features. Coaches remain responsible for reviewing recommendations.</p>
      </section>
    </div>
  );
}