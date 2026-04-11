-- ============================================================
-- Puls / Aktivitetsstrøm  –  Supabase schema
-- Run this once via the Supabase SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- 1. profiles (one row per auth.users row)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  display_name text        not null,
  initials     text        not null,
  avatar_color text        not null default '#5FA8D3',
  avatar_url   text,
  bio          text        check (bio is null or char_length(bio) <= 280),
  banner_theme text,
  favorite_categories text[] not null default '{}' check (coalesce(array_length(favorite_categories, 1), 0) <= 3),
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone authenticated can read all profiles (needed for host name on cards)
create policy "profiles: authenticated read"
  on public.profiles for select
  to authenticated
  using (true);

-- A user may only insert their own profile row
create policy "profiles: own insert"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

-- A user may only update their own profile
create policy "profiles: own update"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()));

-- ------------------------------------------------------------
-- 2. activities
-- ------------------------------------------------------------
create table if not exists public.activities (
  id               uuid        primary key default gen_random_uuid(),
  title            text        not null,
  host_user_id     uuid        not null references public.profiles(id) on delete cascade,
  location         text        not null,
  starts_at        timestamptz not null,
  description      text        not null,
  participants_max int         not null check (participants_max > 0),
  category         text        not null check (category in ('Sport & Trening','Sosialt & Underholdning','Annet')),
  latitude         double precision not null check (latitude between -90 and 90),
  longitude        double precision not null check (longitude between -180 and 180),
  created_at       timestamptz not null default now()
);

alter table public.activities enable row level security;

-- Anyone (including anonymous/unauthenticated) can read activities so the feed
-- works without login
create policy "activities: public read"
  on public.activities for select
  using (true);

-- Only authenticated users can create activities, and only for themselves
create policy "activities: authenticated insert"
  on public.activities for insert
  to authenticated
  with check (host_user_id = (select auth.uid()));

-- Host can update their own activity
create policy "activities: host update"
  on public.activities for update
  to authenticated
  using (host_user_id = (select auth.uid()));

-- Host can delete their own activity
create policy "activities: host delete"
  on public.activities for delete
  to authenticated
  using (host_user_id = (select auth.uid()));

-- ------------------------------------------------------------
-- 3. activity_participants (RSVP join table)
-- ------------------------------------------------------------
create table if not exists public.activity_participants (
  activity_id uuid        not null references public.activities(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (activity_id, user_id)
);

alter table public.activity_participants enable row level security;

-- Authenticated users can see all participants (needed to derive counts + isJoined)
create policy "participants: authenticated read"
  on public.activity_participants for select
  to authenticated
  using (true);

-- A user may only insert their own RSVP
create policy "participants: own insert"
  on public.activity_participants for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- A user may only remove their own RSVP
create policy "participants: own delete"
  on public.activity_participants for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- ------------------------------------------------------------
-- 4. activity_chat_messages
-- ------------------------------------------------------------
create table if not exists public.activity_chat_messages (
  id             uuid        primary key default gen_random_uuid(),
  activity_id    uuid        not null references public.activities(id) on delete cascade,
  sender_user_id uuid        not null default auth.uid() references public.profiles(id) on delete cascade,
  body           text        not null check (char_length(btrim(body)) between 1 and 2000),
  created_at     timestamptz not null default now()
);

create index if not exists activity_chat_messages_activity_created_idx
  on public.activity_chat_messages (activity_id, created_at);

create index if not exists activity_chat_messages_sender_idx
  on public.activity_chat_messages (sender_user_id);

create index if not exists activities_host_user_id_idx
  on public.activities (host_user_id);

create index if not exists activity_participants_user_id_idx
  on public.activity_participants (user_id);

alter table public.activity_chat_messages enable row level security;

create policy "activity_chat_messages: host or participant read"
  on public.activity_chat_messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.activities a
      where a.id = activity_chat_messages.activity_id
        and timezone('Europe/Oslo', a.starts_at)::date >= timezone('Europe/Oslo', now())::date
        and (
          a.host_user_id = (select auth.uid())
          or exists (
            select 1
            from public.activity_participants ap
            where ap.activity_id = activity_chat_messages.activity_id
              and ap.user_id = (select auth.uid())
          )
        )
    )
  );

create policy "activity_chat_messages: host or participant insert"
  on public.activity_chat_messages for insert
  to authenticated
  with check (
    sender_user_id = (select auth.uid())
    and exists (
      select 1
      from public.activities a
      where a.id = activity_chat_messages.activity_id
        and timezone('Europe/Oslo', a.starts_at)::date >= timezone('Europe/Oslo', now())::date
        and (
          a.host_user_id = (select auth.uid())
          or exists (
            select 1
            from public.activity_participants ap
            where ap.activity_id = activity_chat_messages.activity_id
              and ap.user_id = (select auth.uid())
          )
        )
    )
  );

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'activity_chat_messages'
  ) then
    alter publication supabase_realtime add table public.activity_chat_messages;
  end if;
end;
$$;

-- ------------------------------------------------------------
-- 5. Scheduled cleanup for expired chats
-- ------------------------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;

create or replace function public.delete_expired_activity_chat_messages()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer := 0;
begin
  delete from public.activity_chat_messages m
  using public.activities a
  where a.id = m.activity_id
    and timezone('Europe/Oslo', a.starts_at)::date < timezone('Europe/Oslo', now())::date;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

do $$
declare
  existing_job_id bigint;
begin
  select jobid
  into existing_job_id
  from cron.job
  where jobname = 'delete-expired-activity-chat-messages';

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'delete-expired-activity-chat-messages',
    '0 * * * *',
    $job$select public.delete_expired_activity_chat_messages();$job$
  );
end;
$$;

-- ------------------------------------------------------------
-- 6. Trigger: auto-create profile on sign-up
-- ------------------------------------------------------------
-- When a new user is created in auth.users, this function inserts a matching
-- row into public.profiles using the user's metadata (set during signUp).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, initials, avatar_color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'initials', upper(left(split_part(new.email, '@', 1), 2))),
    coalesce(new.raw_user_meta_data->>'avatar_color', '#5FA8D3')
  );
  return new;
end;
$$;

-- Drop trigger first in case we're re-running this script
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 7. Seed data
-- ============================================================
-- IMPORTANT: The seed activities require a real host_user_id.
-- Auto-picks the first user in profiles as the demo host.
-- Run this AFTER signing up in the app at least once.

do $$
declare
  demo_host uuid;
begin
  -- Find the first registered user
  select id into demo_host from public.profiles order by created_at limit 1;

  if demo_host is null then
    raise notice 'No users found in profiles. Sign up in the app first, then re-run this block.';
    return;
  end if;

  -- Only insert seed data if the activities table is empty
  if (select count(*) from public.activities) = 0 then
    insert into public.activities
      (title, host_user_id, location, starts_at, description, participants_max, category, latitude, longitude)
    values
      ('Søndagsfotball på Frogner',    demo_host, 'Frognerparken',      '2026-04-13 14:00:00+02', 'Uformell 7er-fotball for alle nivåer. Ta med studenter og venner! Vi deler oss i lag på stedet.',           14, 'Sport & Trening', 59.9266, 10.6990),
      ('Morgenjoggen langs Akerselva', demo_host, 'Grünerløkka',        '2026-04-12 07:30:00+02', 'Lett joggetur på ca. 5 km langs elva. Passer perfekt for nybegynnere og de som ønsker en rolig start på dagen.', 12, 'Sport & Trening', 59.9233, 10.7594),
      ('Yoga i parken',                demo_host, 'Sofienbergparken',   '2026-04-12 10:00:00+02', 'Utendørs yoga for alle nivåer. Ta med matte og vann. Vi fokuserer på pust, balanse og tilstedeværelse.',      15, 'Sport & Trening', 59.9219, 10.7710),
      ('Klatring på Kolsås',           demo_host, 'Kolsåstoppen',       '2026-04-13 09:00:00+02', 'Klatring i fantastisk natur vest for Oslo. Erfaring kreves. Eget klatreutstyr medbringes.',                    8, 'Sport & Trening', 59.9394, 10.5132),
      ('Padel-turnering Aker Brygge',  demo_host, 'Aker Brygge Padel',  '2026-04-10 18:00:00+02', 'Enkelt padel-turnering med pokalseremoni etterpå. Alle velkomne, blandede nivåer og aldre.',                  16, 'Sport & Trening', 59.9095, 10.7286),
      ('Langsykling Oslofjorden',      demo_host, 'Vippetangen',        '2026-04-13 08:00:00+02', '60 km rundtur rundt Oslofjorden. Treningstur for erfarne syklister. Tempoet tilpasses gruppen.',              10, 'Sport & Trening', 59.9035, 10.7461);

    raise notice 'Seeded 6 activities with host user %', demo_host;
  else
    raise notice 'Activities table already has data — skipping seed.';
  end if;
end;
$$;

-- ============================================================
-- 8. Notes
-- ============================================================
-- The base schema above already includes avatar, bio, banner theme,
-- and favorite interest support on public.profiles.
