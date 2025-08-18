-- Migration: Add Booking Analytics System - Part 2: Statistics Functions

-- Function to update booking statistics when a booking is created/updated
create or replace function public.update_booking_statistics()
returns trigger as $$
declare
  provider_id_val uuid;
  stats_record record;
begin
  -- For new bookings
  if tg_op = 'INSERT' then
    provider_id_val := new.provider_id;
    
    -- Get current statistics or initialize if not exists
    insert into public.booking_statistics (provider_id)
    values (provider_id_val)
    on conflict (provider_id) do nothing;
    
    -- Update statistics
    select 
      count(*) as total_bookings,
      count(distinct customer_id) as unique_customers,
      sum(case when is_rebooking then 1 else 0 end) as rebooking_count,
      case 
        when count(*) > 0 then 
          (sum(case when is_rebooking then 1 else 0)::numeric / count(*)) * 100 
        else 0 
      end as rebooking_rate,
      count(distinct case when customer_booking_count > 1 then customer_id end) as repeat_customers,
      case 
        when count(distinct customer_id) > 0 then 
          (count(distinct case when customer_booking_count > 1 then customer_id end)::numeric / 
           count(distinct customer_id)) * 100 
        else 0 
      end as customer_retention_rate
    into stats_record
    from (
      select 
        customer_id,
        is_rebooking,
        count(*) over (partition by customer_id) as customer_booking_count
      from public.bookings
      where provider_id = provider_id_val
      and status = 'COMPLETED'
    ) subquery;
    
    -- Update the statistics
    update public.booking_statistics
    set 
      total_bookings = coalesce(stats_record.total_bookings, 0),
      unique_customers = coalesce(stats_record.unique_customers, 0),
      rebooking_count = coalesce(stats_record.rebooking_count, 0),
      rebooking_rate = coalesce(stats_record.rebooking_rate, 0),
      repeat_customers = coalesce(stats_record.repeat_customers, 0),
      customer_retention_rate = coalesce(stats_record.customer_retention_rate, 0),
      updated_at = now(),
      last_updated = now()
    where provider_id = provider_id_val;
    
    -- If this is a rebooking, update the previous booking
    if new.is_rebooking and new.previous_booking_id is not null then
      update public.bookings
      set is_rebooking = true
      where id = new.previous_booking_id;
    end if;
    
    return new;
    
  -- For updates to existing bookings
  elsif tg_op = 'UPDATE' then
    -- If status changed to COMPLETED, update statistics
    if new.status = 'COMPLETED' and old.status != 'COMPLETED' then
      provider_id_val := new.provider_id;
      
      -- Get current statistics or initialize if not exists
      insert into public.booking_statistics (provider_id)
      values (provider_id_val)
      on conflict (provider_id) do nothing;
      
      -- Update statistics
      select 
        count(*) as total_bookings,
        count(distinct customer_id) as unique_customers,
        sum(case when is_rebooking then 1 else 0 end) as rebooking_count,
        case 
          when count(*) > 0 then 
            (sum(case when is_rebooking then 1 else 0)::numeric / count(*)) * 100 
          else 0 
        end as rebooking_rate,
        count(distinct case when customer_booking_count > 1 then customer_id end) as repeat_customers,
        case 
          when count(distinct customer_id) > 0 then 
            (count(distinct case when customer_booking_count > 1 then customer_id end)::numeric / 
             count(distinct customer_id)) * 100 
          else 0 
        end as customer_retention_rate
      into stats_record
      from (
        select 
          customer_id,
          is_rebooking,
          count(*) over (partition by customer_id) as customer_booking_count
        from public.bookings
        where provider_id = provider_id_val
        and status = 'COMPLETED'
      ) subquery;
      
      -- Update the statistics
      update public.booking_statistics
      set 
        total_bookings = coalesce(stats_record.total_bookings, 0),
        unique_customers = coalesce(stats_record.unique_customers, 0),
        rebooking_count = coalesce(stats_record.rebooking_count, 0),
        rebooking_rate = coalesce(stats_record.rebooking_rate, 0),
        repeat_customers = coalesce(stats_record.repeat_customers, 0),
        customer_retention_rate = coalesce(stats_record.customer_retention_rate, 0),
        updated_at = now(),
        last_updated = now()
      where provider_id = provider_id_val;
    end if;
    
    return new;
    
  -- For deletes
  elsif tg_op = 'DELETE' then
    provider_id_val := old.provider_id;
    
    -- Update statistics
    select 
      count(*) as total_bookings,
      count(distinct customer_id) as unique_customers,
      sum(case when is_rebooking then 1 else 0 end) as rebooking_count,
      case 
        when count(*) > 0 then 
          (sum(case when is_rebooking then 1 else 0)::numeric / count(*)) * 100 
        else 0 
      end as rebooking_rate,
      count(distinct case when customer_booking_count > 1 then customer_id end) as repeat_customers,
      case 
        when count(distinct customer_id) > 0 then 
          (count(distinct case when customer_booking_count > 1 then customer_id end)::numeric / 
           count(distinct customer_id)) * 100 
        else 0 
      end as customer_retention_rate
    into stats_record
    from (
      select 
        customer_id,
        is_rebooking,
        count(*) over (partition by customer_id) as customer_booking_count
      from public.bookings
      where provider_id = provider_id_val
      and status = 'COMPLETED'
      and id != old.id  -- Exclude the deleted booking
    ) subquery;
    
    -- Update the statistics
    update public.booking_statistics
    set 
      total_bookings = coalesce(stats_record.total_bookings, 0),
      unique_customers = coalesce(stats_record.unique_customers, 0),
      rebooking_count = coalesce(stats_record.rebooking_count, 0),
      rebooking_rate = coalesce(stats_record.rebooking_rate, 0),
      repeat_customers = coalesce(stats_record.repeat_customers, 0),
      customer_retention_rate = coalesce(stats_record.customer_retention_rate, 0),
      updated_at = now(),
      last_updated = now()
    where provider_id = provider_id_val;
    
    return old;
  end if;
  
  return null;
end;
$$ language plpgsql security definer;

-- Create trigger for bookings table
create or replace trigger update_booking_statistics_trigger
after insert or update or delete on public.bookings
for each row execute function public.update_booking_statistics();
