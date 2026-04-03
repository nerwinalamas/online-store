create table orders (
  id uuid primary key default gen_random_uuid(),
  total_price numeric not null,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Allow insert orders"
  on orders for insert with check (true);
