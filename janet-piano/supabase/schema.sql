-- Starter schema for Janet's booking backend (Supabase / Postgres). Review before use.
create table students (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  stripe_customer_id text unique,
  created_at timestamptz default now()
);
create table lessons (            -- the catalog: 30/60/90 min singles and monthly programs
  id text primary key,
  title text not null,
  minutes int,
  price_cents int not null,
  recurring boolean default false,
  stripe_price_id text
);
create table availability (       -- slots Janet opens up
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null unique,
  ends_at timestamptz not null,
  is_open boolean default true
);
create table bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  lesson_id text references lessons(id),
  availability_id uuid references availability(id),
  status text default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz default now()
);
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  lesson_id text references lessons(id),
  stripe_subscription_id text unique,
  status text,
  current_period_end timestamptz
);
create table payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  stripe_payment_intent text unique,
  amount_cents int,
  status text,
  created_at timestamptz default now()
);
alter table students enable row level security;
alter table bookings enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
-- Add policies so students only read their own rows; write via the server (service role).
