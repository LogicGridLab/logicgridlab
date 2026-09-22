CREATE TABLE public.directory_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'ai-directories',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT directory_waitlist_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT directory_waitlist_email_unique UNIQUE (email)
);
GRANT INSERT ON public.directory_waitlist TO anon;
GRANT INSERT ON public.directory_waitlist TO authenticated;
GRANT ALL ON public.directory_waitlist TO service_role;
ALTER TABLE public.directory_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join directory waitlist"
ON public.directory_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (source = 'ai-directories');