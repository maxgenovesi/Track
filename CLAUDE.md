# CLAUDE.md — Track Rules

Track is a full-stack task & project manager, built as a portfolio piece. Three parts:

```
client/    # React 19 + Vite + TypeScript — the web app
server/    # Node + Express 5 + TypeScript — the API (verifies Supabase JWTs)
supabase/  # schema.sql — profiles, projects, tasks + Row Level Security
```

**The architectural point of the split:** the browser uses Supabase for **auth
only**; all task/project CRUD goes through the Express API. Keep that boundary —
don't reach into Postgres directly from the client.

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code.
- **Invoke the `supabase` skill** for anything touching auth, sessions, Supabase
  clients, schema, or RLS.

## Frontend Stack (the reality — match it, don't reinvent)
- **React 19 + Vite + TypeScript.** Components live under `client/src/`. Plain
  function components — no framework meta-layer (this is Vite, **not** Next.js:
  no App Router, no Server Components, no `"use client"`).
- **Styling is plain, co-located CSS — NOT Tailwind, NOT CSS Modules.** Each
  component has a sibling `*.css` it imports directly (`App.tsx` + `App.css`, via
  `import './App.css'`). Class names use a BEM-ish convention (`.app`,
  `.app__title`) for scope-by-convention. No utility classes, no CDN `<script>`.
- **Design tokens are the source of truth:** `client/src/globals.css` is the one
  global stylesheet — it defines the color and type tokens as CSS custom
  properties (`--color-*`, `--font-mono`) and holds the reset/base styles. **Use
  the tokens; do not hardcode a hex a token already covers, and do not invent
  brand colors.**
  - Only **color and typography** tokens exist today. When you need spacing,
    radius, shadow, or motion values, **add tokens to `globals.css`**
    (`--space-*`, `--radius-*`, `--dur-*`, `--ease-*`) rather than scattering
    arbitrary px — don't just hardcode.
- **Font:** JetBrains Mono, self-hosted via `@fontsource`, imported in
  `client/src/main.tsx` (weights 400/500/700). The whole UI is monospace by
  design; `--font-mono` is the token.
- **Imports are relative** (`import './App.css'`, `import { supabase } from
  '../lib/supabase'`). No `@/` path alias is configured — add one to
  `vite.config.ts` + `tsconfig.json` if you want it; don't assume it exists.
- **Images:** standard `<img>` (no `next/image`). No brand logo asset exists yet
  — use a placeholder (`https://placehold.co/`) until one is added.
- **Auth in the browser** uses the Supabase client at `client/src/lib/supabase.ts`
  (anon key). CRUD calls go to the Express API (`VITE_API_URL`), sending the
  Supabase access token as an `Authorization: Bearer` header.

## Palette (Lackluster Mint)
Defined in `globals.css`, pulled from the "Lackluster Mint" VS Code theme.
Dark-first: slate `#708090` primary accent (black text on it), mint `#789978`
secondary/success, on a `#191919` canvas with `#cccccc` text. Use the semantic
tokens (`--color-primary`, `--color-accent`, `--color-text`, …), not raw hex.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color
  exactly. Swap in placeholder content (images via `https://placehold.co/`,
  generic copy). Do not improve or add to the design.
- If none: design from scratch with high craft, deriving all values from the
  tokens in `globals.css`.

## Backend / API Rules
- Server is Express 5 + TS under `server/src/`. Protected routes verify the
  Supabase JWT via `requireAuth` (`server/src/middleware/auth.ts`), which sets
  `req.userId`.
- **The service-role key is server-only** (`server/.env`). Never put it in the
  client, never commit it. The client only ever gets the anon key.
- Postgres access from the server goes through the service client
  (`server/src/supabase.ts`), which **bypasses RLS** — so ownership checks must
  be enforced in application code (scope every query by `req.userId`).
- RLS in `supabase/schema.sql` is the backstop: every table is owner-scoped. Keep
  the policies and the API's ownership checks in sync when adding tables/columns.

## Running & Verifying Locally
- From the repo root: `npm run dev:client` (Vite → `http://localhost:5173`) and
  `npm run dev:server` (Express → `http://localhost:4000`). If one is already
  running, don't start a second instance.
- **Typecheck after edits (must be clean):** `npm run typecheck` inside `client/`
  or `server/` (both expose it).
- **Verification is manual:** there is **no automated screenshot tooling** in this
  repo. To verify a visual change, run the dev server and open
  `http://localhost:5173` yourself, or ask the user. Do not claim a visual pass
  you didn't actually perform. (Screenshot/MCP tooling may be added later.)
- **No ESLint / Prettier / test runner is configured yet** — do not reference
  lint/format/test commands as if they exist.

## Anti-Generic Guardrails
- **Colors:** use the `globals.css` tokens. Never hardcode a color a token
  defines, and never introduce a color outside the slate/mint/neutral Lackluster
  system.
- **Typography:** JetBrains Mono throughout — mono is the identity. Mono,
  uppercase, letter-spaced captions/eyebrows read as intentional house style.
  Tight tracking on large headings, generous line-height on body.
- **Depth:** respect surface layering (`--color-bg` → `--color-surface`);
  surfaces should not all sit on one z-plane. If you add shadows, make them
  subtle and layered — add a shadow token rather than a flat one-off.
- **Animations:** only animate `transform` and `opacity`, via motion tokens (add
  `--dur-*` / `--ease-*` to `globals.css` when you introduce motion). Never
  `transition-all`. Honor `prefers-reduced-motion` (not globally set up yet — add
  the media query when you add motion).
- **Interactive states:** every clickable element needs hover, `:focus-visible`,
  and active states. `globals.css` already sets a global `:focus-visible` slate
  outline; add hover/active per component.
- **Spacing:** keep a consistent scale; prefer `--space-*` tokens (add them to
  `globals.css`) over arbitrary px.

## Hard Rules
- Do not add Tailwind or any utility-CSS framework.
- Do not use CSS Modules — plain co-located `.css` files only.
- Do not hardcode colors/spacing that a `globals.css` token defines (or should
  define — add the token instead).
- Do not put the Supabase service-role key anywhere client-side, and do not
  commit `.env` files.
- Do not add sections, features, or content not asked for; do not "improve" a
  provided reference — match it.
- Do not use `transition-all`.
- Do not claim a visual/screenshot pass you didn't actually perform (there's no
  tooling for it — say so).
