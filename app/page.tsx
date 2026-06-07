import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <section className="relative overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0_#0f172a]">
          <div className="grid grid-cols-[1.25rem_1fr_1.25rem] border-b-4 border-slate-900 bg-emerald-700">
            <div className="border-r-4 border-slate-900 bg-rose-500" />
            <div className="px-5 py-3 text-center text-sm font-black uppercase text-white">
              Coach planning starts here
            </div>
            <div className="border-l-4 border-slate-900 bg-amber-300" />
          </div>

          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black uppercase leading-none text-slate-950 sm:text-7xl lg:text-8xl">
                CLUB VIVO
              </h1>
              <div className="mt-5 h-3 w-44 rounded-full border-2 border-slate-900 bg-[repeating-linear-gradient(90deg,#0f172a_0_16px,#f59e0b_16px_32px,#ef4444_32px_48px,#14b8a6_48px_64px)]" />

              <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-slate-800">
                A coach workspace for building clear, game-like sessions with the team,
                equipment, and practice constraints you have today.
              </p>
            </div>

            <article className="rounded-3xl border-4 border-slate-900 bg-amber-50 p-5 shadow-[6px_6px_0_#0f172a]">
              <h2 className="text-2xl font-black text-slate-950">Coach Workspace</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Build full sessions or focused activity ideas, save what works, and keep your team
                context close to the plan.
              </p>
              <Link
                href="/login/start?mode=signup"
                prefetch={false}
                className="mt-5 inline-flex rounded-full border-2 border-slate-900 bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                Start coaching
              </Link>
            </article>
          </div>
        </section>

        <p className="text-sm leading-6 text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login/start"
            prefetch={false}
            className="font-semibold text-teal-800 transition hover:text-teal-900 hover:underline"
          >
            Sign in
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
