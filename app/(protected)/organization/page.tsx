import { redirect } from "next/navigation";
import { OrganizationOverview } from "../../../components/platform/OrganizationOverview";
import { ApplicationsHub } from "../../../components/platform/ApplicationsHub";
import { getPlatformUser } from "../../../lib/get-platform-user";
import { isAdminLikeRole } from "../../../lib/roles";

export default async function OrganizationPage() {
  const user = await getPlatformUser();
  if (!isAdminLikeRole(user.role)) redirect("/home");
  return <div className="grid gap-8 text-[#e9edf7]">
    <div><p className="text-[11px] font-bold uppercase tracking-[0.19em] text-[#92a3be]">CLUB VIVO / ORGANIZATION</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[42px]">Your organization. <span className="text-[#92a3be]">Your structure.</span></h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a3b0c7]">A connected digital home for your people, sporting programs, and operations.</p>
    </div>
    <OrganizationOverview user={user} />
    <section className="cv-panel p-7">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f3c782]">COMING SOON</span>
      <h2 className="mt-3 text-xl font-semibold text-white">Organization management</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a3b0c7]">Custom organization profiles, staff invitations, role assignments, membership, governance, and financial dashboards are planned. No business reporting or management actions are live yet.</p>
    </section>
    <ApplicationsHub role={user.role} />
  </div>;
}