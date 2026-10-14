import { redirect } from "next/navigation";
import { OrganizationOverview } from "../../../components/platform/OrganizationOverview";
import { ApplicationsHub } from "../../../components/platform/ApplicationsHub";
import { CoachPageHeader } from "../../../components/coach/CoachPageHeader";
import { getPlatformUser } from "../../../lib/get-platform-user";
import { isAdminLikeRole } from "../../../lib/roles";

export default async function OrganizationPage() {
  const user = await getPlatformUser();
  if (!isAdminLikeRole(user.role)) redirect("/home");
  return <div className="grid gap-7">
    <CoachPageHeader title="Organization overview" description="A shared workspace for your sports organization. Keep coaching work connected today, with a clear view of what comes next." />
    <OrganizationOverview user={user} />
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
      <h2 className="text-xl font-semibold text-slate-900">Organization management · Coming soon</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Organization profiles, staff invitations, role assignments, membership, governance, and financial dashboards are planned. Business metrics will appear when those workflows and their data are available.</p>
    </section>
    <ApplicationsHub role={user.role} />
  </div>;
}
