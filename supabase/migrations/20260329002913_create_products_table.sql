create table products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  stock integer not null default 0,
  badge text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public can read products"
  on products for select using (true);

create policy "Allow stock update"
  on products for update using (true);

create or replace function decrement_stock(p_id text, qty integer)
returns void as $$
begin
  update products
  set stock = greatest(stock - qty, 0)
  where id = p_id;
end;
$$ language plpgsql;
