create index if not exists activities_host_user_id_idx
  on public.activities (host_user_id);

create index if not exists activity_participants_user_id_idx
  on public.activity_participants (user_id);

alter policy "profiles: own insert"
  on public.profiles
  with check (id = (select auth.uid()));

alter policy "profiles: own update"
  on public.profiles
  using (id = (select auth.uid()));

alter policy "activities: authenticated insert"
  on public.activities
  with check (host_user_id = (select auth.uid()));

alter policy "activities: host update"
  on public.activities
  using (host_user_id = (select auth.uid()));

alter policy "activities: host delete"
  on public.activities
  using (host_user_id = (select auth.uid()));

alter policy "participants: own insert"
  on public.activity_participants
  with check (user_id = (select auth.uid()));

alter policy "participants: own delete"
  on public.activity_participants
  using (user_id = (select auth.uid()));
