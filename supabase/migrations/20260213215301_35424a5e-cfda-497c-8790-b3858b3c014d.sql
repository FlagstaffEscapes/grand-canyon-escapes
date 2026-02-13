
-- Create property bookings table for admin scheduling calendar
CREATE TABLE public.property_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_bookings ENABLE ROW LEVEL SECURITY;

-- Admin can manage all bookings
CREATE POLICY "Admins can do all on property_bookings"
ON public.property_bookings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can read bookings (to check availability)
CREATE POLICY "Public can view bookings for availability"
ON public.property_bookings
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_property_bookings_updated_at
BEFORE UPDATE ON public.property_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
