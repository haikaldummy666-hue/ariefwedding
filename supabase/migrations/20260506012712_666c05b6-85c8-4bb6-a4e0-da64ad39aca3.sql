
CREATE TABLE public.guestbook (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
  attending BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook"
  ON public.guestbook FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit guestbook entry"
  ON public.guestbook FOR INSERT
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook;
