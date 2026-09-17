CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_token text NOT NULL UNIQUE,
  order_number text NOT NULL,
  order_message text NOT NULL,
  product_slug text,
  product_name text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  customer_name text,
  customer_phone text,
  customer_email text,
  notes text,
  status text NOT NULL DEFAULT 'pending_receipt',
  telegram_chat_id bigint,
  telegram_username text,
  receipt_file_id text,
  linked_at timestamptz,
  receipt_received_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_orders_token ON public.orders (order_token);
CREATE INDEX idx_orders_chat ON public.orders (telegram_chat_id);