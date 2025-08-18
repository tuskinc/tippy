-- Migration: Add Booking Analytics System - Part 1: Tables and Indexes
-- This migration adds support for tracking and analyzing booking patterns

-- Enable necessary extensions
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- Create enum for booking status if it doesn't exist
do $$
begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum (
      'PENDING',
      'CONFIRMED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED'
    );
  end if;
end $$;

-- Create bookings table if it doesn't exist
create table if not exists public.bookings (
  id uuid primary key default extensions.uuid_generate_v4(),
  customer_id uuid references auth.users(id) on delete cascade not null,
  provider_id uuid references auth.users(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete set null,
  booking_date timestamptz not null default now(),
  service_date timestamptz not null,
  status public.booking_status not null default 'PENDING',
  is_rebooking boolean not null default false,
  previous_booking_id uuid references public.bookings(id) on delete set null,
  estimated_duration integer not null, -- in minutes
  price numeric(10, 2),
  notes text,
  tracking_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint valid_booking_dates check (service_date >= booking_date),
  constraint valid_self_reference check (id != previous_booking_id)
);

-- Create booking_statistics table if it doesn't exist
create table if not exists public.booking_statistics (
  id uuid primary key default extensions.uuid_generate_v4(),
  provider_id uuid references auth.users(id) on delete cascade not null,
  total_bookings integer not null default 0,
  unique_customers integer not null default 0,
  rebooking_count integer not null default 0,
  rebooking_rate numeric(5, 2) not null default 0.00, -- percentage
  repeat_customers integer not null default 0,
  customer_retention_rate numeric(5, 2) not null default 0.00, -- percentage
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint valid_rates check (
    rebooking_rate between 0 and 100 
    and customer_retention_rate between 0 and 100
  ),
  unique(provider_id)
);

-- Create indexes for performance
create index if not exists idx_bookings_provider_id_status on public.bookings(provider_id, status);
create index if not exists idx_bookings_customer_provider on public.bookings(customer_id, provider_id);
create index if not exists idx_bookings_booking_date on public.bookings(booking_date);
create index if not exists idx_bookings_service_date on public.bookings(service_date);
create index if not exists idx_booking_statistics_provider_id on public.booking_statistics(provider_id);
