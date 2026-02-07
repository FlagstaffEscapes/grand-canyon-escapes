-- Create app role enum for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for RBAC
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create properties table
CREATE TABLE public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    tagline text,
    description text,
    bedrooms integer DEFAULT 1,
    bathrooms numeric DEFAULT 1,
    sleeps integer DEFAULT 2,
    sqft integer,
    price_per_night numeric NOT NULL DEFAULT 0,
    address text,
    city text DEFAULT 'Flagstaff',
    state text DEFAULT 'AZ',
    latitude numeric,
    longitude numeric,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT false,
    amenities text[] DEFAULT '{}',
    house_rules text,
    check_in_time text DEFAULT '4:00 PM',
    check_out_time text DEFAULT '11:00 AM'
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create property_images table
CREATE TABLE public.property_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    image_url text NOT NULL,
    alt_text text,
    display_order integer DEFAULT 0,
    is_primary boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on property_images
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text,
    property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
    submission_type text DEFAULT 'general',
    is_read boolean DEFAULT false
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create owner_inquiries table
CREATE TABLE public.owner_inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    property_address text,
    property_type text,
    bedrooms integer,
    currently_renting boolean DEFAULT false,
    message text,
    is_read boolean DEFAULT false
);

-- Enable RLS on owner_inquiries
ALTER TABLE public.owner_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for properties
CREATE POLICY "Public can view active properties" ON public.properties
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do all on properties" ON public.properties
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for property_images
CREATE POLICY "Public can view property images" ON public.property_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can do all on property_images" ON public.property_images
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for contact_submissions
CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can do all on contact_submissions" ON public.contact_submissions
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for owner_inquiries
CREATE POLICY "Public can insert owner inquiries" ON public.owner_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can do all on owner_inquiries" ON public.owner_inquiries
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for properties updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies for property-images bucket
CREATE POLICY "Public can view property images" ON storage.objects
    FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update property images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete property images" ON storage.objects
    FOR DELETE USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));