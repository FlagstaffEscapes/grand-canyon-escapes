

# Refocus Site Toward Property Owner Acquisition

## Goal
Shift the site's primary audience from vacation guests to prospective property owners who might partner with Flagstaff Escapes for property management services, while still keeping the guest-facing rental content intact.

---

## Changes Overview

### 1. Homepage Hero -- Owner-First Messaging
**File:** `src/pages/Index.tsx`

- Change the hero headline from "Your Gateway to the Grand Canyon" to something owner-focused like **"Flagstaff's Premier Vacation Rental Management"**
- Change the subtitle from guest-oriented copy to owner-focused: **"We turn luxury properties into top-performing vacation rentals. Full-service management, maximum returns."**
- Swap the primary CTA button from "Browse Properties" to **"Partner With Us"** (links to `/owners`)
- Keep "Browse Properties" as the secondary/outline button
- Update the subheading label from "Luxury Vacation Rentals" to "Vacation Rental Management"

### 2. Value Proposition Section -- Reframe for Owners
**File:** `src/pages/Index.tsx`

Rewrite the 3-card value proposition section to speak to property owners instead of guests:
- **"Maximize Revenue"** -- Dynamic pricing and multi-platform marketing that outperforms market averages
- **"Hands-Off Management"** -- Full-service operations from guest communication to maintenance
- **"Local Expertise"** -- Deep Flagstaff knowledge and a curated luxury brand that attracts premium guests

### 3. Move Owner CTA Section Higher
**File:** `src/pages/Index.tsx`

- Move the "Maximize Your Property's Potential" dark CTA section (currently last) to appear right after the value proposition, before the featured properties
- This makes the owner pitch more prominent and positions properties as social proof ("look at what we manage")

### 4. Add Owner Testimonials
**File:** `src/pages/Index.tsx`

Replace or supplement the guest testimonials with owner testimonials that speak to the management experience:
- Revenue increases after partnering
- Ease of hands-off management
- Quality of communication and reporting

### 5. Header CTA Button -- Owner Focus
**File:** `src/components/layout/Header.tsx`

- Change the header CTA button from **"View Properties"** to **"List Your Property"** linking to `/owners`
- Change the mobile menu CTA to match

### 6. Footer -- Add Owner-Focused Quick Link Prominence
**File:** `src/components/layout/Footer.tsx`

- Update the brand description from guest-focused copy to include property management messaging
- Move "Property Owners" link higher in the Quick Links section

### 7. Grand Canyon Section -- Reframe as Market Proof
**File:** `src/pages/Index.tsx`

Reframe the Grand Canyon CTA section to serve as a market demand argument for owners: **"A Market That Sells Itself"** -- Flagstaff's proximity to the Grand Canyon drives year-round demand, making it an ideal vacation rental market.

---

## Files to Change

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Hero copy, value props, section reordering, testimonials, Grand Canyon reframe |
| `src/components/layout/Header.tsx` | CTA button text and link |
| `src/components/layout/Footer.tsx` | Brand description copy |

## What Stays the Same
- The Owners page (`/owners`) -- already well-built with benefits, pricing, services, and inquiry form
- Properties page and property detail pages -- these serve as portfolio/social proof
- Experiences/Area Guide page -- supports the market demand narrative
- About page with contact form -- unchanged
- All admin functionality -- unchanged
- All backend/database functionality -- unchanged

