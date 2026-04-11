-- ============================================================
-- Activity coordinate migration
-- Use this when an existing database still has map_pin_x/map_pin_y
-- and the activities table has already been cleared.
-- ============================================================

alter table public.activities
  add column latitude double precision,
  add column longitude double precision;

alter table public.activities
  add constraint activities_latitude_check check (latitude between -90 and 90),
  add constraint activities_longitude_check check (longitude between -180 and 180);

alter table public.activities
  alter column latitude set not null,
  alter column longitude set not null;

alter table public.activities
  drop column map_pin_x,
  drop column map_pin_y;
