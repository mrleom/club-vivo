# Club Vivo — Design and Product Direction v1

**Status:** Design implementation draft. **Branch:** feat/club-vivo-salt-design.
**Parent work:** feat/club-vivo-home, PR #2. This is a stacked follow-up and is not merged or deployed.

## North star

Club Vivo is **one unified Sports and Business Intelligence SaaS** for sports organizations. It supports different club philosophies, structures, sports, budgets, roles, and workflows. **TIE (Training Intelligence Engine)** is the first flagship application inside this platform.

The public product should describe Club Vivo and TIE. Legacy architecture names and low-level implementation labels belong in developer documentation only, not in new marketing copy, branding, or the top-level application hierarchy.

## Why this visual direction?

The SALT project (mrleom/SALT-Portafolio; \`frontend/styles.css\`, \`frontend/workspace.jsx\`) shows a useful dark workspace layout:
- Navy background, fixed desktop sidebar, mobile-safe navigation, and a slim top bar.
- Cyan for primary activity, violet and amber for secondary emphasis.
- Quiet metrics, bordered panels, precise hierarchy, compact labels, and a strong flagship feature panel.
- Role-aware navigation and explicit human review, instead of fictitious dashboard data.

Club Vivo translates those patterns to a differentiated product: TIE, team and club context, and a modular sports/business applications hub. SALT code and data contracts are **not** imported.

## Routes / surfaced capabilities

| Route | Purpose | State |
| --- | --- | --- |
| \`/\` | Public Club Vivo introduction, TIE flagship positioning | Public |
| \`/login\` | Consistent visual sign-in entry; keeps protected auth routes | Public |
| \`/home\` | Verified role, plan and application-access summary | Existing read-only context |
| \`/tie\` | The live coaching workspace under TIE brand | Existing soccer planning tools |
| \`/applications\` | Sports and Business Intelligence application directory | TIE live, others marked coming soon |
| \`/organization\` | Admin-only overview based on known role/plan | Read-only, no invented organization metrics |
| \`/sessions/new\`, \`/sessions\`, other coaching routes | Existing functional workflow URLs | Preserved |

Do not present video analysis, match prediction, automated training prescription, multi-sport generation, business dashboards, payments or organization invites as shipped.

## Experience principles

1. **Unified product:** one Club Vivo identity and user workspace.
2. **TIE first:** prominent active entry into meaningful existing tools, not a mocked intelligence screen.
3. **Truthful states:** only verified existing data; future applications have no live launch links.
4. **Human-led intelligence:** coaches own their decisions; TIE should eventually provide reviewable reasoning and evidence.
5. **Methodology-agnostic by design:** club-approved coaching principles should drive future recommendations; association rules and athlete safeguards remain higher-priority constraints.
6. **Accessible and practical:** responsive, keyboard-focused, reduced-motion aware; works for volunteer coaches as well as administrators.
7. **Secure by construction:** UI role styling never replaces server authorization, tenancy or entitlements.

## SALT-inspired visual tokens

- Background: #080d19
- Sidebar: #0b1220
- Panels: #111a2b to #162236
- Borders: #253249
- Primary text: #e9edf7
- Muted text: #a3b0c7
- Action cyan: #6ae4e0
- Complementary violet: #b7a3ff
- Complementary amber: #f3c782

These colors are scoped to the new Club Vivo platform surfaces; old coaching forms retain their readable light styling while they transition.

## Next design and engineering review

- Inspect desktop, tablet and mobile at real browser widths.
- Run \`npm ci\`, \`npm test\`, \`npm run typecheck\`, \`npm run build\`.
- Exercise sign-in / sign-out, both role types, and all TIE actions against an authorized test backend.
- Verify contrast, focus, table scroll, sticky header/sidebar, and reduced motion.
- Gradually align legacy coaching pages with TIE branding without changing API or data contracts.
- Design organization creation and methodology profiles in a separate approved spec; do not fake them in the UI.
- Future TIE: entered match evidence -> club methodology -> proposed plan -> coach approval -> field feedback, then video later after validation.

## Release policy

This branch is an unmerged design iteration. Neither this document nor a successful UI build constitutes a production release or validation of security guarantees. No live backend contracts, authentication, tenancy, IAM, CDK, or deployment configuration should be changed by this design iteration.
