import Link from "next/link";
import { canOpenApplication, getVisibleApplications } from "../../lib/application-catalog";

export function ApplicationsHub({ role }: { role: string }) {
  return (
    <section aria-labelledby="applications-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-800">One platform, connected applications</p>
          <h2 id="applications-heading" className="mt-2 text-2xl font-semibold text-slate-900">Applications</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600">Start with TIE. New applications will grow around your organization and its needs.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {getVisibleApplications(role).map((app) => {
          const available = canOpenApplication(app, role);
          return (
            <article id={app.id} key={app.id} className={`flex scroll-mt-6 flex-col rounded-3xl border p-6 ${app.status === "available" ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white/80"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-600">{app.category}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${app.status === "available" ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {app.status === "available" ? "Flagship app" : "Coming soon"}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{app.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{app.description}</p>
              <div className="mt-6 border-t border-slate-200 pt-4">
                {available && app.status === "available" ? (
                  <Link href={app.href} prefetch={false} className="platform-link font-semibold text-teal-800">Open TIE <span aria-hidden="true">→</span></Link>
                ) : (
                  <p className="text-sm font-medium text-slate-500">{app.status === "available" ? "Available to coaches and club admins" : "Planned · Not available yet"}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
