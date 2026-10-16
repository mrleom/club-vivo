import { ApplicationsHub } from "../../../components/platform/ApplicationsHub";
import { getPlatformUser } from "../../../lib/get-platform-user";

export default async function ApplicationsPage() {
  const user = await getPlatformUser();
  return <div className="grid gap-8 text-[#e9edf7]">
    <div><p className="text-[11px] font-bold uppercase tracking-[0.19em] text-[#92a3be]">CLUB VIVO / APPLICATIONS</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[42px]">One club. <span className="text-[#92a3be]">Many possibilities.</span></h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a3b0c7]">Your organization connects sports and business tools in one place. TIE is the first available application; future modules are clearly marked.</p>
    </div>
    <ApplicationsHub role={user.role} />
  </div>;
}