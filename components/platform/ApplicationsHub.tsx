import Link from "next/link";
import { canOpenApplication, getVisibleApplications } from "../../lib/application-catalog";

export function ApplicationsHub({ role }: { role: string }) {
  return (
    <section aria-labelledby="applications-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92a3be]">CONNECTED CAPABILITIES</p>
          <h2 id="applications-heading" className="mt-2 text-2xl font-semibold text-white">Your applications</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#a3b0c7]">One shared workspace. Choose the tools your role supports today, and see what is planned for tomorrow.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {getVisibleApplications(role).map((app) => {
          const available = canOpenApplication(app, role);
          return (
            <article id={app.id} key={app.id} className={"cv-panel flex scroll-mt-6 flex-col p-6 " + (app.status === "available" ? "border-[#2e7776] bg-[#112b33]" : "")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a3b0c7]">{app.category}</p>
                <span className={"rounded-full border px-2.5 py-1 text-[11px] font-semibold " + (app.status === "available" ? "border-[#28515b] bg-[#15333c] text-[#6ae4e0]" : "border-[#35435b] bg-[#1b2740] text-[#b6c5da]")}>
                  {app.status === "available" ? "Flagship app" : "Coming soon"}
                </span>
              </div>
              <span className={"mt-6 flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-bold " + (app.status === "available" ? "border-[#28515b] bg-[#15333c] text-[#6ae4e0]" : "border-[#35435b] bg-[#20293e] text-[#b7a3ff]")} aria-hidden="true">{app.id === "tie" ? "T" : app.name.charAt(0)}</span>
              <h3 className="mt-4 text-xl font-semibold text-white">{app.id === "tie" ? "TIE · Training Intelligence" : app.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#a3b0c7]">{app.description}</p>
              <div className="mt-6 border-t border-[#253249] pt-4">
                {available && app.status === "available" ?
                  <Link href={app.href} prefetch={false} className="platform-link text-sm font-bold text-[#6ae4e0]">Open TIE <span aria-hidden="true">→</span></Link> :
                  <p className="text-sm font-medium text-[#92a3be]">{app.status === "available" ? "Available to coaches and club admins" : "Planned · Not available yet"}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}