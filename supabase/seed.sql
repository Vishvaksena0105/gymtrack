-- ============================================================
-- GymTrack - Sample Seed Data
-- Run AFTER schema.sql in Supabase SQL editor
-- Dates are relative to 2026-04-10 for testing
-- ============================================================

insert into members (name, phone, location, join_date, plan_duration, expiry_date, amount_paid, slot) values
  -- Overdue members
  ('Arjun Mehta',    '9876543210', 'Koramangala', '2026-01-10', 30, '2026-02-09', 1200.00, 'Morning'),
  ('Priya Singh',    '9823456789', 'Indiranagar',  '2026-01-15', 60, '2026-03-15', 2200.00, 'Evening'),
  ('Kiran Rao',      '9745678901', 'HSR Layout',   '2026-02-01', 30, '2026-03-02', 1200.00, 'Morning'),

  -- Due today (2026-04-10)
  ('Sneha Patel',    '9812345678', 'BTM Layout',   '2026-03-11', 30, '2026-04-10', 1200.00, 'Morning'),
  ('Ravi Kumar',     '9934567890', 'JP Nagar',     '2026-02-09', 60, '2026-04-10', 2200.00, 'Evening'),

  -- Upcoming (next 5 days: 2026-04-11 to 2026-04-15)
  ('Anita Desai',    '9856789012', 'Whitefield',   '2026-03-12', 30, '2026-04-11', 1200.00, 'Morning'),
  ('Mahesh Babu',    '9778901234', 'Electronic City','2026-02-14', 60, '2026-04-15', 2200.00, 'Evening'),
  ('Deepika Nair',   '9890123456', 'Marathahalli', '2026-03-14', 30, '2026-04-13', 1200.00, 'Morning'),

  -- Active members (well within their plan)
  ('Sanjay Gupta',   '9901234567', 'Bellandur',    '2026-03-20', 30, '2026-04-19', 1200.00, 'Morning'),
  ('Lakshmi Iyer',   '9712345678', 'Sarjapur',     '2026-03-01', 60, '2026-04-30', 2200.00, 'Evening'),
  ('Rohit Sharma',   '9823451234', 'Bannerghatta', '2026-04-01', 30, '2026-05-01', 1200.00, 'Morning'),
  ('Meena Krishnan', '9767890123', 'Yelahanka',    '2026-02-20', 60, '2026-04-21', 2200.00, 'Evening');
