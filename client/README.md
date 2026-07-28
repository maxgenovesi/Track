# Track — Client

React 19 + Vite single-page app. It uses Supabase **only for auth**; all
task/project data goes through the Express API in `../server`.

## Layout

```
src/
  main.tsx            Entry point. Mounts React, wraps the tree in <AuthProvider>,
                      imports the JetBrains Mono weights and globals.css.
  App.tsx / App.css   Root component. Currently renders the home masthead.
  globals.css         The one global stylesheet: design tokens (color, type,
                      spacing, radius, motion) as CSS custom properties, plus the
                      reset/base. Single source of truth — components use tokens,
                      never raw hex.

  lib/
    supabase.ts       Browser Supabase client (anon key). Used for AUTH ONLY —
                      sign in/up/out and session. Never queries data tables.
    auth.tsx          <AuthProvider> + useAuth(). Holds the current session,
                      restores it from localStorage on load, and subscribes to
                      onAuthStateChange so the UI reacts to login/logout.

  components/
    Header.tsx/.css   Home masthead: wordmark, search, links, and the
                      Log in / Log out button. Opens the AuthModal.
    AuthModal.tsx/.css Email + password sign-in / sign-up form. Calls
                      supabase.auth.* directly; on success the AuthProvider's
                      listener captures the session and the modal closes.

  assets/fonts/       Self-hosted "In A Rush" display face (the wordmark only).
                      Body/UI type is JetBrains Mono via @fontsource.
  vite-env.d.ts       Vite / import.meta.env types.
```

## How it interacts

- **Auth → Supabase directly.** `supabase.auth.signInWithPassword` / `signUp` /
  `signOut` hit Supabase's hosted auth service, not the Express API. The session
  (with its `access_token`) lives in the `AuthProvider` context.
- **Data → Express API.** CRUD calls go to `VITE_API_URL`, sending the session's
  `access_token` as an `Authorization: Bearer` header. The API verifies that JWT
  and scopes every query to the user. *(The client-side data layer isn't built
  yet — auth is the piece that's wired.)*

## Conventions

- **Styling:** plain, co-located `*.css` per component. Class names are BEM-ish (`.masthead`, `.masthead__login`). All values
  come from `globals.css` tokens.
- **Imports:** relative (no `@/` alias configured).

## Environment (`.env`)

```
VITE_SUPABASE_URL=       # project URL
VITE_SUPABASE_ANON_KEY=  # anon (publishable) key — safe in the browser
VITE_API_URL=            # Express API base, e.g. http://localhost:4000
```

## Commands

```bash
npm run dev        # Vite dev server -> http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```
