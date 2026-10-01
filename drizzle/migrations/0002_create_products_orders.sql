CREATE TYPE public.product_type AS ENUM ('digital_file','saas_access','webapp_tool','spreadsheet');
CREATE TYPE public.billing_type AS ENUM ('one-time','monthly','yearly');
CREATE TYPE public.product_status AS ENUM ('draft','published','archived');
CREATE TYPE public.payment_method AS ENUM ('payoneer','card','bank_transfer');
CREATE TYPE public.payment_status AS ENUM ('pending_verification','paid','failed','refunded');

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  type public.product_type NOT NULL DEFAULT 'webapp_tool',
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  currency text NOT NULL DEFAULT 'USD',
  billing_type public.billing_type NOT NULL DEFAULT 'one-time',
  short_tagline text,
  description text,
  features text[] NOT NULL DEFAULT '{}',
  cover_image_url text,
  downloadable_file_url text,
  external_access_url text,
  demo_url text,
  sort_order int NOT NULL DEFAULT 0,
  status public.product_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT (id,title,slug,type,price,currency,billing_type,short_tagline,description,features,cover_image_url,demo_url,sort_order,status,created_at) ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published products" ON public.products FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method public.payment_method NOT NULL,
  payment_reference text,
  payment_status public.payment_status NOT NULL DEFAULT 'pending_verification',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_product_idx ON public.orders(product_id);
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins manage product covers" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'product-covers' AND public.has_role(auth.uid(),'admin')) WITH CHECK (bucket_id = 'product-covers' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage product files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'product-files' AND public.has_role(auth.uid(),'admin')) WITH CHECK (bucket_id = 'product-files' AND public.has_role(auth.uid(),'admin'));