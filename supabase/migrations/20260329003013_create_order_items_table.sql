create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text references products(id),
  quantity integer not null,
  unit_price numeric not null
);

alter table order_items enable row level security;

create policy "Allow insert order_items"
  on order_items for insert with check (true);
