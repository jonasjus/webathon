# Supabase Setup Guide — Puls / Aktivitetsstrøm

This guide walks you through creating and configuring the Supabase project that backs this app.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New project**.
3. Choose your organisation, give the project a name (e.g. `puls`), pick a region (recommend **Europe (Frankfurt)** or **Europe (Stockholm)** for Norwegian users), and set a strong database password. Save the password somewhere — you will need it if you connect via `psql` directly.
4. Wait ~1 minute for provisioning to complete.

---

## 2. Get the API keys

1. In your project dashboard, go to **Project Settings → API**.
2. Copy the following values:
   - **Project URL** — looks like `https://abcdefghij.supabase.co`
   - **anon public** key — safe to use in client-side code
   - **service_role** key — server-only; never expose this to the browser

---

## 3. Configure `.env.local`

Open `.env.local` at the project root and fill in the values you just copied:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Important:** `.env.local` is already in `.gitignore` (the `.env*` rule).
> Run `git status` after editing to confirm it shows as _untracked_ and is NOT staged.

---

## 4. Run the schema

1. In your Supabase dashboard, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `supabase/schema.sql` from this repo, copy its entire contents, paste into the editor, and click **Run**.
4. You should see `Success. No rows returned.`
5. Go to **Table Editor** and confirm three tables are present: `profiles`, `activities`, `activity_participants`.

The schema also installs a Postgres trigger that automatically creates a `profiles` row whenever a new user signs up — you don't need to insert it manually.

---

## 5. Enable email authentication

1. Go to **Authentication → Providers → Email**.
2. Ensure **Enable Email provider** is toggled on.
3. For local development, turn **OFF** "Confirm email" so that sign-up works immediately without a confirmation email. ⚠️ Re-enable this for production.

---

## 6. (Optional) Verify row-level security

The schema enables RLS on all three tables and adds policies. You can verify they are active:

```sql
-- Should return 3 rows, all with rowsecurity = true
select tablename, rowsecurity
from pg_tables
where schemaname = 'public';
```

Run this in the SQL Editor. If any table shows `rowsecurity = false`, run:

```sql
alter table public.<table_name> enable row level security;
```

---

## 7. Seed the activity data

The `schema.sql` file includes a seed block for the 6 original Oslo activities. However, each activity needs a real `host_user_id` pointing to a `profiles` row.

**Steps:**

1. Start the app: `npm run dev`
2. Open [http://localhost:3000/login?mode=signup](http://localhost:3000/login?mode=signup).
3. Sign up with your name, email, and a password (minimum 6 characters). You will be redirected to `/` — the feed will be empty for now.
4. In the Supabase dashboard, go to **Table Editor → profiles**.
5. Copy the `id` (UUID) of the user you just created.
6. Open `supabase/schema.sql` and find this line near the bottom:
   ```sql
   demo_host uuid := '00000000-0000-0000-0000-000000000001'; -- REPLACE THIS
   ```
7. Replace `'00000000-0000-0000-0000-000000000001'` with your actual UUID (keep the single quotes).
8. Copy just the `do $$ ... end; $$;` block from `schema.sql` and run it in the SQL Editor.
9. Reload [http://localhost:3000](http://localhost:3000) — you should see the 6 activities.

---

## 8. Run the app

```bash
npm install       # first time only
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**What you can do:**
- Browse activities without logging in.
- Log in or create an account at `/login`.
- Click **Bli med** to RSVP — the count updates in real time.
- Click **Bli med** again to leave.
- Click **Opprett aktivitet** to create your own activity.
- Log out via the "Logg ut" button in the header.

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` is undefined | `.env.local` not filled in or not at project root | Double-check the file exists at the repo root and has the correct values |
| Sign-up returns "Email not confirmed" | "Confirm email" is enabled | Go to Authentication → Providers → Email → disable "Confirm email" for dev |
| Activity feed shows an error / empty after seeding | `host_user_id` UUID in the seed block is still the placeholder | Follow step 7 above to replace it with your real UUID |
| "Bli med" says "Ikke innlogget" | User is not authenticated | Log in first |
| RLS blocking inserts | Policy missing or wrong `auth.uid()` check | Re-run the full schema SQL; check the policies tab in Supabase |
| Session not refreshing / logged out on refresh | `proxy.ts` is missing or named `middleware.ts` | **This app uses Next.js 16** where the middleware file must be named `proxy.ts` (not `middleware.ts`). Do not rename it. |
| TypeScript errors after pulling changes | Dependency mismatch | `npm install` |

---

## Environment variable reference

| Variable | Where it goes | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` | Supabase project URL — safe to expose to the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` | Supabase anon/public key — safe to expose to the browser; RLS protects data |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` | Server-only admin key — **never** use `NEXT_PUBLIC_` prefix; **never** commit |
