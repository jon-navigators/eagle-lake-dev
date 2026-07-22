# Cairn

A calm commitment tracker for **Eagle Lake** staff. Keep your commitments,
ask teammates to take things on (they can decline without ceremony), and see how
the company's initiatives are tracking — all in one quiet place.

Home is _your commitments_. Everything else is one click away.

## What it does

- **Commitments** — your personal to-do list: things you need to do and things
  you told others you'd do. Create, edit, complete.
- **Requests + Inbox** — ask a teammate to take something on. It lands in their
  inbox with Accept / Decline. Accept keeps it with them and tells you; a plain
  decline bounces it back to you. Notifications are in-app only.
- **Org chart** — a drag-and-drop, top-down tree. Drag a box onto another to set
  who reports to whom. Claim your own box with "This is me." The chart is the
  single source of truth for **teams**.
- **Team view** — everyone below you on the chart, their open work, and a rollup.
- **Initiatives + Company view** — company-level quarterly/annual goals whose
  progress is computed automatically from the commitments linked to them.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript — Server Components and
  server actions.
- [Prisma](https://www.prisma.io) + PostgreSQL.
- [Auth.js](https://authjs.dev) email magic-link sign-in, gated to the
  `@navigators.org` domain (swap-ready for Microsoft Entra SSO — see below).
- [Tailwind CSS v4](https://tailwindcss.com) with the rustic Eagle Lake palette.
- [React Flow](https://reactflow.dev) + [dagre](https://github.com/dagrejs/dagre)
  for the org chart.

## Getting started

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
#   - set DATABASE_URL to your Postgres (local or Neon)
#   - set AUTH_SECRET:  npx auth secret

# 3. Create the schema
npm run db:migrate      # or: npm run db:push
npm run db:seed         # optional demo data

# 4. Run
npm run dev             # http://localhost:3000
```

### Signing in during development

Leave `EMAIL_SERVER` unset and the magic-link **prints to the server console** —
no SMTP needed. Enter a `@navigators.org` address on `/signin`, copy the link
from the terminal, and open it. Other domains are rejected. Set `EMAIL_SERVER`
to an SMTP URL to send real emails in production.

### Switching to Microsoft Entra SSO later

Auth lives behind `lib/auth.ts`. To move from magic-link to Navigators SSO,
register an app in the Entra tenant, add the Entra provider (restricted to the
tenant id), and the rest of the app is unchanged.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run test` | Run unit tests (org tree + initiative rollup) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:seed` | Load demo data |

## Deploying (Vercel + Neon)

1. **Neon** — create a project; copy the **direct** (non-pooled) connection
   string. That becomes `DATABASE_URL`.
2. **Vercel** — import this GitHub repo. Vercel auto-detects Next.js; `vercel.json`
   sets the build to `prisma generate && prisma migrate deploy && next build`, so
   migrations apply to Neon on every deploy.
3. **Environment variables** (Vercel → Project → Settings → Environment Variables):
   - `DATABASE_URL` — the Neon direct string
   - `AUTH_SECRET` — `npx auth secret` (or `openssl rand -base64 32`)
   - `ALLOWED_EMAIL_DOMAIN` — `navigators.org`
   - `EMAIL_SERVER` — an SMTP URL so sign-in links actually send
     (e.g. Resend, SendGrid, or Microsoft 365 SMTP). Without it, links only print
     to the server logs.
   - `EMAIL_FROM` — e.g. `Cairn <no-reply@yourdomain>`
4. **Deploy.** First build runs the `init` migration and creates the schema.
   Open the URL, sign in with a `@navigators.org` address, and you're in.

`AUTH_URL` is auto-detected on Vercel; no need to set it.

## Design

Rustic Eagle Lake: earthy greens (pine, moss), warm browns (bark), a single
terracotta accent (clay) for actions, on warm cream (sand). Friendly serif
headlines (Fraunces), humanist sans body (Source Sans 3). The UX follows Jason
Fried / 37signals principles — build less, opinionated defaults, easy to say no,
and no fake urgency (due dates are neutral, overdue is a quiet label — never a
red alarm).
