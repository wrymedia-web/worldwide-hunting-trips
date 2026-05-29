-- Worldwide Destination Expansion — Phase 1 (data + taxonomy)
-- Additive only: new lookup tables, nullable columns on hunt_listings, expanded species.
-- Existing US listings keep country_id NULL (treated as United States by the app).

-- ─── Countries ────────────────────────────────────────────────────────────────
create table if not exists countries (
  id serial primary key,
  name text unique not null,
  slug text unique not null,
  continent text,            -- north_america, africa, europe, oceania, south_america, asia
  emoji text,
  description text,
  sort_order int default 100,
  created_at timestamptz default now()
);

-- ─── Regions (province / area within a country; optional per listing) ───────────
create table if not exists regions (
  id serial primary key,
  country_id int references countries(id),
  name text not null,
  slug text not null,
  created_at timestamptz default now(),
  unique(country_id, slug)
);

-- ─── Listing location columns (nullable; NULL country = United States) ──────────
alter table hunt_listings add column if not exists country_id int references countries(id);
alter table hunt_listings add column if not exists region_id  int references regions(id);

-- ─── Seed countries: United States + top-5 international (Wes priority) ──────────
insert into countries (name, slug, continent, emoji, sort_order, description) values
  ('United States', 'united-states', 'north_america', '🇺🇸', 0,
   'The most popular hunting destination for American hunters — whitetail, elk, mule deer, turkey and more across 48 states.'),
  ('Canada', 'canada', 'north_america', '🇨🇦', 1,
   'World-class moose, mountain game, black bear and waterfowl across vast wilderness — from the BC mountains to the Saskatchewan bush.'),
  ('South Africa', 'south-africa', 'africa', '🇿🇦', 2,
   'The classic plains-game safari destination. Affordable, accessible, and home to kudu, gemsbok, impala and the full Big Five.'),
  ('Argentina', 'argentina', 'south_america', '🇦🇷', 3,
   'Red stag in the Andes, world-renowned dove and duck shooting, and free-range water buffalo and blackbuck.'),
  ('New Zealand', 'new-zealand', 'oceania', '🇳🇿', 4,
   'Free-range tahr and chamois in the Southern Alps plus trophy red stag — spectacular mountain hunting in both hemispheres'' seasons.'),
  ('Spain', 'spain', 'europe', '🇪🇸', 5,
   'The home of the Grand Slam of Spanish ibex, plus mouflon, red deer and driven wild boar (monteria) across historic estates.')
on conflict (slug) do nothing;

-- ─── Seed key regions (decision #2: populate where it matters) ──────────────────
insert into regions (country_id, name, slug)
select c.id, r.name, r.slug
from countries c
join (values
  ('canada','British Columbia','british-columbia'),
  ('canada','Alberta','alberta'),
  ('canada','Saskatchewan','saskatchewan'),
  ('canada','Yukon','yukon'),
  ('canada','Newfoundland & Labrador','newfoundland-labrador'),
  ('south-africa','Limpopo','limpopo'),
  ('south-africa','Eastern Cape','eastern-cape'),
  ('south-africa','Kalahari','kalahari'),
  ('south-africa','KwaZulu-Natal','kwazulu-natal'),
  ('argentina','Patagonia','patagonia'),
  ('argentina','La Pampa','la-pampa'),
  ('argentina','Córdoba','cordoba'),
  ('new-zealand','South Island','south-island'),
  ('new-zealand','North Island','north-island'),
  ('spain','Andalusia','andalusia'),
  ('spain','Castile and León','castile-leon'),
  ('spain','Gredos','gredos')
) as r(country_slug, name, slug) on c.slug = r.country_slug
on conflict (country_id, slug) do nothing;

-- ─── Expand species with international + dangerous game ──────────────────────────
-- New 'dangerous_game' category drives the listing-level liability notice (decision #4).
insert into species (name, slug, category) values
  ('Kudu','kudu','big_game'),
  ('Gemsbok','gemsbok','big_game'),
  ('Impala','impala','big_game'),
  ('Blue Wildebeest','blue-wildebeest','big_game'),
  ('Eland','eland','big_game'),
  ('Nyala','nyala','big_game'),
  ('Springbok','springbok','big_game'),
  ('Warthog','warthog','big_game'),
  ('Sable Antelope','sable-antelope','big_game'),
  ('Cape Buffalo','cape-buffalo','dangerous_game'),
  ('Lion','lion','dangerous_game'),
  ('Leopard','leopard','dangerous_game'),
  ('African Elephant','african-elephant','dangerous_game'),
  ('Hippopotamus','hippopotamus','dangerous_game'),
  ('Water Buffalo','water-buffalo','dangerous_game'),
  ('Tahr','tahr','big_game'),
  ('Chamois','chamois','big_game'),
  ('Fallow Deer','fallow-deer','exotic'),
  ('Iberian Ibex','iberian-ibex','big_game'),
  ('Mouflon','mouflon','big_game'),
  ('Roe Deer','roe-deer','big_game'),
  ('Red Deer','red-deer','big_game'),
  ('Puma','puma','predator')
on conflict (slug) do nothing;

-- ─── Let hunters read their own inquiries (dashboard). Outfitter-read policy stays. ─
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'inquiries' and policyname = 'Hunter read own inquiries'
  ) then
    create policy "Hunter read own inquiries" on inquiries
      for select using (hunter_profile_id = auth.uid());
  end if;
end $$;
