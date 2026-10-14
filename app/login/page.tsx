import Link from "next/link";
function parseSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
export default async function LoginPage({
  searchParams
}: { searchParams?: Promise<{ loggedOut?: string | string[] }> }) {
  const resolved = searchParams ? await searchParams : undefined;
  const isLoggedOut = parseSearchParam(resolved?.loggedOut) === "1";
  return (
    <main className="cv-dark-landing flex min-h-screen items-center justify-center px-6 py-14">
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_.85fr] lg:items-center">
        <div>
          <Link href="/" className="platform-link text-sm font-semibold tracking-[0.12em] text-[#6ae4e0]">← CLUB VIVO</Link>
          <p className="mt-12 text-[11px] font-bold uppercase tracking-[0.2em] text-[#92a3be]">YOUR ORGANIZATION / YOUR SPACE</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">The next chapter<br /><span className="text-[#92a3be]">starts here.</span></h1>
          <p className="mt-6 max-w-lg text-sm leading-8 text-[#b6c5da]">One workspace for connected sports and business intelligence. Begin with TIE, our first flagship app.</p>
        </div>
        <section className="cv-panel p-8 sm:p-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#6ae4e0]">SECURE SIGN IN</span>
          <h2 className="mt-4 text-2xl font-semibold text-white">{isLoggedOut ? "Welcome back" : "Enter your Club Vivo workspace"}</h2>
          <p className="mt-4 text-sm leading-7 text-[#b6c5da]">{isLoggedOut ? "You signed out successfully. Sign back in to continue." : "Sign in with your existing organization account to access your assigned applications."}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/login/start" prefetch={false} className="platform-link inline-flex justify-center rounded-lg bg-[#6ae4e0] px-5 py-3 text-sm font-bold text-[#092126] hover:bg-[#9af2eb]">Sign in securely →</Link>
            <Link href="/login/start?mode=signup" prefetch={false} className="platform-link inline-flex justify-center rounded-lg border border-[#35435b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#172237]">Create account</Link>
          </div>
          <p className="mt-6 text-xs leading-6 text-[#92a3be]">Access and applications depend on your verified organization membership and permissions.</p>
        </section>
      </div>
    </main>
  );
}