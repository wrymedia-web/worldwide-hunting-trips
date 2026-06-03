-- Write policies on hunt_images. Public read already exists (migration 003).
-- Outfitters can insert/update/delete image rows that point at their own
-- hunts. The app's server actions use the admin client, but these policies
-- keep direct anon-key calls from spamming or vandalising image rows.

create policy "Outfitters insert own hunt_images"
  on hunt_images for insert
  with check (
    hunt_id in (
      select hl.id
      from hunt_listings hl
      join outfitters o on o.id = hl.outfitter_id
      where o.profile_id = auth.uid()
    )
  );

create policy "Outfitters update own hunt_images"
  on hunt_images for update
  using (
    hunt_id in (
      select hl.id
      from hunt_listings hl
      join outfitters o on o.id = hl.outfitter_id
      where o.profile_id = auth.uid()
    )
  );

create policy "Outfitters delete own hunt_images"
  on hunt_images for delete
  using (
    hunt_id in (
      select hl.id
      from hunt_listings hl
      join outfitters o on o.id = hl.outfitter_id
      where o.profile_id = auth.uid()
    )
  );
