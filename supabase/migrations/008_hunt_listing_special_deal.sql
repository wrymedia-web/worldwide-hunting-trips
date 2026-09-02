-- Optional "Deals & Specials" tag on a listing so it can surface in the
-- homepage Deals section. Null = normal listing.

alter table hunt_listings add column if not exists special_deal text
  check (special_deal in ('last_minute', 'cancellation', 'show_special'));

-- Optional discounted price shown alongside the strikethrough regular price.
alter table hunt_listings add column if not exists original_price int;

create index if not exists hunt_listings_special_deal_active_idx
  on hunt_listings (special_deal)
  where is_active = true and special_deal is not null;
