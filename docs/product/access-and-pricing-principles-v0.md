# Club Vivo — Access and Pricing Principles v0.1

**Status:** Proposed product/business rules informed by founder discussion; **not implemented billing, subscription terms, prices or quotas**.
**Updated:** 2026-10-15.

## 1. Product thesis

**Make essential sports and club tools genuinely useful for free; charge when intelligence, coordination, automation and specialized services provide additional measurable value.**

Free access exists to lower barriers for small clubs and individual coaches, to establish trusted product utility, and to enable usage-informed improvement. Free users must not be treated as products whose private athlete or club data is automatically resold or repurposed.

A free coach can begin with a useful training workflow. Premium TIE unlocks deeper intelligence. A free club can have practical organization basics, while verified organization services and advanced BI have a sustainable price.

**Metaphor, not pricing mechanics:** first deliver water to those who need it; additional services help organizations grow. Do not create bait-and-switch traps in essential workflows.

## 2. Capability tiers — product hypothesis, not public offer

| Surface | Proposed free essentials | Premium hypotheses |
| --- | --- | --- |
| TIE coaching | Basic, validated soccer practice creation; quick activity; bounded saved/reused plans | Evidence-to-training insight, advanced methodology alignment, weekly or seasonal training plans |
| TIE video | No required video analytics for basic use | Short bounded trial; then metered video-minutes/storage/AI analysis |
| Club Home | Verified personal/club workspace, basic role-aware access | Advanced admin settings, teams/program management and multi-role delegation |
| Equipment | Lightweight equipment reference | Shared inventory, lifecycle workflows, usage analytics |
| Parents/guardians | Essential club information and access without parent subscription for basic necessities | Enhanced organizational communication/integration tools paid by club, not a paywall on essential child information |
| Business Intelligence | Basic status and simple organization view | Membership/financial/operational reports, forecasts and deeper workflow automation |
| Support/integration | Self-service knowledge | Setup, migration, consulting, integration/enterprise services |

**Implementation honesty:** parent portal, real inventory management, BI, true organization management, video analysis and advanced TIE prescriptions are not current released capabilities. This table is a feature-packaging hypothesis.

## 3. Who pays? (proposed)

- Independent coach may purchase premium TIE directly.
- An organization may sponsor or bundle access to premium TIE for its authorized coaches; do not charge a volunteer twice for the same enabled feature.
- Some specialized modules may be purchased by the organization rather than each end user.
- A larger organization may pay for support, data integrations and higher resource allowances.
- Billing boundaries must align with backend entitlements. A hidden card or role badge does not enable a paid capability.

Exact per-person/per-organization pricing and eligibility remain undecided. Offer nonprofit-friendly access without promising a discount amount yet.

## 4. Trial and usage policy (proposed)

- Essential free features must remain operationally sustainable at a published reasonable allowance.
- No need for video processing, purchased hardware, private footage or a paid analyst to get a useful training plan.
- Premium trials should be **time limited and usage capped** with clear expiration terms, not silently unlimited.
- Each high-cost operation must have server-side quota enforcement, failure handling, and controlled concurrency.
- If credits run out, the product should explain the limit and retain access to permitted free features and the user's own data.
- Quotas may be adjusted using measured costs and user feedback, subject to transparent notice.

**No price, storage allowance, AI credit amount, match minutes, or trial length is decided by this document.**

## 5. AWS unit economics we must learn

Measure, in a privacy-minimizing manner:
- hosting build/storage/transfer/server execution;
- API requests, Lambda runtime, database reads/writes, S3 storage/exports;
- inference cost per TIE intelligent recommendation;
- video transfer, processing, storage and retention if/when built;
- active-user support cost, error/failure rates and abuse/protection controls.

A proposed financial model should compare:

```text
Gross margin per paid customer
  = subscription receipts
  - attributable cloud/AI/video costs
  - payment processing and directly attributable service costs

Contribution from entire tiered product
  = paid contribution
  - bounded free-tier variable costs
  - attributable customer support/onboarding costs
```

These formulas are conceptual. No projected earnings or percentages should be represented as observed facts.

## 6. Product learning without exploiting private data

For improving Club Vivo:
- Prefer counts of feature use, error rates, performance, time-to-plan and voluntary coach rating.
- Minimize or aggregate telemetry whenever possible, publish a comprehensible notice, define retention and access.
- Separate account/organization records, identifiable athlete data, private match footage, coaching evaluations and medical information from generic usage analytics.
- Any optional use of identifiable recordings/content for model evaluation or improvement requires an appropriate rights, permission and consent design, especially with minors.
- Never train general-purpose models on private club content merely because a user took a free tier.
- Provide export/deletion processes and security incident playbooks before handling sensitive information at scale.

Safeguarding, privacy, and applicable law override pricing and growth objectives.

## 7. What happens next

The first billing task is **not** building a checkout page.

1. Validate Club Vivo Home and the existing TIE flow.
2. Measure expected and actual cost of basic deterministic training.
3. Specify free and premium capabilities with observable user value.
4. Design backend-owned entitlement and server-side quota contracts.
5. Test a limited, bounded pilot with real coaches and club operators.
6. Set price and packaging only after validated unit economics and customer interviews.

## 8. Open decisions

- Should a free individual coach receive all current TIE planning features indefinitely within quotas?
- Should a free club allow unlimited staff or a bounded number of active coaches?
- How will a club sponsor individual premium coaches?
- Which business modules must be free because they are essential for parents/athletes?
- Trial duration, processing allowances and cancellation/downgrade rules.
- Paid plan boundaries and nonprofit/education eligibility.
- Whether advanced organization reports depend on a paid organization plan or separate module licenses.

Link final answers from an approved future pricing/billing ADR; do not hardcode policy in UI ahead of backend controls.

## Links

- [Master Blueprint](club-vivo-master-blueprint.md)
- [Execution Plan](../EXECUTION-PLAN.md)
- [System Architecture](../architecture/club-vivo-system-architecture.md)
