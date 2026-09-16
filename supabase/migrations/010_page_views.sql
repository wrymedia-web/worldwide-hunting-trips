-- View tracking for outfitter analytics.
-- Rows are written and read exclusively through the service-role client
-- (server-side), so RLS is enabled with no anon/user policies.

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  outfitter_id uuid not null references outfitters(id) on delete cascade,
  hunt_id uuid references hunt_listings(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index if not exists page_views_outfitter_viewed_idx
  on page_views (outfitter_id, viewed_at desc);

alter table page_views enable row level security;
