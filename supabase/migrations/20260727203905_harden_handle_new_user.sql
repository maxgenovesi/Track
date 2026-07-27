-- handle_new_user() is a SECURITY DEFINER trigger function. It only ever runs
-- from the on_auth_user_created trigger on auth.users, never as a client call.
-- Postgres grants EXECUTE to PUBLIC by default, which exposes it as an RPC
-- endpoint (/rest/v1/rpc/handle_new_user) callable by anon/authenticated.
-- Revoke that. Triggers do not check EXECUTE, so the signup flow is unaffected.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
