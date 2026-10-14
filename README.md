# Club Vivo

Club Vivo is one modular Sports and Business Intelligence platform for sports organizations, including clubs, academies, schools, and nonprofits.

TIE is its first flagship app: the existing coaching workspace and soccer session planning tools. Club Vivo Home brings that work into a shared organization workspace with role-aware navigation and an applications hub.

It starts with a simple idea: coaches should spend less time fighting blank pages and more time helping players learn, move, compete, and enjoy the game.

The first available application, TIE, includes a soccer session builder that helps coaches create practical training sessions from team context, time, space, equipment, and objective.

## What it does

Club Vivo helps a coach turn real-world constraints into a useful training plan.

A coach can start with:

- who they are coaching
- how much time they have
- what space and equipment they have
- what they want the team to improve

Club Vivo then helps shape a session that is easier to run on the field.

## Current app

This repo currently contains the Club Vivo web app.

Current product surfaces include:

- Club Vivo Home, organization context, and role-aware navigation
- Applications hub with explicit coming-soon modules
- TIE Coach Workspace
- Session Builder
- Quick Soccer Game
- Saved Sessions
- Feedback and export paths where available

The frontend is built with Next.js.

Club Vivo connects to a private AWS backend for login, protected API access, saved sessions, and tenant-safe data.

## Simple architecture

Club Vivo is intentionally simple on the surface and protected underneath.

At a high level:

- **Next.js** powers the web app.
- **Amazon Cognito** handles login.
- **API Gateway and Lambda** power the backend API.
- **DynamoDB** stores tenant-scoped product data.
- **AWS Amplify** hosts the web app.

The public repo shows the web app. Private backend values stay outside the repo.

## Club Vivo Web App Architecture

Club Vivo is the shared Next.js product. Users sign in through Cognito and enter Club Vivo Home. Coaches open TIE to work in the existing Coach Workspace; admin-like roles also see the organization overview. Sports and business modules grow inside this product.

The main product wedge is Session Builder. It turns coach input into a generation request and returns a coach-ready session that can be saved, exported, and improved with feedback.

![Club Vivo Web App Architecture](docs/architecture/club-vivo.drawio.png)

## Club Vivo and SIC

Club Vivo is the user-facing platform, with TIE as its first application.

Sports Intelligence Cloud, SIC, is the tenant-safe technical foundation behind it. It supplies the existing auth, API, storage, and entitlement contracts.

Club Vivo stays simple on the surface, while SIC handles authentication, protected API access, tenant context, data boundaries, exports, observability, and infrastructure.

![SIC Backend Platform for Club Vivo](docs/architecture/sic-backend-platform.png)

In practice:

- Club Vivo uses **Next.js** for the web app.
- Club Vivo uses **Cognito Hosted UI** login through private backend configuration.
- Club Vivo stores session tokens in **HttpOnly cookies**.
- Club Vivo calls the protected SIC API with **bearer tokens**.
- SIC verifies identity, resolves tenant context, checks entitlements, and allows tenant-scoped data access.
- Private backend values stay outside this repo.

Architecture docs:

- [Club Vivo on Sports Intelligence Cloud](docs/architecture/club-vivo-on-sic.md)
- [Club Vivo on SIC Mermaid Diagram](docs/architecture/club-vivo-on-sic-mermaid.md)

## Why this matters

Many nonprofit sports organizations do important work with limited time, limited staff, and limited tools.

Club Vivo is built to support those organizations with practical software that is simple enough for real coaches and structured enough to grow into a stronger sports intelligence platform over time.

## Private configuration

Club Vivo connects to a private AWS backend.

Local and production configuration are handled outside the repo. Real values are never committed.

Developers can use `.env.example` as a blank local template when needed. Amplify stores production values privately in its environment settings.

## Development

```bash
npm ci
npm run dev

npm test
npm run typecheck
npm run build
```

## Home v1 scope

See [Club Vivo Home v1](docs/product/club-vivo-home-v1.md) for routes, role presentation, Constitution grounding, and verification. Organization profiles, staff management, financial reporting, broader sports analytics, and Security & Edge are coming soon. TIE preserves the existing soccer workflows and backend contracts. No sample organization metrics or new backend permissions are introduced.
