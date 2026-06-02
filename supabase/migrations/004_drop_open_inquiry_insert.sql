-- Drop the wide-open INSERT policy on inquiries.
-- Supabase flagged it on 2026-06-02: WITH CHECK (true) lets anyone with the
-- anon key insert arbitrary rows directly via PostgREST (spam, abuse).
--
-- The app already submits inquiries through a server action that uses the
-- service_role admin client (app/actions/inquiry.ts), which bypasses RLS —
-- so removing this policy doesn't break the public inquiry form.

drop policy if exists "Hunter create inquiry" on inquiries;
