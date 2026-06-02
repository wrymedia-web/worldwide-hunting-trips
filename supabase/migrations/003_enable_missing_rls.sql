-- Enable RLS on tables that were left unprotected.
-- Supabase flagged these on 2026-05-31: with RLS off, anyone with the
-- anon key could read/write/delete via the public PostgREST endpoint.
--
-- All four are read-only from the app's anon-key code paths:
--   - species, countries, regions: seeded by migrations, read by the listing
--     form and public pages.
--   - hunt_images: read via FK join on hunt_listings; no anon writes anywhere.
--
-- Writes happen through the service_role admin client (which bypasses RLS)
-- or in migrations, so only public-read policies are needed.

alter table species     enable row level security;
alter table hunt_images enable row level security;
alter table countries   enable row level security;
alter table regions     enable row level security;

create policy "Public read species"     on species     for select using (true);
create policy "Public read hunt_images" on hunt_images for select using (true);
create policy "Public read countries"   on countries   for select using (true);
create policy "Public read regions"     on regions     for select using (true);
