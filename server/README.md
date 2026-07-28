# Track — Server

Express 5 + TypeScript API. It verifies the Supabase JWT on every protected
request, owns the business logic, and reads/writes Postgres through the Supabase
service client.

## Layout

```
src/
  index.ts            App entry. Sets up CORS + JSON parsing, mounts routes, and
                      listens on PORT (default 4000). Exposes /health (public) and
                      /api/me (protected sample that echoes the verified user id).

  supabase.ts         The service-role client (`supabaseAdmin`). Uses the
                      SERVICE_ROLE key, so it BYPASSES Row Level Security — every
                      query must be scoped to the user in code. Server-only; this
                      key never reaches the browser.

  middleware/
    auth.ts           requireAuth. Reads the `Authorization: Bearer <token>`
                      header, verifies it via supabaseAdmin.auth.getUser, and
                      attaches the user id to the request as `req.userId`.

  routes/
    projects.ts       Per-resource CRUD routers, each sitting behind requireAuth
    tasks.ts          and scoping every query by `req.userId`.
    profiles.ts       (Currently placeholders — not yet mounted in index.ts.)

  types/
    database.ts       TypeScript types generated from the live DB schema. Regenerate
                      after schema migrations.
```

## How it interacts

1. The client signs in with Supabase and gets an `access_token`.
2. It sends that token to this API as `Authorization: Bearer <token>`.
3. **`requireAuth`** verifies the token and sets `req.userId`.
4. Route handlers query Postgres via **`supabaseAdmin`**, always filtered by
   `req.userId` (e.g. `.eq('owner_id', req.userId)`).

Because `supabaseAdmin` bypasses RLS, **the ownership check in application code is
the real guard**; the RLS policies in `../supabase` are the backstop if a query is
ever left unscoped.

## Security notes

- The service-role key lives only in `server/.env` — never commit it, never send
  it to the client.
- Trust nothing but a verified JWT: no route reads a user id from the request
  body or query. It always comes from `req.userId`.

## Database & migrations (Supabase CLI)

The schema lives in `../supabase/migrations` and is applied to the linked remote
project. **Run these from the repo root** (where `supabase/` lives), not from
`server/`.

| Command | When to run it |
| --- | --- |
| `supabase link --project-ref <ref>` | Once per machine, to connect this repo to the remote project. |
| `supabase migration new <name>` | **Before** changing the schema — creates an empty, timestamped migration file to write your DDL into. Never hand-name migration files. |
| `supabase db push` | **After** writing/editing a migration — applies all pending migrations to the remote DB. |
| `supabase gen types typescript --linked > server/src/types/database.ts` | **After every schema change** — regenerates the TS types the API is built against. |
| `supabase db pull <name>` | If the schema was changed outside the CLI (dashboard/SQL editor) — captures those changes back into a migration so local history stays in sync. |
| `supabase migration list` | Anytime — shows which migrations are applied locally vs. remotely. |
| `supabase db advisors` (or MCP `get_advisors`) | **After any DDL change** — surfaces missing RLS policies and other security/perf issues. Fix what it reports. |

**Typical change flow:** `migration new` → edit the SQL file → `db push` →
`gen types` → `db advisors`. Keep the RLS policies in each migration in sync with
the ownership checks in `routes/` — the API scopes by `req.userId`, and RLS is the
backstop.

> Note: `supabase init` and `supabase start` (local stack) require Docker Desktop.
> Pushing to the remote does not.

## Environment (`.env`)

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   # server-only; bypasses RLS
PORT=                        # optional, defaults to 4000
```

## Commands

```bash
npm run dev        # tsx watch -> http://localhost:4000
npm run build      # tsc
npm run start      # node dist/index.js
npm run typecheck  # tsc --noEmit
```
