-- Hunt listing fields per Individual Hunt Listing spec
-- Additive: existing rows continue to work; new fields are nullable / default null.

-- Need-to-Know
alter table hunt_listings add column if not exists fenced boolean;
alter table hunt_listings add column if not exists hunting_styles text[];
-- spot_and_stalk, blind, tree_stand, driven, hounds

alter table hunt_listings add column if not exists baited boolean;
alter table hunt_listings add column if not exists difficulty text
  check (difficulty in ('easy', 'medium', 'hard'));
alter table hunt_listings add column if not exists property_size_acres int;
alter table hunt_listings add column if not exists season_dates_text text;

-- Price Includes / Excludes (24 selectable options per spec, stored as text keys)
alter table hunt_listings add column if not exists price_includes text[];
alter table hunt_listings add column if not exists price_excludes text[];

-- Payment & Cancellation
alter table hunt_listings add column if not exists deposit_terms text;
alter table hunt_listings add column if not exists final_payment_terms text;
alter table hunt_listings add column if not exists cancellation_terms text;
alter table hunt_listings add column if not exists payment_methods text[];
-- cash, check, credit_card, ach, wire, venmo, paypal, zelle, crypto

-- Q&A: pre-defined questions outfitter opts into + custom answer; supports
-- a final "other" free-text entry per spec.
create table if not exists listing_qa (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid not null references hunt_listings(id) on delete cascade,
  question_key text,
  custom_question text,
  answer text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists listing_qa_hunt_id_idx on listing_qa(hunt_id);

alter table listing_qa enable row level security;

create policy "Public read listing_qa" on listing_qa for select using (
  hunt_id in (select id from hunt_listings where is_active = true)
);

create policy "Own listing_qa" on listing_qa for all using (
  hunt_id in (
    select hl.id from hunt_listings hl
    join outfitters o on o.id = hl.outfitter_id
    where o.profile_id = auth.uid()
  )
);
