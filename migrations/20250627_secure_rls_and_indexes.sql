begin;

-- Ensure RLS is enabled where required
alter table if exists public.profiles enable row level security;

-- Public read tables
drop policy if exists "Allow read for all users" on public.service_categories;
create policy "Allow read for all users" on public.service_categories
for select using (true);

drop policy if exists "Allow read for all users" on public.services;
create policy "Allow read for all users" on public.services
for select using (true);

-- Profiles: allow read by everyone (writes via service role only)
drop policy if exists "Allow read for all users" on public.profiles;
create policy "Allow read for all users" on public.profiles
for select using (true);

-- Customers: full CRUD by owner
drop policy if exists "Users can manage their customer record" on public.customers;
create policy "Users can manage their customer record" on public.customers
for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Professionals: full CRUD by owner
drop policy if exists "Users can manage their professional record" on public.professionals;
create policy "Users can manage their professional record" on public.professionals
for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Bookings: view by participants; create by customer; update by participants; delete by customer
drop policy if exists "Users can view their bookings" on public.bookings;
create policy "Users can view their bookings" on public.bookings
for select using (
  (customer_id in (select id from public.customers where user_id = (select auth.uid())))
  or
  (provider_id in (select id from public.professionals where user_id = (select auth.uid())))
);

drop policy if exists "Customers can create their bookings" on public.bookings;
create policy "Customers can create their bookings" on public.bookings
for insert with check (
  customer_id in (select id from public.customers where user_id = (select auth.uid()))
);

drop policy if exists "Participants can update their bookings" on public.bookings;
create policy "Participants can update their bookings" on public.bookings
for update using (
  (customer_id in (select id from public.customers where user_id = (select auth.uid())))
  or
  (provider_id in (select id from public.professionals where user_id = (select auth.uid())))
);

drop policy if exists "Customers can delete their bookings" on public.bookings;
create policy "Customers can delete their bookings" on public.bookings
for delete using (
  customer_id in (select id from public.customers where user_id = (select auth.uid()))
);

-- Messages: optimized policies using (select auth.uid()) to avoid initplan re-evaluation
drop policy if exists "Users can view their messages" on public.messages;
create policy "Users can view their messages" on public.messages
for select using (
  sender_id = (select auth.uid()) or receiver_id = (select auth.uid())
);

drop policy if exists "Users can insert their own messages" on public.messages;
create policy "Users can insert their own messages" on public.messages
for insert with check (
  sender_id = (select auth.uid())
);

-- Profile settings: owner-managed
drop policy if exists "Users can manage their profile settings" on public.profile_settings;
create policy "Users can manage their profile settings" on public.profile_settings
for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Location updates: owner read/insert
drop policy if exists "Users can view their own location updates" on public.location_updates;
create policy "Users can view their own location updates" on public.location_updates
for select using (user_id = (select auth.uid()));

drop policy if exists "Users can insert their own location updates" on public.location_updates;
create policy "Users can insert their own location updates" on public.location_updates
for insert with check (user_id = (select auth.uid()));

-- Reviews: read by authenticated; CRUD by owning customer
drop policy if exists "Authenticated users can read reviews" on public.reviews;
create policy "Authenticated users can read reviews" on public.reviews
for select using ((select auth.uid()) is not null);

drop policy if exists "Customers can create their own reviews" on public.reviews;
create policy "Customers can create their own reviews" on public.reviews
for insert with check (customer_id in (select id from public.customers where user_id = (select auth.uid())));

drop policy if exists "Customers can update their own reviews" on public.reviews;
create policy "Customers can update their own reviews" on public.reviews
for update using (customer_id in (select id from public.customers where user_id = (select auth.uid())));

drop policy if exists "Customers can delete their own reviews" on public.reviews;
create policy "Customers can delete their own reviews" on public.reviews
for delete using (customer_id in (select id from public.customers where user_id = (select auth.uid())));

-- Foreign key covering indexes
create index if not exists idx_bookings_service_id on public.bookings(service_id);
create index if not exists idx_messages_receiver_id on public.messages(receiver_id);
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_profile_settings_user_id on public.profile_settings(user_id);
create index if not exists idx_reviews_booking_id on public.reviews(booking_id);
create index if not exists idx_reviews_customer_id on public.reviews(customer_id);
create index if not exists idx_services_category_id on public.services(category_id);

-- Set function search_path in a future-proof way
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema,
           p.proname AS name,
           pg_catalog.pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('get_customer_rebooking_history','get_nearby_providers')
  LOOP
    EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp', r.schema, r.name, r.args);
  END LOOP;
END$$;

commit;


