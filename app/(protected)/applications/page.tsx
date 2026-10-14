import { ApplicationsHub } from "../../../components/platform/ApplicationsHub";
import { CoachPageHeader } from "../../../components/coach/CoachPageHeader";
import { getPlatformUser } from "../../../lib/get-platform-user";

export default async function ApplicationsPage() {
  const user = await getPlatformUser();
  return <div className="grid gap-7">
    <CoachPageHeader title="Your applications hub" description="Connected tools inside Club Vivo, shaped around your role. TIE is the first available app; planned modules will appear here as they become ready." />
    <ApplicationsHub role={user.role} />
  </div>;
}
