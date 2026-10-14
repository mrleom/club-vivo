# Club Vivo on SIC

Club Vivo is one modular Sports and Business Intelligence product. TIE is the first flagship application; SIC is its protected technical foundation.

```mermaid
flowchart TD
  User["Signed-in member"]
  subgraph Product["Club Vivo"]
    Home["Home and organization context"]
    Hub["Applications hub"]
    TIE["TIE coaching workspace"]
    Planned["Sports and business modules: coming soon"]
    Helpers["Existing server-only API helpers"]
  end
  subgraph Foundation["SIC technical foundation"]
    Auth["Cognito and HttpOnly cookies"]
    Me["Verified identity and entitlements"]
    API["JWT-protected domain APIs"]
    Data["Tenant-scoped DynamoDB and S3"]
  end
  User --> Auth
  Auth --> Me
  Me --> Home
  Me --> Hub
  Home --> Hub
  Hub --> TIE
  Hub -.-> Planned
  TIE --> Helpers
  Helpers --> API
  API --> Me
  API --> Data
```

The existing Session Builder, Quick Soccer Game, Teams, Equipment Essentials, Methodology, saved sessions, feedback, and exports remain inside TIE with unchanged URLs and backend contracts. Planned modules have no launch action.

Role-aware presentation uses the existing authenticated `/me` response. SIC remains the authority for tenant scope, action permissions, and storage boundaries. The application catalog does not grant entitlements or add a separate auth path.

Private environment configuration and server-side bearer-token API calls remain the integration boundary. Existing architecture PNGs depict the earlier coaching baseline; this diagram shows Home v1's product framing.
