
# Implementation Plan: Admin Panel Testing, RLS Fix, Area Guide Management

## Overview

This plan addresses multiple issues and enhancements:
1. Fix the 401 authentication errors on public form submissions
2. Enable end-to-end testing of the admin panel
3. Add Area Guide management functionality to the admin panel
4. Create database table for area guide content

---

## Problem Analysis

### Root Cause: RESTRICTIVE RLS Policies

The contact and owner inquiry form submissions are failing with 401 errors because the RLS policies were created incorrectly. Looking at the current database state:

```text
Policy Name: Admins can do all on contact_submissions 
Command: ALL
Permissive: No  <-- THIS IS THE PROBLEM

Policy Name: Public can insert contact submissions 
Command: INSERT
Permissive: No  <-- THIS IS ALSO WRONG
```

When policies are **RESTRICTIVE** (`Permissive: No`), ALL policies must pass for the operation to succeed. An anonymous user trying to insert:
- "Admins can do all" policy fails (user is not admin)
- Even though "Public can insert" would pass, the restrictive admin policy blocks it

**Solution:** Recreate the INSERT policies as PERMISSIVE (the default), or remove the restrictive qualifier from the admin ALL policy for these tables.

---

## Implementation Steps

### Step 1: Fix RLS Policies for Public Form Submissions

Create a database migration to drop and recreate the policies correctly:

**For `contact_submissions` table:**
- Drop the existing restrictive policies
- Recreate "Public can insert" as a PERMISSIVE INSERT policy
- Recreate "Admins can do all" as a PERMISSIVE ALL policy

**For `owner_inquiries` table:**
- Apply the same fixes

Also remove duplicate policies ("Allow public insert" and "Public can insert" exist for both tables).

### Step 2: Create Area Guide Database Table

Create a new `area_guides` table to store the experiences/destinations content:

```text
area_guides table:
- id (uuid, primary key)
- created_at, updated_at (timestamps)
- title (text) - "Grand Canyon National Park"
- slug (text, unique) - "grand-canyon"
- description (text) - Full description
- distance (text) - "80 miles"
- drive_time (text) - "1.5 hours"
- image_url (text) - Hero image
- highlights (text array) - ["South Rim viewpoints", "Bright Angel Trail"]
- category (text) - "destination" or "activity_category"
- display_order (integer) - For ordering
- is_active (boolean) - Published or draft
```

Create a separate `area_guide_activities` table for activity categories:

```text
area_guide_activities table:
- id (uuid, primary key)
- created_at (timestamp)
- category (text) - "Winter Adventures"
- items (text array) - ["Arizona Snowbowl skiing", "Cross-country skiing"]
- display_order (integer)
- is_active (boolean)
```

**RLS Policies:**
- Public can SELECT where is_active = true
- Admins have full access

### Step 3: Seed Initial Area Guide Data

Create a migration to insert the existing templated data from `Experiences.tsx`:

**Destinations:**
1. Grand Canyon National Park
2. Sedona
3. Downtown Flagstaff

**Activity Categories:**
1. Winter Adventures
2. Outdoor Recreation
3. Stargazing
4. Cultural Experiences

### Step 4: Create Admin Area Guide Pages

**New files to create:**

1. `src/pages/admin/AdminAreaGuides.tsx`
   - List view showing all area guides and activity categories
   - Toggle active/inactive status
   - Edit and delete buttons
   - Tabs for "Destinations" and "Activities"

2. `src/pages/admin/AdminAreaGuideEditor.tsx`
   - Form for editing/creating destinations
   - Image upload for hero image
   - Highlights management (add/remove tags)
   - Save draft / Publish buttons

3. `src/hooks/useAreaGuides.ts`
   - React Query hooks for CRUD operations
   - `useAreaGuides()` - Fetch all
   - `useAreaGuideBySlug()` - Fetch single
   - `useCreateAreaGuide()`, `useUpdateAreaGuide()`, `useDeleteAreaGuide()`
   - Similar hooks for activity categories

### Step 5: Update Admin Navigation

Modify `AdminLayout.tsx` to add:
- "Area Guide" navigation item in the sidebar
- Link to `/admin/area-guides`

### Step 6: Update App.tsx Routes

Add new protected routes:
- `/admin/area-guides` - List view
- `/admin/area-guides/:id` - Editor

### Step 7: Update Experiences Page to Use Database

Modify `src/pages/Experiences.tsx`:
- Import and use the new `useAreaGuides` hooks
- Fetch destinations and activities from the database
- Add skeleton loaders during loading
- Handle empty states

---

## Technical Details

### Database Migration SQL

```sql
-- Fix RLS policies for contact_submissions
DROP POLICY IF EXISTS "Admins can do all on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can do all on contact_submissions" ON public.contact_submissions
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Same pattern for owner_inquiries table

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
    is_active boolean DEFAULT false
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

-- RLS Policies
CREATE POLICY "Public can view active area guides" ON public.area_guides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do all on area_guides" ON public.area_guides
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Similar for activities table
```

### Admin Area Guide List Component Structure

```text
AdminAreaGuides.tsx
+-- Tabs: Destinations | Activities
+-- Destinations Tab
|   +-- "Add Destination" button
|   +-- Table/Grid of destinations
|       +-- Image thumbnail
|       +-- Title
|       +-- Distance/Time
|       +-- Status toggle
|       +-- Edit/Delete buttons
+-- Activities Tab
    +-- "Add Category" button
    +-- List of activity categories
        +-- Category name
        +-- Item count
        +-- Edit/Delete buttons
```

### File Changes Summary

**New Files:**
- `src/pages/admin/AdminAreaGuides.tsx`
- `src/pages/admin/AdminAreaGuideEditor.tsx`
- `src/hooks/useAreaGuides.ts`

**Modified Files:**
- `src/App.tsx` - Add new routes
- `src/components/admin/AdminLayout.tsx` - Add nav item
- `src/pages/Experiences.tsx` - Use database data

**Database Migrations:**
- Fix RLS policies for contact_submissions and owner_inquiries
- Create area_guides and area_guide_activities tables
- Seed initial data from existing template

---

## Testing Checklist

After implementation:

1. **Form Submissions (Public)**
   - Submit contact form on About page - should succeed
   - Submit owner inquiry form on Owners page - should succeed
   - Verify entries appear in database
   - Verify email notifications are sent

2. **Admin Panel Flow**
   - Login at /admin/login
   - View dashboard with stats
   - Add new property with images
   - Publish property and verify on public site
   - View contact submissions
   - View owner inquiries

3. **Area Guide Management**
   - View area guides list
   - Edit existing destination
   - Add new destination with image
   - Manage activity categories
   - Toggle active status
   - Verify changes appear on public Experiences page
