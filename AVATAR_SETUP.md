# Avatar / Profile Picture Setup — Puls

This guide sets up Supabase Storage so users can upload profile pictures.

---

## 1. Add the `avatar_url` column (if you already ran the schema)

If you ran `supabase/schema.sql` before avatar support was added, run this in the **SQL Editor**:

```sql
alter table public.profiles
  add column if not exists avatar_url text;
```

If you're running the schema fresh, the column is already included — skip this step.

---

## 2. Create the storage bucket

1. In your Supabase dashboard, go to **Storage** (left sidebar).
2. Click **New bucket**.
3. Name it exactly: `avatars`
4. Toggle **Public bucket** ON — this gives images a stable public URL without requiring auth tokens.
5. Click **Save**.

---

## 3. Set storage RLS policies

Supabase Storage uses Row Level Security too. Run the following in the **SQL Editor**:

```sql
-- Allow anyone to read avatars (bucket is public, but policy is still needed)
create policy "avatars: public read"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload/replace their own avatar
-- Path must start with their user ID: {user_id}/avatar.{ext}
create policy "avatars: own upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update (overwrite) their own avatar
create policy "avatars: own update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own avatar
create policy "avatars: own delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 4. How it works in the app

- The avatar appears in the **sidebar** (bottom-left) and next to each activity host in the **activity feed**.
- **To upload:** hover over your avatar in the sidebar (or the settings page header) and click the upload icon that appears.
- Accepted formats: PNG, JPEG, WebP.
- Files are stored at `avatars/{user_id}/avatar.{ext}` and are publicly readable.
- After upload, the URL is saved to `profiles.avatar_url` and synced to `auth.user_metadata` so it survives page refreshes.

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Upload fails silently | Bucket doesn't exist | Create the `avatars` bucket (step 2) |
| Upload fails with 403 | Storage RLS policies missing | Run the policy SQL in step 3 |
| Image shows broken after upload | `next.config.ts` missing `remotePatterns` | Already configured — restart the dev server |
| Avatar doesn't update after upload | Browser cached old image | The URL includes `?t={timestamp}` to bust the cache — hard-refresh if needed |
| Avatar missing on another device / after logout | `avatar_url` not in user metadata | The upload action calls `supabase.auth.updateUser` to sync — check server logs |
