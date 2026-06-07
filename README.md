# Club Vivo

Club Vivo is a coach-facing soccer session builder.

It helps coaches create practical sessions from team context, time, space, equipment, and objective.

The frontend is built with Next.js. Auth and API access are provided by the existing AWS backend through environment variables.

This repo currently contains the web app only.

## Environment

Copy `.env.example` to `.env.local` for local development and provide values for the existing AWS backend.

## Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```