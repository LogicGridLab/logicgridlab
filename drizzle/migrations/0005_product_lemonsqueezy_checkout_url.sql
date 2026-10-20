ALTER TABLE public.products ADD COLUMN lemon_squeezy_url text;
COMMENT ON COLUMN public.products.lemon_squeezy_url IS 'Public Lemon Squeezy checkout URL configured by the product administrator.';