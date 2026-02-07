-- Fix RLS policies for contact_submissions
DROP POLICY IF EXISTS "Admins can do all on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can do all on contact_submissions" ON public.contact_submissions
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Fix RLS policies for owner_inquiries
DROP POLICY IF EXISTS "Admins can do all on owner_inquiries" ON public.owner_inquiries;
DROP POLICY IF EXISTS "Allow public insert on owner_inquiries" ON public.owner_inquiries;
DROP POLICY IF EXISTS "Public can insert owner inquiries" ON public.owner_inquiries;

CREATE POLICY "Admins can do all on owner_inquiries" ON public.owner_inquiries
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can insert owner inquiries" ON public.owner_inquiries
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create area_guides table
CREATE TABLE public.area_guides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    distance text,
    drive_time text,
    image_url text,
    highlights text[] DEFAULT '{}',
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true
);

-- Create area_guide_activities table
CREATE TABLE public.area_guide_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    category text NOT NULL,
    items text[] DEFAULT '{}',
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE public.area_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area_guide_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for area_guides
CREATE POLICY "Public can view active area guides" ON public.area_guides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do all on area_guides" ON public.area_guides
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for area_guide_activities
CREATE POLICY "Public can view active activities" ON public.area_guide_activities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do all on area_guide_activities" ON public.area_guide_activities
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on area_guides
CREATE TRIGGER update_area_guides_updated_at
    BEFORE UPDATE ON public.area_guides
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial area guides data
INSERT INTO public.area_guides (title, slug, description, distance, drive_time, highlights, display_order, is_active) VALUES
(
    'Grand Canyon National Park',
    'grand-canyon',
    'One of the world''s most spectacular natural wonders, just an hour from Flagstaff. Watch the sunrise paint the canyon walls in shades of orange and red.',
    '80 miles',
    '1.5 hours',
    ARRAY['South Rim viewpoints', 'Bright Angel Trail', 'Desert View Watchtower', 'Mule rides', 'Helicopter tours'],
    1,
    true
),
(
    'Sedona',
    'sedona',
    'Famous for its stunning red rock formations, spiritual vortexes, and vibrant arts scene. A must-visit destination for hiking, photography, and relaxation.',
    '30 miles',
    '45 minutes',
    ARRAY['Cathedral Rock', 'Bell Rock', 'Red Rock State Park', 'Tlaquepaque Arts Village', 'Spa resorts'],
    2,
    true
),
(
    'Downtown Flagstaff',
    'downtown-flagstaff',
    'Historic Route 66 charm meets mountain-town culture. Explore local breweries, boutique shops, and farm-to-table restaurants.',
    '0 miles',
    'You''re here!',
    ARRAY['Historic downtown', 'Local breweries', 'Route 66', 'Wheeler Park', 'Flagstaff Symphony'],
    3,
    true
);

-- Seed initial activities data
INSERT INTO public.area_guide_activities (category, items, display_order, is_active) VALUES
(
    'Winter Adventures',
    ARRAY['Arizona Snowbowl skiing', 'Cross-country skiing', 'Snowshoeing', 'Ice skating'],
    1,
    true
),
(
    'Outdoor Recreation',
    ARRAY['Hiking trails', 'Mountain biking', 'Rock climbing', 'Fishing', 'Golf courses'],
    2,
    true
),
(
    'Stargazing',
    ARRAY['Lowell Observatory', 'Dark sky viewing', 'Astronomy tours', 'Meteor Crater'],
    3,
    true
),
(
    'Cultural Experiences',
    ARRAY['Museum of Northern Arizona', 'Wupatki National Monument', 'Walnut Canyon', 'Sunset Crater'],
    4,
    true
);