-- Migration: Add Booking Analytics System - Part 4: RLS and Final Setup

-- Row Level Security (RLS) policies
-- Enable RLS on bookings table
alter table public.bookings enable row level security;

-- RLS policies for bookings
create policy "Customers can view their own bookings"
on public.bookings
for select using (auth.uid() = customer_id);

create policy "Providers can view their own bookings"
on public.bookings
for select using (auth.uid() = provider_id);

create policy "Customers can create their own bookings"
on public.bookings
for insert with check (auth.uid() = customer_id);

create policy "Providers can update their own bookings"
on public.bookings
for update using (auth.uid() = provider_id);

create policy "Admins can manage all bookings"
on public.bookings
for all using (exists (
  select 1 from auth.users
  where id = auth.uid() and (raw_user_meta_data->>'is_admin')::boolean = true
));

-- RLS for booking_statistics
alter table public.booking_statistics enable row level security;

create policy "Anyone can view booking statistics"
on public.booking_statistics
for select using (true);

create policy "Providers can view their own statistics"
on public.booking_statistics
for select using (auth.uid() = provider_id);

-- Grant permissions
grant select on public.bookings to anon, authenticated;
grant insert (customer_id, provider_id, service_id, booking_date, service_date, status, estimated_duration, price, notes) 
on public.bookings to authenticated;
grant update (status, notes) on public.bookings to authenticated;
grant select on public.booking_statistics to anon, authenticated;

-- Add comments for documentation
comment on table public.bookings is 'Tracks all service bookings between customers and providers';
comment on column public.bookings.is_rebooking is 'True if this is a rebooking with the same provider';
comment on column public.bookings.previous_booking_id is 'Reference to the previous booking if this is a rebooking';

comment on table public.booking_statistics is 'Aggregated booking statistics for providers';
comment on column public.booking_statistics.rebooking_rate is 'Percentage of bookings that are rebookings';
comment on column public.booking_statistics.customer_retention_rate is 'Percentage of customers who have booked more than once';

-- Create a view for provider dashboard
create or replace view public.provider_dashboard_stats as
select 
  p.id as provider_id,
  p.full_name as provider_name,
  p.avatar_url,
  p.business_description,
  coalesce(bs.total_bookings, 0) as total_bookings,
  coalesce(bs.unique_customers, 0) as unique_customers,
  coalesce(bs.rebooking_count, 0) as rebooking_count,
  coalesce(bs.rebooking_rate, 0) as rebooking_rate,
  coalesce(bs.repeat_customers, 0) as repeat_customers,
  coalesce(bs.customer_retention_rate, 0) as customer_retention_rate,
  avg(r.rating) as average_rating,
  count(r.id) as review_count,
  -- Calculate trust score (60% rebooking rate, 40% rating)
  case 
    when count(b.id) >= 1 then
      (coalesce(bs.rebooking_rate, 0) * 0.6) +
      (coalesce(avg(r.rating), 0) * 0.4 * 20) -- Scale 1-5 to 0-100 (20 points per star)
    else 0 
  end as trust_score,
  -- Get most recent bookings
  (
    select json_agg(
      json_build_object(
        'id', b.id,
        'customer_name', c.full_name,
        'service_date', b.service_date,
        'status', b.status,
        'is_rebooking', b.is_rebooking
      )
      order by b.service_date desc
      limit 5
    )
    from public.bookings b
    join public.profiles c on c.id = b.customer_id
    where b.provider_id = p.id
  ) as recent_bookings
from public.profiles p
left join public.booking_statistics bs on bs.provider_id = p.id
left join public.bookings b on b.provider_id = p.id and b.status = 'COMPLETED'
left join public.reviews r on r.provider_id = p.id
where p.role = 'PROVIDER'
group by p.id, bs.id;

-- Grant access to the view
grant select on public.provider_dashboard_stats to authenticated;

-- Create a function to check if a booking is a rebooking
create or replace function public.is_rebooking(
  p_customer_id uuid,
  p_provider_id uuid
)
returns boolean as $$
declare
  has_previous_booking boolean;
begin
  select exists (
    select 1 
    from public.bookings 
    where customer_id = p_customer_id 
    and provider_id = p_provider_id
    and status = 'COMPLETED'
  ) into has_previous_booking;
  
  return has_previous_booking;
end;
$$ language plpgsql security definer;

-- Create a function to get the previous booking ID
create or replace function public.get_previous_booking_id(
  p_customer_id uuid,
  p_provider_id uuid
)
returns uuid as $$
declare
  previous_booking_id uuid;
begin
  select id into previous_booking_id
  from public.bookings
  where customer_id = p_customer_id 
  and provider_id = p_provider_id
  and status = 'COMPLETED'
  order by service_date desc
  limit 1;
  
  return previous_booking_id;
end;
$$ language plpgsql security definer;
