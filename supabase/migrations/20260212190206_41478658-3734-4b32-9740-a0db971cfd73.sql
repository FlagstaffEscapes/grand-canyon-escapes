
-- Add explicit admin-only SELECT policy for contact_submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add explicit admin-only SELECT policy for owner_inquiries  
CREATE POLICY "Admins can view owner inquiries"
ON public.owner_inquiries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
