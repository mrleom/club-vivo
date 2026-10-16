# Club Vivo — Execution Plan v1

**Status:** Proposed working execution plan. Product direction is established; specific implementation work still requires issue-level review and technical validation.
**Updated:** 2026-10-15. **Branch:** `feat/club-vivo-salt-design` (stacked on draft Home PR #2).
**Release status:** No new UI redesign merged to main; no Amplify deployment authorized.

## 1. The rule for our next phase

We are exiting open-ended brainstorming and moving to **evidence-driven execution**.

New feature ideas go into a **Parking Lot** (future GitHub issues labeled `idea`) unless they address the current milestone, an urgent security problem, or an evidenced pilot need. Don't silently incorporate future concepts into current release requirements.

The next goal is not a complete sports operating system. It is a trustworthy **Club Vivo Home with a useful soccer-first TIE application**, a testable pilot journey, and responsible, metered hosting.

## 2. Where decisions live

| Question | Canonical owner |
| --- | --- |
| Why the product exists, audience, principles, apps | [Master Blueprint](product/club-vivo-master-blueprint.md) |
| What is being built now and next; milestone gates | **This Execution Plan** and linked GitHub Issues |
| How the system actually works and its boundaries | [System Architecture](architecture/club-vivo-system-architecture.md), versioned API contracts, source code |
| What TIE must do and how to validate it | [TIE Specification](product/tie-product-spec-v0.md) |
| Free vs premium product rules and hypotheses | [Access and Pricing Principles](product/access-and-pricing-principles-v0.md) |
| Why a consequential choice was made | [Architecture Decision Records](decisions/ADR-0001-one-platform-amplify.md) and future ADRs |
| Whether code works | Commit/PR diff + tests + reproducible authorized environment evidence |
| What is released | GitHub main/release tags **and** documented deployment environment evidence |

**Important:** GitHub stores all these artifacts, but source code is not a substitute for product direction, and a future roadmap statement is not proof of implementation.

## 3. Milestones, in dependency order

### M0 — Make Club Vivo understandable and governable

**Goal:** one current project reference and unambiguous next priorities.

**Deliverables**
- Documentation index, Master Blueprint, current/future architecture, TIE v0 specification, documentation standard and decision records.
- Add this Execution Plan, access/pricing principles, a decision log and a small prioritized GitHub Issue backlog.
- Reconcile prior accepted SIC decisions versus the new Club Vivo-facing direction in a future ADR without modifying current authentication/tenancy contracts.
- Identify a narrow pilot audience and a first real coach problem; KSC remains a candidate pilot, not an assumption.
- Document all currently-shipped, source-present, preview-only, and unbuilt features in one release-readiness checklist.

**Exit evidence:** all documents link correctly, current PRs are identified, and every next-step task has a clear priority, dependency and measurable acceptance criteria.

### M1 — Verify existing Home and TIE before expanding

**Goal:** prove the saved implementation behaves correctly.

**Deliverables**
- Review PR #2 (Club Vivo Home) and stacked PR #3 (SALT-inspired design) with desktop, tablet and mobile screenshots.
- Confirm Next.js/AWS Amplify runtime compatibility; evaluate `latest` dependency declarations and pin versions via a separately tested change.
- Confirm login, OAuth callback, cookie controls, logout, denied roles and cross-tenant rejection against an authorized test backend.
- Validate practical TIE workflow: build soccer training, quick activity, save, list, review, export and feedback.
- Accessibility (keyboard/focus/contrast), useful empty and error states, responsive navigation, and documentation alignment.
- Record security, cost, rollback and environment configuration before considering staging.

**Exit evidence:** passing CI + dated manual QA report + authorized integration tests + identified compatibility resolution and no critical blockers.

**Release rule:** review/merge/deploy only after explicit approval. At present, no release is authorized.

### M2 — Free essential coaching and responsible usage measurement

**Goal:** useful training creation at a sustainable cost.

**Deliverables**
- Define the exact free TIE capability: basic session creation, quick games, saved plans and reasonable usage caps; determine which functionality should be deterministic.
- Meter server-side billable events without recording unnecessary athlete/child data.
- Model per-active-coach/club infrastructure cost, support cost and quota abuse cases.
- Document upgrade boundaries clearly; make the free tier useful without requiring a credit card by default (proposed, subject to cost controls).
- Specify organization-sponsored premium seats as a proposed option, not yet a final billing contract.

**Exit evidence:** a successful real coach workflow on the free tier, tested quota denial/recovery, estimated monthly unit economics and a privacy-reviewed telemetry model.

### M3 — Organization Studio minimum viable structure

**Goal:** support an actual club rather than a static admin page.

**Deliverables**
- Approved organization/team/program/member data model and reliable verified admin ownership.
- Least-privilege role definitions, invitations and membership changes, server-side authorization tests.
- Onboarding for individual coach versus club, without arbitrary tenant switching or security shortcuts.
- Minimum organization overview based on real data; no invented financial indicators.

**Exit evidence:** an organization can safely enroll one admin and coach, create a team and grant/revoke appropriate access in an authorized test environment.

### M4 — TIE's first genuinely differentiated intelligence loop

**Goal:** translate human-entered match observations into practical approved training.

**Deliverables**
- Typed observations with provenance and confidence.
- Two approved methodology profiles producing meaningfully different but safe recommendations from the same evidence.
- Explained Training Brief, coach edits/rejects/approves, handoff to current training creation.
- Validated age/time/space/equipment feasibility, saved result and coach feedback.
- No claim of automated video scouting or opponent data collection.

**Exit evidence:** a pilot coach can trace evidence → philosophy → suggested objective → practice plan and confidently edit/approve the outcome.

### M5 — Small responsible pilot and product/market validation

**Goal:** prove usefulness before scaling.

**Deliverables**
- A small group of consenting pilot coaches/clubs and a simple baseline comparison.
- Metrics: successful plan completion, time saved, corrections, retained use, user trust, AWS cost per active account and per premium inference.
- Interview notes and prioritized bug/feature feedback without storing unnecessary identifying child data.
- Revise tier assumptions and roadmap from the evidence.

**Exit evidence:** an explicit continue/change/stop decision using measured pilot outcomes.

### M6 — Commercial and application expansion (only after M1–M5 evidence)

- Premium weekly/season planning; bounded match-to-match recommendations.
- Video analysis with footage rights, processing quotas and consent/retention design.
- Membership, parent portal, inventory and BI based on validated club demand.
- Payments, organization-sponsored app subscriptions, nonprofit program economics.
- Integrations/licensing and sport-neutral expansion when core soccer value is proven.

**Explicit parking lot:** 7Q board game, full autonomous video understanding, edge/hybrid service marketplace, broad multi-sport rollout, complex enterprise finance. Preserve those ideas as proposals, not deadlines.

## 4. First GitHub backlog (recommended issue titles, not yet created)

| Order | Proposed Issue | Milestone |
| --- | --- | --- |
| 1 | Verify Club Vivo Home PR #2 and redesign PR #3, including mobile | M1 |
| 2 | Resolve pinned Next.js version and Amplify SSR compatibility | M1 |
| 3 | Test real Cognito login, entitlement and cross-tenant-denial flows | M1 |
| 4 | Complete TIE end-to-end training flow regression and export checks | M1 |
| 5 | Define free TIE core features, limits, metering and AWS cost baseline | M2 |
| 6 | Decide individual coach vs club account onboarding and owner roles | M3 |
| 7 | Approve minimal organization/team/membership schema and permissions | M3 |
| 8 | Specify match observations and two methodology-based Training Briefs | M4 |
| 9 | Recruit/pick the first real pilot coach/club and success criteria | M5 |
| 10 | Audit historical ADRs and migrate superseded product wording | M0 |

These titles deliberately distinguish **planned tasks** from GitHub issues that have actually been opened. Create/assign issues only once their acceptance criteria and owner are clear.

## 5. How we use GitHub

**Repository:** `mrleom/club-vivo`, the central project home.

**Default branch:** `main`, stable reviewed code; no automatic deployment implied.

**GitHub Issue:** one goal/bug/decision with observable acceptance criteria, owner and milestone.

**Branch:** isolated development area for the issue, e.g., `feat/tie-match-evidence`.

**Commit:** one saved snapshot with meaningful description and no secrets.

**Draft PR:** work in progress for review, discussion, CI and screenshots; cannot be assumed ready to merge.

**Pull request merge:** promotes reviewed and approved branch changes into target branch; deployment is a separate authorized process.

**GitHub Project board:** optional visual board pulling linked issues and PRs into `Backlog → Ready → In Progress → Review → Done`. Do not copy work-item truth into another spreadsheet.

**Close issue** when its acceptance criteria have verifiable evidence, not just because code was written.

## 6. Definition of Done for a feature

A feature is not done unless:
- [ ] Its intended user and outcome are explicit.
- [ ] Current-vs-future behavior is truthful.
- [ ] Relevant authorization, tenancy, validation, privacy and safety requirements are met.
- [ ] Code and versioned API/data contracts agree.
- [ ] Tests cover successful and denied/invalid paths.
- [ ] Browser/mobile review exists for UX changes.
- [ ] Cost/usage risk is understood where AWS or AI resources are involved.
- [ ] Docs/ADR are updated and the PR identifies the linked Issue.
- [ ] An authorized reviewer approves merge; if deployed, the environment and release evidence are documented.

## 7. What we are deliberately NOT deciding yet

- Actual subscription prices or number of AI/video credits.
- Whether every club workspace is permanently free at every scale.
- Whether organization-sponsored premium seats are per-person, per-team or bundled.
- Production method of video processing and retention.
- Replacing the current internal SIC backend repository or exposing its old label to customers.
- AI-only training prescriptions without a human review step.

These require usage data, customer research, technical safeguards or an explicit decision.

## 8. Links

- [Documentation index](README.md)
- [Master Blueprint](product/club-vivo-master-blueprint.md)
- [Current Architecture](architecture/club-vivo-system-architecture.md)
- [TIE Specification](product/tie-product-spec-v0.md)
- [Access and Pricing Principles](product/access-and-pricing-principles-v0.md)
- [Documentation Standard](governance/documentation-standard.md)
- [Home PR #2](https://github.com/mrleom/club-vivo/pull/2)
- [Design PR #3](https://github.com/mrleom/club-vivo/pull/3)
