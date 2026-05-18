-- profiles (linked to auth.users)
create table profiles (
  id uuid references auth.users primary key,
  role text not null check (role in ('hunter', 'outfitter')),
  full_name text,
  email text,
  phone text,
  state text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- outfitters
create table outfitters (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles,
  business_name text not null,
  slug text unique,
  state text,
  description text,
  logo_url text,
  cover_url text,
  phone text,
  email text,
  website text,
  years_in_business int,
  licensed boolean default true,
  bonded boolean default false,
  rating numeric(3,2) default 0,
  review_count int default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

-- species (lookup)
create table species (
  id serial primary key,
  name text unique not null,
  slug text unique not null,
  category text -- big_game, bird, predator, exotic
);

-- hunt_listings
create table hunt_listings (
  id uuid primary key default gen_random_uuid(),
  outfitter_id uuid references outfitters,
  title text not null,
  slug text unique,
  species_id int references species,
  state text not null,
  description text,
  price_per_person numeric(10,2),
  price_type text default 'per_person', -- per_person, per_day, flat
  duration_days int,
  max_hunters int,
  guided_type text check (guided_type in ('fully_guided', 'semi_guided', 'self_guided')),
  weapon_types text[], -- rifle, bow, muzzleloader, shotgun, crossbow
  land_type text check (land_type in ('private', 'public', 'both')),
  lodging_included boolean default false,
  meals_included boolean default false,
  license_required boolean default true,
  success_rate int, -- percentage
  trophy_class text, -- management, mid-grade, trophy, record-book
  season_start date,
  season_end date,
  is_draw boolean default false,
  is_otc boolean default true,
  rating numeric(3,2) default 0,
  review_count int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- hunt_images
create table hunt_images (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunt_listings,
  url text not null,
  is_primary boolean default false,
  sort_order int default 0
);

-- favorites
create table favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles,
  hunt_id uuid references hunt_listings,
  created_at timestamptz default now(),
  unique(profile_id, hunt_id)
);

-- inquiries
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunt_listings,
  outfitter_id uuid references outfitters,
  hunter_profile_id uuid references profiles,
  hunter_name text,
  hunter_email text,
  hunter_phone text,
  message text not null,
  preferred_dates text,
  party_size int default 1,
  status text default 'new' check (status in ('new', 'read', 'replied', 'booked', 'declined')),
  created_at timestamptz default now()
);

-- reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunt_listings,
  outfitter_id uuid references outfitters,
  reviewer_id uuid references profiles,
  rating int check (rating between 1 and 5),
  title text,
  body text,
  hunt_year int,
  species_harvested text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table outfitters enable row level security;
alter table hunt_listings enable row level security;
alter table favorites enable row level security;
alter table inquiries enable row level security;
alter table reviews enable row level security;

create policy "Public read profiles" on profiles for select using (true);
create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Public read outfitters" on outfitters for select using (true);
create policy "Own outfitter" on outfitters for all using (profile_id = auth.uid());
create policy "Public read hunts" on hunt_listings for select using (is_active = true);
create policy "Own hunts" on hunt_listings for all using (
  outfitter_id in (select id from outfitters where profile_id = auth.uid())
);
create policy "Own favorites" on favorites for all using (profile_id = auth.uid());
create policy "Outfitter read inquiries" on inquiries for select using (
  outfitter_id in (select id from outfitters where profile_id = auth.uid())
);
create policy "Hunter create inquiry" on inquiries for insert with check (true);
create policy "Public read reviews" on reviews for select using (true);
create policy "Own review" on reviews for insert with check (reviewer_id = auth.uid());

-- Seed species
insert into species (name, slug, category) values
('Whitetail Deer', 'whitetail-deer', 'big_game'),
('Mule Deer', 'mule-deer', 'big_game'),
('Elk', 'elk', 'big_game'),
('Moose', 'moose', 'big_game'),
('Black Bear', 'black-bear', 'big_game'),
('Brown Bear', 'brown-bear', 'big_game'),
('Grizzly Bear', 'grizzly-bear', 'big_game'),
('Mountain Lion', 'mountain-lion', 'predator'),
('Bison', 'bison', 'big_game'),
('Pronghorn Antelope', 'pronghorn-antelope', 'big_game'),
('Bighorn Sheep', 'bighorn-sheep', 'big_game'),
('Dall Sheep', 'dall-sheep', 'big_game'),
('Rocky Mountain Goat', 'rocky-mountain-goat', 'big_game'),
('Wild Boar', 'wild-boar', 'big_game'),
('Caribou', 'caribou', 'big_game'),
('Coues Deer', 'coues-deer', 'big_game'),
('Axis Deer', 'axis-deer', 'exotic'),
('Sika Deer', 'sika-deer', 'exotic'),
('Nilgai', 'nilgai', 'exotic'),
('Aoudad Sheep', 'aoudad-sheep', 'exotic'),
('Blackbuck Antelope', 'blackbuck-antelope', 'exotic'),
('Red Stag', 'red-stag', 'exotic'),
('Turkey', 'turkey', 'bird'),
('Alligator', 'alligator', 'big_game'),
('Wolf', 'wolf', 'predator'),
('Buffalo', 'buffalo', 'big_game'),
('Exotic Game', 'exotic-game', 'exotic'),
('Predator', 'predator', 'predator');
