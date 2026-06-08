# Club Vivo on SIC Mermaid Diagram

## Purpose

This diagram shows how the public Club Vivo web app connects to Sports Intelligence Cloud, SIC.

```mermaid
flowchart TD
  Coach["Coach / coach-admin"]

  subgraph ClubVivo["Club Vivo web app"]
    Web["Next.js app"]
    Proxy["Protected route check<br/>proxy.ts"]
    Shell["Coach Workspace shell"]
    Product["Session Builder / Teams / Equipment / Methodology / Saved Sessions"]
    ApiHelpers["Server-only API helpers<br/>lib/api.ts + feature API helpers"]
    Cookies["HttpOnly auth cookies<br/>sic_access_token"]
  end

  subgraph Connection["Connection boundary"]
    Env["Private environment config<br/>CLUB_VIVO_API_URL + Cognito config"]
    Bearer["Authorization: Bearer token"]
  end

  subgraph SIC["Sports Intelligence Cloud SaaS platform"]
    Cognito["Amazon Cognito<br/>Hosted UI + JWTs"]
    ApiGateway["API Gateway HTTP API<br/>JWT authorizer"]
    Lambda["Lambda route handlers<br/>platform wrapper"]
    Tenant["Tenant context + entitlements<br/>no client-supplied tenant_id"]
    Domains["Domain APIs<br/>/me /teams /session-packs /sessions"]
    Data["Tenant-scoped data<br/>DynamoDB + S3"]
    Ops["CloudWatch + CDK"]
  end

  Coach --> Web
  Web --> Proxy
  Proxy --> Shell
  Shell --> Product
  Product --> ApiHelpers
  ApiHelpers --> Cookies
  ApiHelpers --> Env
  ApiHelpers --> Bearer
  Bearer --> ApiGateway
  Web --> Cognito
  Cognito --> Cookies
  ApiGateway --> Lambda
  Lambda --> Tenant
  Tenant --> Domains
  Domains --> Data
  Lambda --> Ops
```

## Reading the diagram

Club Vivo owns the coach experience: the web app, workspace, product screens, forms, and frontend helpers.

SIC owns the protected SaaS backend behavior: authentication, API entry, Lambda route handling, tenant context, tenant-safe data access, exports, and operations.

The connection happens through Cognito login, HttpOnly cookies, private environment configuration, and bearer-token API calls.