# Club Vivo — Documentation Working Agreement

**Status:** Working agreement v0.1.  
**Applies to:** Club Vivo product, TIE, frontend, platform infrastructure, privacy/security, research, deployment and operations.

## Goal

**No major product change without an explainable, reviewable record of its purpose, behavior, architecture, safety implications and verification.** Documentation is a living project asset, not a retrospective marketing exercise.

The term "Bible" is a metaphor for complete organizational understanding. Our formal reference is the [Club Vivo Master Blueprint](../product/club-vivo-master-blueprint.md), supported by concrete implementation documents.

## 1. Documentation categories and ownership

| Category | Where | Must contain |
| --- | --- | --- |
| Product-wide vision | `docs/product/club-vivo-master-blueprint.md` | Mission, audiences, product principles, module scope, roadmap |
| Application specification | `docs/product/` | Problem, actors, requirements, status, stories, edge cases, metrics |
| Technical architecture | `docs/architecture/` | Systems, diagrams, interfaces, failure paths, security, data, hosting |
| Architectural decision | `docs/decisions/ADR-*.md` | Context, options, decision, consequences and migration |
| Implementation/change evidence | PR body and `docs/` as needed | Diff summary, tests, environment, failures, approvals |
| API and data contracts | `docs/api/` (future local contracts), with existing backend repository contracts referenced until migrated | Schemas, versioning, validation, errors, authorization |
| Release/runbook | `docs/runbooks/` (when needed) | Deploy/rollback, incident, access, recovery and cost procedures |
| Research and customer findings | `docs/research/` (when added) | Dated sources, hypotheses, interviews without unnecessary sensitive data |

**No duplicate source of truth:** link to an authoritative technical contract instead of copying and allowing it to drift. Existing backend contract documents remain authoritative until a reviewed architecture migration.

## 2. Every document identifies its status

Use one of:

- **Vision:** long-term direction, not a committed release.
- **Proposed:** idea/spec awaiting a technical or product decision.
- **Accepted:** a decision or documented rule, not necessarily implemented code.
- **Implemented (source):** code exists on a named branch/commit.
- **Validated (environment):** specified tests passed, with evidence and limits.
- **Released:** change merged, deployed in a named environment, observed and approved.
- **Deprecated:** retained for traceability, replaced by a linked newer document.

An engineering diagram must label planned components separately from current runtime. A GitHub draft PR is not a production release.

## 3. Template: before coding a feature

Copy this checklist into a feature specification or PR:

```text
Feature name / version:
Business problem and beneficiary:
Who is allowed to use it and in which organization:
What works now vs what is proposed:
User journey and failure/empty states:
Inputs, validation, output and source-of-truth data:
API contract and data ownership:
Authorization, tenancy, child safeguarding and privacy implications:
Club methodology and applicable sporting-rule considerations:
Accessibility and localization:
AI behavior, model limitations and review points (if any):
Cost drivers, quotas and observability:
Dependencies and migration plan:
Acceptance tests / negative tests:
Rollback and data recovery:
Screenshots or UX checks (when relevant):
Decision owner / approval / date:
Evidence links and known limitations:
```

## 4. Code review / pull-request agreement

1. Work in a feature branch; never commit experiments, secrets or test records to `main`.
2. Before code: inspect active product requirements and existing API/tenant contracts.
3. Name exactly which routes, components and data domains will change.
4. Prefer one small vertical slice; don't build five modules only to demonstrate navigation.
5. Implement contract validation, security/tenant-denial and failure tests for relevant changes.
6. Run reproducible checks and record command, environment, date, outcome and caveat.
7. Update relevant diagrams, contracts, screenshots, change log, ADR and docs index as part of the change.
8. For UI changes, verify desktop, mobile, keyboard and meaningful empty/loading states.
9. For AI changes, document provenance, cost guards, model limits, unsafe-output handling and approval workflows.
10. Keep PR **draft** until the user explicitly approves review readiness. Do not merge/deploy without authorization.

## 5. Architecture decision records (ADRs)

Write an ADR when changing:
- product/app boundary, repository strategy or deployment model;
- tenant identity, authorization, cross-module data-sharing or role model;
- a persisted data schema or public API;
- AI inference/retrieval strategy or methodology priority;
- hosting, edge, retention or security posture;
- behavior with significant user safety or recurring cost impact.

**ADR template:**

```text
Title and ADR number:
Status: Proposed / Accepted / Superseded
Date:
Context:
Decision:
Options considered:
Consequences / trade-offs:
Security, privacy and cost effects:
Compatibility/migration:
Tests and review gates:
Supersedes / related ADRs:
```

Accepting an ADR does not replace deploying, testing or measuring its consequences.

## 6. Evidence discipline

- Capture commit/ref, not just "the code worked before."
- Link to GitHub Actions and name exact test steps. Distinguish a simulated API or mocked identity from production verification.
- If a screenshot/visual browser review has not occurred, say so.
- Do not use estimated business revenue or unsupported research prices as observed facts.
- Date third-party guidance and check that a license permits the intended use.
- Never publish authentic credentials, personally identifiable children's match data, private footage or tenant records.

## 7. Milestone and release gates

A feature is **ready to discuss** when its purpose and boundaries are documented.  
It is **ready for implementation** when interfaces, risks and acceptance tests are defined.  
It is **ready for review** when implementation and tests are traceable.  
It is **ready for release** only after authorized environment checks, safety/privacy review where needed, approved deployment steps and human permission.

For current Club Vivo Home + SALT-style design: code is saved in draft branches; earlier CI was successful, while real browser QA, Cognito test login, Amplify runtime compatibility and live tenant-denial tests remain deferred.

## 8. Cadence for a solo developer

After every meaningful feature, update:
- One concise PR/progress record (what changed, why, what was verified).
- The relevant product spec or acceptance criteria.
- Architecture or API docs **only if a boundary changed**.
- An ADR **only if a new decision was made**.
- Next actions and known risks.

After every product milestone: revisit the Master Blueprint, archive superseded statements, link test evidence and avoid rewriting history.

## 9. Links

- [Documentation home](../README.md)
- [Master Blueprint](../product/club-vivo-master-blueprint.md)
- [Current architecture](../architecture/club-vivo-system-architecture.md)
- [Platform and hosting decision](../decisions/ADR-0001-one-platform-amplify.md)
