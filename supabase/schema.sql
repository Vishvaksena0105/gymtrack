-- ============================================================
-- GymTrack - Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

create table if not exists members (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  phone         text        not null,
  location      text,
  join_date     date        not null,
  plan_duration integer     not null check (plan_duration in (30, 60)),
  expiry_date   date        not null,
  amount_paid   numeric(10, 2),
  slot          text        not null default 'Morning' check (slot in ('Morning', 'Evening')),
  created_at    timestamptz not null default now()
);

-- Index for fast search by name and phone
create index if not exists idx_members_name  on members (name);
create index if not exists idx_members_phone on members (phone);
create index if not exists idx_members_expiry on members (expiry_date);

-- ============================================================
-- Row Level Security (keep it simple — no auth required)
-- Allow full public access since there's no login system
-- ============================================================
alter table members enable row level security;

-- Allow all operations without authentication
create policy "public_all" on members
  for all
  using (true)
  with check (true);
