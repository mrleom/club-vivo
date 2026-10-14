# Club Vivo on Sports Intelligence Cloud

## Purpose

This document explains how the public Club Vivo web app connects to Sports Intelligence Cloud, SIC.

Club Vivo is one modular Sports and Business Intelligence product. TIE is its first flagship application and contains the existing coaching workspace. SIC is the tenant-safe technical foundation behind the product. The public Club Vivo repo should be easy to understand on its own, while still making clear that the protected backend behavior lives in the SIC platform.

## Mental model

```text
Club Vivo = the shared product and organization Home
TIE = the first flagship application, containing Coach Workspace
Session Builder = the existing coaching workflow inside TIE
SIC = the technical auth, tenancy, API, and storage foundation
```

A coach experiences Club Vivo. The platform work behind authentication, tenant boundaries, protected APIs, storage, exports, and operations is handled by SIC.

## Architecture in plain English

A user signs in to Club Vivo and enters Home. A coach opens TIE to use the existing Coach Workspace. Admin-like roles additionally see a read-only organization overview and planned business modules.

Club Vivo protects workspace routes, stores session tokens in HttpOnly cookies, and calls the configured SIC API from server-side code. SIC verifies identity, resolves tenant context, enforces tenant-safe data access, and returns only the data the coach is allowed to use.

The product is simple on the surface and strict underneath.

## What lives in this repo

This repo contains the public Club Vivo web app:

- Next.js web app
- Club Vivo Home, Applications hub, and organization overview
- TIE Coach Workspace UI
- Session Builder UI
- Quick Soccer Game UI direction
- Teams, Equipment, Methodology, and Sessions screens
- Auth helpers and API helpers
- Frontend route protection through `proxy.ts`
- Local development template through `.env.example`

This repo does not need real backend values to explain the product. Private configuration stays outside the repo.

## What lives in SIC

Sports Intelligence Cloud provides the backend SaaS platform foundation:

- Amazon Cognito authentication
- API Gateway HTTP API
- Lambda route handlers
- Shared platform wrapper for logging, errors, and tenant context
- Tenant entitlements
- DynamoDB tenant-scoped product data
- S3 tenant-scoped session exports
- CloudWatch operations
- CDK infrastructure as code

## Request flow

1. Coach opens Club Vivo.
2. Protected route checks for `sic_access_token`.
3. Coach signs in through Cognito Hosted UI if needed.
4. Club Vivo stores session tokens in HttpOnly cookies.
5. Club Vivo server code calls the SIC API with an `Authorization: Bearer` token.
6. SIC validates the token.
7. SIC resolves tenant context from verified identity and authoritative entitlements.
8. SIC routes to the right domain API, such as `/me`, `/teams`, `/session-packs`, or `/sessions`.
9. SIC reads or writes tenant-scoped DynamoDB and S3 data.
10. Club Vivo renders the result for the coach.

## What this repo does not claim

This repo does not expose the full backend source, AWS account values, real Cognito IDs, real API URLs, or secrets.

It does not claim to contain the whole SIC platform.

It is the public Club Vivo web app connected to SIC through private configuration.

## Related diagram

See [Club Vivo on SIC Mermaid Diagram](club-vivo-on-sic-mermaid.md).

## Home v1 integration boundary

The protected layout resolves the existing `/me` contract for authoritative workspace context and role presentation. New Home, Applications, TIE, and Organization routes reuse that identity; request-scoped React caching deduplicates the lookup within those new surfaces. The new protected routes join the existing proxy guard. Original coaching URLs, cookies, server actions, payloads, and domain API adapters are retained.

The application catalog controls labels and availability presentation only. SIC still controls action authorization and tenant isolation. There is no client tenant selector, separate sign-in, new service, or schema change. Business Intelligence, Organization Operations, Athlete Development, Sports Insights, and Security & Edge are planned states with no launch action.

See [Home v1](../product/club-vivo-home-v1.md). Existing diagram images depict the coaching baseline; the updated Mermaid view describes the new product framing.
