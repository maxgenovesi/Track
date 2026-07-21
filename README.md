# Track

A full-stack task & project manager. Productivity tool to help you get things done.

Built as a real API layer over a backend-as-a-service (rather than talking to
Supabase entirely from the browser) to demonstrate end-to-end TypeScript, auth,
row-level-secured data, and a clean CRUD API.

## Stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, plain CSS (per-component files) |
| Design   | Lackluster Mint palette, JetBrains Mono (self-hosted)      |
| Backend  | Node, Express 5, TypeScript                                 |
| Data     | Supabase (Postgres + Auth), Row Level Security              |

## Architecture

```
client/   React app. Talks to Supabase directly for AUTH only.
          Talks to the Express API for all task/project CRUD.
server/   Express API. Verifies the Supabase JWT on each request,
          applies business logic, reads/writes Postgres via the
          Supabase service client.
supabase/ schema.sql — profiles, projects, tasks + RLS policies.
```

Auth tokens are minted by Supabase in the browser; the API trusts nothing but a
verified JWT. The service-role key lives only on the server.

## Setup

**1. Database** — create a project at [supabase.com](https://supabase.com), then
run `supabase/schema.sql` in the SQL editor.

**2. Server**

```bash
cd server
npm install
cp .env.example .env   # fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm run dev            # http://localhost:4000
```

**3. Client**

```bash
cd client
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev            # http://localhost:5173
```

## Design system

Color and type tokens live in `client/src/theme.css` as CSS custom properties
(the single source of truth). Colors are the **Lackluster Mint** palette (slate
`#708090` accent, mint `#789978`, on a `#191919` background); the typeface is
**JetBrains Mono**, self-hosted via `@fontsource` (no external CDN). Components
reference the semantic tokens (`--color-primary`, `--color-text`, `--font-mono`,
…) rather than raw hex.

## Running

After installing (above), from the **project root**:

```bash
npm run dev:client     # Vite dev server  -> http://localhost:5173
npm run dev:server     # Express API      -> http://localhost:4000
```

Other root scripts: `build:client`, `build:server`, and `install:all`
(installs both `client` and `server` dependencies).

## Status

Scaffolding in place: project structure, Supabase clients, JWT auth middleware,
and the database schema. Auth UI and project/task CRUD are next.
