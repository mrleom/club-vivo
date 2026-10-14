# Club Vivo Home v1

Club Vivo is one modular Sports and Business Intelligence product for sports organizations. TIE is its first flagship application, containing the current Coach Workspace. SIC remains the technical foundation behind the product, not another customer-facing product or a second sign-in.

## Source grounding

Reviewed before implementation:
- The existing frontend routes, server actions, auth helpers, role helpers, and API adapters at upstream main `1cea0e9`.
- [Club Vivo on SIC](../architecture/club-vivo-on-sic.md).
- The existing SIC `docs/architecture/architecture-principles.md`, `platform-constitution.md`, `tenant-claim-contract.md`, and `tenancy-model.md`.
- SIC `docs/product/club-vivo/chapter-2-product-constitution.md` and `role-and-workspace-model.md`.

These documents require a shared product, practical coaching value, backend-controlled roles, fail-closed tenancy, and clear distinctions between current runtime and future capabilities. Home v1 extends the product framing without expanding backend capabilities.

## Surfaces

| Surface | Behavior |
| --- | --- |
| `/home` | Shared entry point; verified workspace role/tier/reference; coaching shortcuts; role-aware app catalog |
| `/applications` | Modular applications hub; one available flagship and explicit planned states |
| `/tie` | Existing coaching workflows grouped as TIE; original Quick Soccer Game form/action reused |
| `/organization` | Admin-oriented workspace overview and planned organization-management capabilities |
| Existing coaching routes | Unchanged URLs, forms, actions, payloads, API adapters, session detail, feedback, and export |

Organization name, staff counts, financial metrics, memberships, and organization switching are not in the current `/me` contract. Home shows the current workspace context without fabricated business metrics, demo clubs, or synthetic counts.

## Presentation and roles

Roles come from the authenticated SIC `/me` response:
- Coaches see Home, Applications, and TIE.
- Admin-like roles recognized by the existing role helper additionally see Organization and business/platform roadmap cards.
- Athlete, medical, and unknown roles see Home and Applications, with TIE's role requirement explained.
- Direct requests to the new TIE and Organization pages also check the server-resolved role.
- Existing coaching routes retain backend-controlled action and data authorization. Navigation visibility is not a new entitlement system.
- Tier is informational. It does not grant a module or weaken isolation.

No role selector, tenant picker, fake membership, or new permission mutation is introduced. Admin-like aliases affect this read-only framing; they do not grant privileges to existing backend mutations.

## Applications

The typed catalog in `lib/application-catalog.ts` contains presentation metadata only. It is not an entitlement registry:
- TIE: current soccer coaching tools.
- Athlete Development and Sports Insights: coming soon.
- Business Intelligence and Organization Operations: coming soon, shown in admin context.
- Security & Edge: coming soon, shown in admin context.

Coming-soon items have no launch routes or enabled actions. Existing Equipment Essentials and Methodology are linked as supporting coaching tools, not advertised as full inventory or organization governance systems. Future sports and philosophies can fit within Club Vivo; current generation contracts remain soccer-focused.

## Boundaries

The protected layout resolves `/me` before rendering the shell. `getPlatformUser` uses React's request-scoped cache only to deduplicate that identity lookup in the layout and new pages. No persistent identity/data cache is added.

New routes join the cookie-presence proxy guard and the authenticated server layout. Cognito, PKCE, HttpOnly cookies, server-side bearer-token requests, and SIC entitlement resolution remain in place. The workspace ID is display-only, never submitted as an authorization input.

There are no backend endpoints, schema changes, AWS infrastructure changes, billing actions, or deployment configuration changes.

## Validation

`npm test` checks role visibility, unavailable modules, direct page guards, nested active navigation, and rendered Home/catalog/overview behavior. `npm run typecheck` validates the TypeScript project; `npm run build` builds production Next.js.

Before release, also verify against an authorized test SIC environment:
- login/callback/logout and expired/revoked membership;
- coaching creation, saved-session detail, feedback, and export;
- cross-tenant denial and role changes;
- desktop/mobile navigation and keyboard focus.

Local integration checks can use a localhost mock of existing SIC responses. Such checks do not prove production authorization or modify production data. Merge and deployment require explicit approval.

## Verification record (2026-10-14)

- Regression suite: 10/10 passing.
- TypeScript: passing.
- Default production Next.js build (Turbopack): passing for the final source. Webpack also passed before the quick-link correction.
- Production HTTP smoke checks against a localhost SIC mock: 17/17 passing, covering anonymous guards, coach/admin views, inappropriate-role redirects, revoked access, and existing coaching routes. Verified Home shortcuts reach the preserved quick-game form inside TIE; the legacy quick route retains its builder redirect.
- Diff review: no changes to auth helpers, backend API adapters, Session Builder routes/actions, feedback/export routes, lockfile, or Amplify configuration.
- Browser visual QA unavailable: the browser runtime failed to initialize. Live Cognito and production SIC authorization/mutations were not exercised; those remain pre-release checks.

The local Windows command sandbox initially failed during installation/build subprocesses. Existing dependency versions were checked against the lockfile, and the final default build completed in the local Node runtime. No runtime or deployment configuration workaround was committed.
