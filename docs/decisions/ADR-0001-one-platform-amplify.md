# ADR-0001 — One Club Vivo Product, TIE Flagship, Amplify Hosting

**Status:** Accepted **product and hosting direction**; deployment remains pending technical verification and explicit user approval.  
**Date:** 2026-10-13.  
**Scope:** Club Vivo frontend and modular product framing; **no backend or infrastructure change made by this decision record**.

## Context

Club Vivo evolved from a soccer coaching workspace supported by the existing AWS technical foundation. The product is now defined as **one integrated Sports and Business Intelligence SaaS for sports organizations**, with **TIE** as the first working flagship application.

The current web implementation is **Next.js with server-side runtime dependencies**:
- Cognito OAuth callback with PKCE and HttpOnly cookies;
- server-rendered authenticated routes and trusted `/me` lookup;
- server actions invoking protected AWS APIs;
- saved sessions, feedback, exports and tenant-scoped domain behavior.

The previous SALT project uses a React/Vite static frontend with S3 + CloudFront. Club Vivo's backend requirements are materially different even if we adapt SALT's visual language.

The user chose to **continue with AWS Amplify** for Club Vivo, save the existing UI changes and verify later.

## Decision

1. **One customer-facing product:** Club Vivo.
2. **One flagship application:** TIE — Training Intelligence Engine, initially exposing existing soccer coaching tools.
3. **Future applications inside Club Vivo:** Sports Insights, Athlete Development, Business Intelligence, Organization Operations and optional Security/Edge services, enabled only when real backend functionality exists.
4. **Reuse secure implementation:** preserve current AWS identity, entitlements, data and API boundaries in engineering source; old internal technical names do not need to appear in new customer-facing navigation.
5. **Preferred frontend hosting:** AWS Amplify with managed Next.js runtime support once compatibility is verified.
6. **No static hosting conversion:** S3 + CloudFront **alone** is not a drop-in replacement for server-side Next.js behavior.
7. **No release yet:** PR #2 and stacked PR #3 remain drafts. No merge, deployment or infrastructure alteration without approval.
8. **Documentation-first continuation:** architecture and product documents are now required as part of every substantial implementation slice.

## Alternatives considered

| Alternative | Outcome | Why |
| --- | --- | --- |
| Keep Club Vivo as only a coaching SaaS | Rejected as company/product vision | Does not represent the broader sports + business mission |
| Market SIC as an additional product | Rejected as customer-facing structure | Creates unnecessary branding and onboarding complexity |
| Rewrite the codebase entirely | Rejected for now | Discards valuable working security and coaching foundations |
| S3 + CloudFront static-only hosting | Rejected for this Next.js build | Does not natively run protected Next.js routes, callbacks and actions |
| Build custom CloudFront + server compute | Deferred | Adds ops effort without a demonstrated MVP requirement |
| Amplify Hosting | Preferred, conditional | Fits planned Next.js experience with managed hosting, if version/runtime testing passes |

## Consequences

### Benefits
- Clear, coherent product positioning.
- One sign-in experience and shared organization context.
- Modular roadmap without multiplying unproven applications.
- Simpler path for a solo developer to focus on TIE and real pilot value.
- Continuity of existing secure backend and app work.

### Risks and limitations
- Current `package-lock.json` resolves Next.js **16.2.2**; version/runtime support on Amplify must be verified rather than assumed.
- `package.json` still specifies broad `latest` dependencies; a pinned version policy is a separate future task.
- SSR hosting may incur build, transfer, server execution and backend charges not comparable to static CDN costs alone.
- A visual redesign can introduce contrast, usability or navigation regressions despite passing unit/build checks.
- Existing tenant/role restrictions remain in backend; UI role presentation is not an authorization control.
- Real organizational structure, configurable methodology, video intelligence and business dashboards remain future features.

## Implementation and validation

**Saved work:** [Home PR #2](https://github.com/mrleom/club-vivo/pull/2) and [design PR #3](https://github.com/mrleom/club-vivo/pull/3). PR #3 is based on the unmerged Home feature branch, not `main`.

Before approved deployment:
- Review visual design and usability on desktop/mobile.
- Repeat pinned-version builds and frontend regression tests.
- Verify Amplify adapter/version support, environment variables, callback URLs and session cookies.
- Use a scoped test backend and test data.
- Validate role and tenant denial with real protected APIs.
- Set budgets and monitor usage; review rollback strategy.
- Obtain explicit merge and deploy permission.

## Related documents

- [Master Blueprint](../product/club-vivo-master-blueprint.md)
- [System Architecture](../architecture/club-vivo-system-architecture.md)
- [TIE Specification](../product/tie-product-spec-v0.md)
- [Documentation Standard](../governance/documentation-standard.md)
