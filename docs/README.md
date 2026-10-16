# Club Vivo — Documentation Home

**Project:** Club Vivo | **Flagship application:** TIE (Training Intelligence Engine)  
**Status:** Working documentation for the unmerged `feat/club-vivo-salt-design` branch and its parent `feat/club-vivo-home`.  
**Updated:** 2026-10-13 (America/New_York).  
**Hosting decision:** AWS Amplify for the Next.js application; **no deployment approved or performed**.

## Why this exists

Club Vivo is one modular **Sports and Business Intelligence platform** for sports organizations. Documentation is our durable project knowledge, not a literal "Bible." We use **Master Blueprint** for the complete project reference and reserve **principles** and **decisions** for their actual purposes.

The documentation must answer: What are we building? Why? What actually works today? What belongs to a later release? How do the components work together? What proves a change is safe and useful?

## Start here

| Document | Purpose | Type |
| --- | --- | --- |
| [Master Blueprint](product/club-vivo-master-blueprint.md) | Mission, audiences, application model, product boundaries, roadmap | Product direction |
| [Execution Plan](EXECUTION-PLAN.md) | Ordered milestones, work queue, release criteria, and GitHub operating model | Execution plan |
| [Access & Pricing Principles](product/access-and-pricing-principles-v0.md) | Free essentials, paid intelligence, cost controls, data/consent boundaries | Proposed commercial policy |
| [System Architecture](architecture/club-vivo-system-architecture.md) | Current request flow, hosting, authentication, tenancy, components and gaps | Verified-source architecture + pending validation |
| [TIE Product Specification](product/tie-product-spec-v0.md) | Training Intelligence Engine vision, current capabilities, prototype stages and acceptance tests | Existing + proposed |
| [Documentation Working Agreement](governance/documentation-standard.md) | Required records for each feature, how to cite code, review, test and update documentation | Process |
| [ADR-0001: Platform and Hosting](decisions/ADR-0001-one-platform-amplify.md) | One platform with modular applications; Amplify hosting direction | Decision |
| [Home v1](product/club-vivo-home-v1.md) | PR #2 scope and previous local verification evidence | Historical implementation record |
| [SALT-inspired Design Direction](product/club-vivo-design-direction-v1.md) | PR #3 UI design decisions, tokens and pre-release checks | Design draft |
| [Existing Club Vivo API Architecture](architecture/club-vivo-on-sic.md) | Current private backend integration, retained for engineering truth | Legacy implementation reference |

## Reading rules

1. **Implemented** means supported by the source at a specific branch/commit; do not equate that with verified production behavior.
2. **Validated** requires recorded test evidence, environment, date and known gaps.
3. **Designed** means approved or proposed specification, not a working feature.
4. **Planned** means not yet built.
5. A renamed application or new UI does not rename backend API routes or magically implement features.
6. **Customer-facing language:** Club Vivo and TIE. **Internal engineering docs:** may name the existing SIC code/repository to preserve technical traceability.
7. Requirements and company philosophy live in separate documents from deployment procedures, API contracts and test results.
8. Secrets, real access tokens, production account identifiers and private tenant data must never appear in public documentation.

## Code and source boundaries

- [Club Vivo web repository](https://github.com/mrleom/club-vivo): current Next.js app, Home, TIE UI, authentication adapter, application catalog.
- [Sports Intelligence Cloud repository](https://github.com/mrleom/sports-intelligence-cloud): existing AWS API, tenancy, authentication infrastructure, domain services, CDK, tests and architectural rules.
- [SALT portfolio frontend](https://github.com/mrleom/SALT-Portafolio): visual design reference only; its asset data model and permissions are unrelated to Club Vivo.

The GitHub branches under review are [Home PR #2](https://github.com/mrleom/club-vivo/pull/2) and [design PR #3](https://github.com/mrleom/club-vivo/pull/3). **Both are drafts.** PR #3 is stacked on the PR #2 feature branch, not on `main`.

## Current decision and release posture

- We **stay with Amplify** for this Next.js product instead of converting it into static S3 hosting.
- We **save the design work** and defer hands-on visual and backend verification.
- No PR merge, branch promotion, infrastructure change, AWS deployment, customer launch, or use of production tenant data is authorized.
- Next.js version/runtime compatibility, authorized login flows, browser layout, usage cost guardrails, and live tenant-denial tests remain release gates.

## Documentation change log

| Date | Update |
| --- | --- |
| 2026-10-13 | Established the documentation index, product blueprint, factual system architecture, TIE specification, working agreement and recorded platform/hosting decision on the unmerged design branch. |
