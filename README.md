# Track

A full-stack task & project manager. This is a productivity tool based off of the tools and methods that I have found to be most effective. No fluff.

Built as a real API layer over a backend-as-a-service (rather than talking to
Supabase entirely from the browser) to demonstrate end-to-end TypeScript, auth,
row-level-secured data, and a clean CRUD API.

## Stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, CSS                             |
| Backend  | Node, Express 5, TypeScript                                 |
| Data     | Supabase (Postgres + Auth), Row Level Security              |

## Architecture

```
client/   React app. Talks to Supabase directly for AUTH only.
          Talks to the Express API for all task/project CRUD.
server/   Express API. Verifies the Supabase JWT on each request,
          applies business logic, reads/writes Postgres via the
          Supabase service client.
supabase/ Postgres schema as tracked migrations — profiles, projects,
          tasks + RLS policies.
```

Auth tokens are minted by Supabase in the browser; the API trusts nothing but a
verified JWT. The service-role key lives only on the server.
