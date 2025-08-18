-- Migration: Add Booking Analytics System - Part 3: API Functions

-- Function to get provider booking statistics
create or replace function public.get_provider_booking_stats(provider_id uuid)
returns json as $$
  select json_build_object(
    'provider_id', bs.provider_id,
    'total_bookings', bs.total_bookings,
    'unique_customers', bs.unique_customers,
    'rebooking_count', bs.rebooking_count,
    'rebooking_rate', bs.rebooking_rate,
    'repeat_customers', bs.repeat_customers,
    'customer_retention_rate', bs.customer_retention_rate,
    'last_updated', bs.last_updated
  )
  from public.booking_statistics bs
  where bs.provider_id = $1;
$$ language sql security definer;

-- Function to get top providers by rebooking rate
create or replace function public.get_top_providers(
  min_bookings integer default 5,
  limit_count integer default 10
)
returns table (
  provider_id uuid,
  provider_name text,
  provider_avatar text,
  total_bookings bigint,
  rebooking_rate numeric(5,2),
  average_rating numeric(3,2),
  review_count bigint,
  trust_score numeric(5,2)
) as $$
  with provider_stats as (
    select 
      p.id as provider_id,
      p.full_name as provider_name,
      p.avatar_url as provider_avatar,
      count(b.id) as total_bookings,
      case 
        when count(b.id) >= $1 then 
          (count(case when b.is_rebooking then 1 end)::numeric / 
           nullif(count(b.id), 0)) * 100 
        else 0 
      end as rebooking_rate,
      avg(r.rating) as average_rating,
      count(r.id) as review_count,
      -- Calculate trust score (60% rebooking rate, 40% rating)
      case 
        when count(b.id) >= $1 then
          ((count(case when b.is_rebooking then 1 end)::numeric / 
            nullif(count(b.id), 0)) * 0.6 * 100) +
          (coalesce(avg(r.rating), 0) * 0.4 * 20) -- Scale 1-5 to 0-100 (20 points per star)
        else 0 
      end as trust_score
    from public.profiles p
    left join public.bookings b on b.provider_id = p.id and b.status = 'COMPLETED'
    left join public.reviews r on r.provider_id = p.id
    where p.role = 'PROVIDER'
    group by p.id
    having count(b.id) >= $1
    order by trust_score desc, total_bookings desc
    limit $2
  )
  select 
    provider_id,
    provider_name,
    provider_avatar,
    total_bookings,
    rebooking_rate,
    average_rating,
    review_count,
    trust_score
  from provider_stats;
$$ language sql security definer;

-- Function to get customer rebooking history
create or replace function public.get_customer_rebooking_history(customer_id uuid)
returns table (
  provider_id uuid,
  provider_name text,
  provider_avatar text,
  total_bookings bigint,
  last_booking_date timestamptz,
  is_favorite boolean
) as $$
  select 
    p.id as provider_id,
    p.full_name as provider_name,
    p.avatar_url as provider_avatar,
    count(b.id) as total_bookings,
    max(b.service_date) as last_booking_date,
    count(b.id) > 1 as is_favorite
  from public.bookings b
  join public.profiles p on p.id = b.provider_id
  where b.customer_id = $1
  and b.status = 'COMPLETED'
  group by p.id
  order by max(b.service_date) desc;
$$ language sql security definer;

-- Function to get booking trends over time
create or replace function public.get_booking_trends(
  provider_id uuid,
  time_range interval default '30 days',
  group_by_interval interval default '1 day'
)
returns table (
  period_start timestamptz,
  period_end timestamptz,
  booking_count bigint,
  rebooking_count bigint,
  revenue numeric(10,2)
) as $$
  select
    date_trunc('day', booking_date) as period_start,
    date_trunc('day', booking_date) + group_by_interval as period_end,
    count(*) as booking_count,
    count(case when is_rebooking then 1 end) as rebooking_count,
    coalesce(sum(price), 0) as revenue
  from public.bookings
  where 
    provider_id = $1
    and booking_date >= now() - time_range
    and status = 'COMPLETED'
  group by 1
  order by 1;
$$ language sql security definer;
