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
  with check (id = auth.uid());

-- A user may only update their own profile
create policy "profiles: own update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

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
  category         text        not null check (category in ('fotball','løping','yoga','klatring','padel','sykling')),
  map_pin_x        numeric     not null,
  map_pin_y        numeric     not null,
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
  with check (host_user_id = auth.uid());

-- Host can update their own activity
create policy "activities: host update"
  on public.activities for update
  to authenticated
  using (host_user_id = auth.uid());

-- Host can delete their own activity
create policy "activities: host delete"
  on public.activities for delete
  to authenticated
  using (host_user_id = auth.uid());

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
  with check (user_id = auth.uid());

-- A user may only remove their own RSVP
create policy "participants: own delete"
  on public.activity_participants for delete
  to authenticated
  using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 4. Trigger: auto-create profile on sign-up
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
-- 5. Seed data
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
      (title, host_user_id, location, starts_at, description, participants_max, category, map_pin_x, map_pin_y)
    values
      ('Søndagsfotball på Frogner',    demo_host, 'Frognerparken',      '2026-04-13 14:00:00+02', 'Uformell 7er-fotball for alle nivåer. Ta med studenter og venner! Vi deler oss i lag på stedet.',           14, 'fotball', 36, 42),
      ('Morgenjoggen langs Akerselva', demo_host, 'Grünerløkka',        '2026-04-12 07:30:00+02', 'Lett joggetur på ca. 5 km langs elva. Passer perfekt for nybegynnere og de som ønsker en rolig start på dagen.', 12, 'løping',  61, 34),
      ('Yoga i parken',                demo_host, 'Sofienbergparken',   '2026-04-12 10:00:00+02', 'Utendørs yoga for alle nivåer. Ta med matte og vann. Vi fokuserer på pust, balanse og tilstedeværelse.',      15, 'yoga',    68, 48),
      ('Klatring på Kolsås',           demo_host, 'Kolsåstoppen',       '2026-04-13 09:00:00+02', 'Klatring i fantastisk natur vest for Oslo. Erfaring kreves. Eget klatreutstyr medbringes.',                    8, 'klatring', 19, 54),
      ('Padel-turnering Aker Brygge',  demo_host, 'Aker Brygge Padel',  '2026-04-10 18:00:00+02', 'Enkelt padel-turnering med pokalseremoni etterpå. Alle velkomne, blandede nivåer og aldre.',                  16, 'padel',   44, 69),
      ('Langsykling Oslofjorden',      demo_host, 'Vippetangen',        '2026-04-13 08:00:00+02', '60 km rundtur rundt Oslofjorden. Treningstur for erfarne syklister. Tempoet tilpasses gruppen.',              10, 'sykling',  51, 77);

    raise notice 'Seeded 6 activities with host user %', demo_host;
  else
    raise notice 'Activities table already has data — skipping seed.';
  end if;
end;
$$;
