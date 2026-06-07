import Link from "next/link";

import { CoachPageHeader } from "../../../components/coach/CoachPageHeader";

const WORKSPACE_AREAS = [
  {
    title: "Session Builder",
    icon: "📋",
    href: "/sessions/new",
    description:
      "Build coach-ready full sessions or focused activity ideas through Custom Build. Use Full Session for a complete practice plan or Drill / Activity for a shorter coaching idea."
  },
  {
    title: "Methodology",
    icon: "📜",
    href: "/methodology",
    description:
      "Review the soccer logic behind the builder today and the direction for a clearer coach methodology over time."
  },
  {
    title: "Teams",
    icon: "👥",
    href: "/teams",
    description:
      "Save team context like age band, program type, and player count so the builder starts from a better coaching picture."
  },
  {
    title: "Equipment",
    icon: "⚽",
    href: "/equipment",
    description:
      "Define the equipment profile the builder can use when it shapes activities, constraints, and scoring options."
  },
  {
    title: "Sessions",
    icon: "📚",
    href: "/sessions",
    description:
      "Review saved sessions, reuse ideas, and leave feedback that can support future learning-loop interpretation."
  }
];

export default async function HomePage() {
  return (
    <div className="grid gap-6">
      <CoachPageHeader
        title="Coach Workspace"
        description="A practical planning space for coaches who need sessions, team context, equipment context, and a clear record of what worked."
      />

      <section className="rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
            Why it exists
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Make the next practice easier to plan and easier to coach.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Coach Workspace brings the day-to-day coaching tools into one place: session
            generation, methodology notes, team context, equipment context, saved sessions, and
            feedback. The goal is not to replace a coach&apos;s judgment. It is to give coaches a
            cleaner starting point and keep useful context close to the planning work.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {WORKSPACE_AREAS.map((area) => (
          <Link
            key={area.title}
            href={area.href}
            aria-label={`Open ${area.title}`}
            className="group rounded-3xl border border-slate-200 bg-white/75 p-5 shadow-sm transition hover:border-teal-300 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <span aria-hidden="true" className="text-lg leading-none">
                {area.icon}
              </span>
              <span>{area.title}</span>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
