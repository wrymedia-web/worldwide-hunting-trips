-- Public Storage bucket for outfitter hunt photos.
-- Path convention: {outfitter_id}/{hunt_id}/{uuid}.{ext}
-- The first path segment is the outfitter id; Storage RLS uses it to
-- gate writes so an outfitter can only touch files in their own folder.

insert into storage.buckets (id, name, public)
values ('hunt-photos', 'hunt-photos', true)
on conflict (id) do nothing;

-- Public read of every object in the bucket (photos render on public pages).
create policy "Public read hunt-photos"
  on storage.objects for select
  using (bucket_id = 'hunt-photos');

-- Outfitters can write/update/delete only inside their own outfitter_id folder.
create policy "Outfitters insert own hunt-photos"
  on storage.objects for insert
  with check (
    bucket_id = 'hunt-photos'
    and (storage.foldername(name))[1] in (
      select id::text from outfitters where profile_id = auth.uid()
    )
  );

create policy "Outfitters update own hunt-photos"
  on storage.objects for update
  using (
    bucket_id = 'hunt-photos'
    and (storage.foldername(name))[1] in (
      select id::text from outfitters where profile_id = auth.uid()
    )
  );

create policy "Outfitters delete own hunt-photos"
  on storage.objects for delete
  using (
    bucket_id = 'hunt-photos'
    and (storage.foldername(name))[1] in (
      select id::text from outfitters where profile_id = auth.uid()
    )
  );
