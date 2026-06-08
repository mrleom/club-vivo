# Club Vivo on Sports Intelligence Cloud

## Purpose

This document explains how the public Club Vivo web app connects to Sports Intelligence Cloud, SIC.

Club Vivo is the coach-facing product experience. SIC is the tenant-safe SaaS platform behind it. The public Club Vivo repo should be easy to understand on its own, while still making clear that the protected backend behavior lives in the SIC platform.

## Mental model

```text
SIC = the SaaS platform
Club Vivo = the coach-facing app
Session Builder = the main product wedge
```

A coach experiences Club Vivo. The platform work behind authentication, tenant boundaries, protected APIs, storage, exports, and operations is handled by SIC.

## Architecture in plain English

A coach signs in to Club Vivo and uses the Coach Workspace.

Club Vivo protects workspace routes, stores session tokens in HttpOnly cookies, and calls the configured SIC API from server-side code. SIC verifies identity, resolves tenant context, enforces tenant-safe data access, and returns only the data the coach is allowed to use.

The product is simple on the surface and strict underneath.

## What lives in this repo

This repo contains the public Club Vivo web app:

- Next.js web app
- Coach Workspace UI
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