-- Outfitter reply + read tracking on inquiries.
-- Reply is a single message (v1). If we later need a full thread, we'd move
-- to a separate inquiry_messages table.

alter table inquiries add column if not exists reply_message text;
alter table inquiries add column if not exists replied_at timestamptz;
alter table inquiries add column if not exists read_at timestamptz;

-- Outfitters must be able to read + update their own inquiries.
-- Existing policies (from 003_enable_missing_rls.sql) should already grant
-- SELECT; this policy grants UPDATE for status / read_at / reply.

drop policy if exists "Own inquiries update" on inquiries;
create policy "Own inquiries update" on inquiries for update using (
  outfitter_id in (
    select id from outfitters where profile_id = auth.uid()
  )
);
