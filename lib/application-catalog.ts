import { canUseTie } from "./platform-navigation";
import { isAdminLikeRole } from "./roles";

type ApplicationBase = {
  id: string;
  name: string;
  description: string;
  category: "Sports Intelligence" | "Business Intelligence" | "Platform";
  audience: "everyone" | "organization";
};
export type PlatformApplication = ApplicationBase & (
  | { status: "available"; href: string; flagship: true }
  | { status: "coming-soon"; href?: never; flagship?: never }
);
export const APPLICATIONS: readonly PlatformApplication[] = [
  {
    id: "tie", name: "TIE", category: "Sports Intelligence", audience: "everyone",
    status: "available", href: "/tie", flagship: true,
    description: "Your coaching workspace. Plan sessions, create quick soccer games, and save, reuse, export, and reflect on your work."
  },
  {
    id: "athlete-development", name: "Athlete Development", category: "Sports Intelligence",
    audience: "everyone", status: "coming-soon",
    description: "Connect development goals, observations, and progress over time. Athlete profiles and assessments are planned."
  },
  {
    id: "sports-insights", name: "Sports Insights", category: "Sports Intelligence",
    audience: "everyone", status: "coming-soon",
    description: "Turn coaching and performance evidence into useful insights. Match analysis and progress dashboards are planned."
  },
  {
    id: "business-intelligence", name: "Business Intelligence", category: "Business Intelligence",
    audience: "organization", status: "coming-soon",
    description: "Understand the health of your organization. Financial, membership, and program reporting are planned."
  },
  {
    id: "organization-operations", name: "Organization Operations", category: "Business Intelligence",
    audience: "organization", status: "coming-soon",
    description: "Bring people, programs, facilities, and governance together. Staff invitations, registration, and payments are planned."
  },
  {
    id: "security-edge", name: "Security & Edge", category: "Platform",
    audience: "organization", status: "coming-soon",
    description: "Support resilient organizations with managed security and optional local infrastructure. Device health and offline sync are planned."
  }
];
export function getVisibleApplications(role: string) {
  return APPLICATIONS.filter((app) => app.audience === "everyone" || isAdminLikeRole(role));
}
export function canOpenApplication(app: PlatformApplication, role: string) {
  return app.status === "available" && app.id === "tie" && canUseTie(role);
}
