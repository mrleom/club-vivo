# Club Vivo — Master Blueprint

**Status:** Living product definition, v0.1; grounded in the two unmerged Club Vivo draft PRs and the existing AWS backend source.  
**Not a deployment guide or claim of implementation.**  
**Product name:** Club Vivo. **First application:** TIE — Training Intelligence Engine.

## 1. Purpose

**Club Vivo helps sports organizations grow people, performance and organizational capability through accessible, secure and responsible technology.**

Club Vivo is **one modular Sports and Business Intelligence SaaS**. An organization enters one Club Vivo home, chooses its useful applications, and gives each person appropriate access. A small volunteer team should find it straightforward; a larger club should have room to grow. We do not force one country's coaching philosophy, one business structure, or one competition model onto every organization.

### Guiding product principles

1. **Human development first:** athletes, coaches, volunteers and staff are people, not merely statistics.
2. **Methodology flexibility:** every organization can define or select its approved coaching and development principles. TIE must be able to explain how a recommendation reflects those principles.
3. **Safety is not configurable away:** applicable laws, participant safety, safeguarding, privacy, competition constraints and data access requirements override club preferences.
4. **One connected organization:** sports and business applications share an identity and controlled organization context, not unrestricted access to one another's data.
5. **Start useful; scale deliberately:** do not require expensive cameras, consultants or hardware for grassroots value.
6. **Clear evidence and human approval:** TIE helps interpret information and suggests actions; a qualified person reviews decisions.
7. **Honest product communication:** planned capabilities are never depicted as live, and unsupported organizational metrics are not fabricated.
8. **Affordable access and sustainable economics:** nonprofit offerings and commercial tiers are design objectives; pricing and verification mechanics require separate evidence and decisions.
9. **Security by construction:** server-derived tenant identity, least privilege, auditable change and cost guardrails.

These are product principles, not a claim of regulatory certification, official federation endorsement, or production compliance.

## 2. Customer profiles and value

| Audience | Needs | Likely entry |
| --- | --- | --- |
| Volunteer or grassroots coach | Practical sessions, team context, quick activities, understandable visuals | TIE |
| Community nonprofit | Affordable development tools, memberships, volunteers, scheduling | Club Vivo Home + TIE |
| Academy / technical director | Coherent methodology, consistent teams/coaches, progress evidence | TIE, future methodology profiles |
| Club president / owner / board | Organization overview, staff, facilities, financial and operational context | Organization Home and future Business Intelligence |
| Athlete and guardian | Safe communication, schedules, development visibility and rights | Future role-specific experiences |
| Facility / support staff | Equipment, tasks, bookings, clear permissions | Future Operations |
| Sports software company / association | Secure optional integration of specialized training intelligence | Future TIE API/integration offering |

Serving these audiences is a **vision**; only the current coaching and read-only platform surfaces described below exist in the reviewed app.

## 3. One platform, many applications

### Platform experience

- **Club Vivo Home**: the authenticated entry point, workspace context and applications hub.
- **Sports Intelligence**: TIE first; athlete development, match insights and performance tools later.
- **Business Intelligence**: organizational operations, membership, finance, equipment and facilities later.
- **Shared core**: trusted login, tenant context, entitlements, APIs, data isolation, safe intelligence services, observability and billing controls when implemented.
- **Optional managed services**: hybrid/edge, managed security and professional setup only for organizations that genuinely need them; no requirement for the basic cloud product.

### What is in the current UI source

On the pending design branch, Club Vivo has the public site, login entry, `/home`, `/applications`, `/tie`, and a read-only `/organization` for existing admin-like roles. TIE groups the previously built soccer coaching workflow: plan training, quick activity/game, saved plans, teams, equipment context, methodology text, feedback and export paths. Some of those surfaces are narrow tools, not enterprise-ready management products.

The application catalog has **only TIE marked available**. Athlete Development, Sports Insights, Business Intelligence, Organization Operations and Security & Edge are **coming soon**.

The new labels do not create AI-powered match analysis, a configurable organization builder, a financial dashboard, or broad multi-sport support.

## 4. Future self-configuring organization

Every organization should be able to select a template (for example: single coach, grassroots nonprofit, academy or complex club), describe its teams/programs, choose applications and invite people.

**Proposed entities (not a current API contract):**
- Organization and verified membership;
- Program, sport and team;
- Person and role assignment (possibly multiple organizations/roles);
- Application entitlement;
- Club methodology version and approval;
- Audit event and organization settings.

**Proposed onboarding sequence:**
1. Identify organization type and a verified owner/admin.
2. Choose a template, language, sport and relevant modules.
3. Define teams/programs and a minimal role model.
4. Invite members through a trusted, validated backend path.
5. Set an approved methodology or continue with transparent defaults.
6. Enter Club Vivo Home; add complexity only when it brings value.

**Important:** public self-selected roles must never grant authority. Membership and entitlement verification are server-owned. A future organization builder requires an architectural decision, protected APIs, tenancy tests and reliable deletion/retention rules before shipping.

## 5. TIE is our first flagship app

TIE's long-term job is **evidence → understanding → development objective → practical training proposal → coach approval → training feedback → better future guidance**.

Different organizations may emphasize possession, counter-pressing, free play, creativity, tactical periods, inclusion or other approved philosophies. TIE should expose the selected methodology and cite the specific reasoning behind proposals; no single framework is imposed by default. Club flexibility never excuses unsafe instructions or violation of applicable competition constraints.

The MVP must first succeed with **coach-entered observations** and usable outputs. Automatic full-match video analysis, opponent scouting integrations, retrieval of approved documents, cross-sport intelligence and autonomous prescriptions follow only after accuracy, rights and security are validated.

See [TIE Product Specification](tie-product-spec-v0.md).

## 6. Business model hypotheses

The revenue model may combine individual coaching subscriptions, club/application bundles, verified nonprofit discounts, enterprise services and future optional B2B licensing for TIE. These are **hypotheses**, not approved prices or proven unit economics.

Test customer willingness to pay and willingness to integrate before charging. Do not add billing screens, sales claims, AI credits or paid service-level agreements without a scoped commercial plan, unit-cost estimates and legal review.

## 7. Product boundaries

- **Club Vivo is the sole customer-facing platform.** TIE is an application within it.
- The historic SIC backend code and infrastructure remain necessary engineering implementation boundaries until deliberately changed.
- A single login and trusted tenant identity should serve enabled applications; sharing user context must not enable unauthorized cross-module or cross-tenant reads.
- Modules have explicit dependencies, versioned data contracts and safe failure paths.
- The first practical target is a great soccer TIE experience inside a credible Club Vivo Home, **not** six superficially complete apps.

## 8. Roadmap (directional, not committed dates)

| Horizon | Goal | Exit evidence |
| --- | --- | --- |
| Foundation now | Document product and architecture, save frontend branch, avoid release | Documented sources and draft PRs |
| Next verification phase | Visual, mobile and keyboard testing; live test-environment auth/tenancy; Amplify compatibility | Review evidence and authorization sign-off |
| TIE pilot | Coach-entered match evidence; approved methodology-aware training brief; coach review and usable existing plan | Pilot feedback, reproducible outputs, validation tests |
| Organizational foundation | Verified club creation, invitations, scoped roles and modular enablement | Tenant/security tests and real onboarding trials |
| Intelligence expansion | Selective video analysis, opponent context, advanced diagrams and cross-sport packs | Measured quality, rights/privacy checks, cost caps |
| Business applications | Operations, reporting, membership and services based on pilot demand | Demonstrated need, financial viability and authorization checks |

Every stage needs a small, testable product slice, not just more infrastructure.

## 9. Acceptance criteria for the platform vision

- A small coach-led club and a larger organization can use the same product identity without sharing each other's data.
- Users can understand what is available now versus planned later.
- Admin/coach/other role presentation is truthful but is not treated as security authorization.
- TIE can ultimately demonstrate two different, approved methodology profiles producing **meaningfully different, explained recommendations from the same evidence**, subject to identical safety rules.
- No AI result is presented as a verified match fact unless evidence supports it.
- Generated practice duration, equipment and age constraints are validated.
- Operators can see errors, estimate AI cost, revoke access and respond to data incidents.

## 10. Source and decision precedence

1. Applicable legal and safety obligations.
2. Existing secure runtime contracts and approved architecture decisions.
3. Tested implementation source at a named revision.
4. This blueprint, approved feature specs and later ADRs.
5. Exploratory concepts and research.

A new product vision **does not silently override** a secure existing contract. If it changes behavior or architecture, propose the change, record the ADR, implement it on a branch, test it and obtain review.

### Source references

- [Club Vivo main and branches](https://github.com/mrleom/club-vivo)
- [Design PR #3](https://github.com/mrleom/club-vivo/pull/3)
- [SIC architecture principles](https://github.com/mrleom/sports-intelligence-cloud/blob/main/docs/architecture/architecture-principles.md)
- [SIC methodology v1](https://github.com/mrleom/sports-intelligence-cloud/blob/main/docs/product/club-vivo/methodology.md)
- [SIC training-prescription direction](https://github.com/mrleom/sports-intelligence-cloud/blob/main/docs/product/club-vivo/training-prescription-layer.md)
