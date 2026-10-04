ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_price numeric, ADD COLUMN IF NOT EXISTS badge text, ADD COLUMN IF NOT EXISTS etsy_url text, ADD COLUMN IF NOT EXISTS stripe_url text, ADD COLUMN IF NOT EXISTS sales_count integer NOT NULL DEFAULT 0;

CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  platform text NOT NULL DEFAULT 'etsy',
  listing_url text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  views integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  platform text NOT NULL DEFAULT 'etsy',
  status text NOT NULL DEFAULT 'paid',
  date timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.edit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  website_url text,
  task_type text NOT NULL DEFAULT 'repair',
  description text,
  status text NOT NULL DEFAULT 'pending',
  budget numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings, public.sales, public.edit_requests TO authenticated;
GRANT ALL ON public.listings, public.sales, public.edit_requests TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage listings" ON public.listings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage sales" ON public.sales FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage edit requests" ON public.edit_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.grant_admin_on_signup()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF lower(NEW.email) = 'info@logicgridlab.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;