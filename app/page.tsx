import Link from "next/link";

const FEATURES = [
  { number: "01", title: "Sports Intelligence", description: "TIE is the first app: prepare and revisit practical soccer training work today, with match-informed intelligence on the roadmap." },
  { number: "02", title: "Business Intelligence", description: "A future connected view of programs, people, operations, facilities, and organizational decisions." },
  { number: "03", title: "Your club, your philosophy", description: "A platform direction that supports different organizational structures, sports, coaching philosophies, and resource levels." }
];

export default function Home() {
  return (
    <main className="cv-dark-landing min-h-screen px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#253249] pb-7">
          <Link href="/" className="platform-link flex items-center gap-3" aria-label="Club Vivo">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#28515b] bg-[#15333c] text-2xl font-bold text-[#6ae4e0]">V</span>
            <span className="text-xl font-extrabold tracking-[0.07em] text-white">CLUB VIVO<span className="text-[#6ae4e0]">.</span></span>
          </Link>
          <nav className="flex items-center gap-3" aria-label="Account">
            <Link href="/login/start" prefetch={false} className="platform-link rounded-lg border border-[#35435b] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-[#172237]">Sign in</Link>
            <Link href="/login/start?mode=signup" prefetch={false} className="platform-link rounded-lg bg-[#6ae4e0] px-4 py-2.5 text-sm font-bold text-[#092126] transition hover:bg-[#9af2eb]">Get started <span aria-hidden="true">→</span></Link>
          </nav>
        </header>
        <div className="grid gap-8 py-14 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:gap-14 lg:py-24">
          <section className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6ae4e0]">THE INTELLIGENT SPORTS ORGANIZATION</p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-[72px]">Every club.<br /><span className="text-[#9fb1cb]">Fully alive.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#b6c5da]">One connected home for sports and business intelligence. Built for the volunteer coach, the growing academy, and the people who make every organization possible.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login/start?mode=signup" prefetch={false} className="platform-link inline-flex items-center rounded-lg bg-[#6ae4e0] px-6 py-3 text-sm font-bold text-[#092126] hover:bg-[#9af2eb]">Start with Club Vivo <span className="ml-2" aria-hidden="true">→</span></Link>
              <Link href="/login/start" prefetch={false} className="platform-link inline-flex items-center rounded-lg border border-[#35435b] px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-[#172237]">Open my workspace</Link>
            </div>
            <p className="mt-7 text-xs leading-6 text-[#92a3be]">TIE is our first available application. Additional organization modules are in development.</p>
          </section>
          <section aria-label="Introducing TIE" className="cv-panel cv-feature relative min-h-[440px] overflow-hidden p-8 sm:p-10">
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-[#28515b] bg-[#15333c] px-3 py-1.5 text-[11px] font-bold tracking-[0.09em] text-[#6ae4e0]">FIRST FLAGSHIP APPLICATION</span>
              <h2 className="mt-7 text-5xl font-bold tracking-tight text-white">TIE<span className="text-[#6ae4e0]">.</span></h2>
              <p className="mt-2 text-lg font-medium text-[#d6e4f2]">Training Intelligence Engine</p>
              <p className="mt-5 max-w-[270px] text-sm leading-7 text-[#b6c5da]">A future evidence-to-training intelligence loop, beginning with the coaching tools already available today.</p>
            </div>
            <div className="cv-orbit bottom-[-5px] right-[-20px]" aria-hidden="true"><div className="cv-orbit-ring" /><div className="cv-orbit-ring cv-orbit-ring-second" /><div className="cv-orbit-core">TIE</div><span className="cv-orbit-node" /></div>
          </section>
        </div>
        <section className="border-t border-[#253249] py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92a3be]">ONE PLATFORM. BUILT TO GROW.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.number} className="cv-panel p-6">
                <span className="text-xs font-bold text-[#6ae4e0]">{feature.number}</span>
                <h2 className="mt-4 text-lg font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#a3b0c7]">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
        <footer className="flex flex-wrap justify-between gap-3 border-t border-[#253249] py-6 text-xs text-[#92a3be]"><span>Club Vivo · Intelligence for every club.</span><span>Human judgment stays at the center.</span></footer>
      </div>
    </main>
  );
}