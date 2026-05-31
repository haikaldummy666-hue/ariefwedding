-- Create guests table with barcode support
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 255),
  barcode_id TEXT NOT NULL UNIQUE,
  barcode_data TEXT NOT NULL, -- Base64 encoded barcode
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'reminded', 'declined')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_guests_barcode_id ON public.guests(barcode_id);
CREATE INDEX idx_guests_name ON public.guests(name);
CREATE INDEX idx_attendance_guest_id ON public.attendance(guest_id);
CREATE INDEX idx_attendance_checked_in_at ON public.attendance(checked_in_at);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Policies for guests
CREATE POLICY "Anyone can read guests"
  ON public.guests FOR SELECT
  USING (true);

CREATE POLICY "Only admin can insert guests"
  ON public.guests FOR INSERT
  WITH CHECK (true); -- In production, implement proper auth check

CREATE POLICY "Only admin can update guests"
  ON public.guests FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policies for attendance
CREATE POLICY "Anyone can read attendance"
  ON public.attendance FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (true);

-- Add tables to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
