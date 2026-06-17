import Link from "next/link";

function parseSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ loggedOut?: string | string[] }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isLoggedOut = parseSearchParam(resolvedSearchParams?.loggedOut) === "1";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="club-vivo-shell w-full max-w-2xl rounded-[2rem] border p-8 backdrop-blur">
        <div className="club-vivo-badge mb-6 inline-flex rounded-full px-3 py-1 text-sm font-medium tracking-wide uppercase">
          Club Vivo
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Sign in to Club Vivo
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          {isLoggedOut
            ? "You signed out. Sign back in to continue planning."
            : "Access your coach workspace to build sessions, manage team context, and review saved plans."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login/start"
            prefetch={false}
            className="inline-flex rounded-full bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            Sign in
          </Link>

          <Link
            href="/login/start?mode=signup"
            prefetch={false}
            className="inline-flex rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            Create account
          </Link>
        </div>

        <p className="mt-6 max-w-xl text-sm leading-6 text-slate-600">
          New coaches can create an account and enter the same workspace after access is approved.
        </p>

        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
          If you need help accessing your workspace, contact your Club Vivo administrator.
        </p>
      </section>
    </main>
  );
}
