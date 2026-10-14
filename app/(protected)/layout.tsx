import type { ReactNode } from "react";
import { CoachAppShell } from "../../components/coach/CoachAppShell";
import { getCurrentUserIdentity } from "../../lib/get-current-user-identity";
import { getPlatformUser } from "../../lib/get-platform-user";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const [coachIdentity, currentUser] = await Promise.all([
    getCurrentUserIdentity(), getPlatformUser()
  ]);
  return <CoachAppShell coachIdentity={coachIdentity} role={currentUser.role}>{children}</CoachAppShell>;
}
