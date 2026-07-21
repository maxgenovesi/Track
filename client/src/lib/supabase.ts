import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (see client/.env.example)',
  )
}

// Browser client used for auth (sign up / sign in / session). CRUD goes through
// the Express API, not this client, so the API can enforce business logic.
export const supabase = createClient(url, anonKey)
