

# Update Owners Page, Homepage Typography, and Verify Header CTA

## 1. Homepage Typography Fix
**File:** `src/pages/Index.tsx`

Adjust the hero heading hierarchy so "Flagstaff Escapes" is the dominant brand name and "Premier Rental Management" is smaller:
- Change the hero structure so "Flagstaff Escapes" is the large text (keep the `text-5xl md:text-7xl lg:text-8xl` sizing)
- Move "Premier Rental Management" to a smaller subtitle line below it (e.g., `text-2xl md:text-3xl`)

## 2. Owners Page Enhancements
**File:** `src/pages/Owners.tsx`

### a. Hero -- Align with homepage messaging
- Update the hero subheading label to "Flagstaff Escapes" prominently
- Refine the headline and subtitle to reinforce the owner-first pitch with messaging that mirrors the homepage

### b. Expanded Commission Section
Add more compelling detail to the 25% commission area:
- Add a breakdown of what's included (3-4 bullet points inside the commission card)
- Add a comparison line like "You keep 75% -- we earn our share by maximizing yours"
- Add a "No startup fees, no contracts" reassurance line

### c. Add "How It Works" Process Section
Insert a new section between Benefits and Commission with 3 simple steps:
1. **Schedule a Consultation** -- We evaluate your property and discuss your goals
2. **We Handle Setup** -- Professional photography, listing creation, and pricing strategy
3. **Start Earning** -- Sit back while we manage everything and maximize your returns

### d. Add Owner Testimonials
Add a testimonials section (reuse the same ones from the homepage) between the Commission section and the Services/Form section for reinforcement on this page.

## 3. Property Images -- Flagstaff Locations
The current hero image on the Owners page (`property-exterior-1.jpg`) is a bundled asset. Since we cannot verify if it depicts Flagstaff, we will replace the Owners page hero with the existing `hero-home.jpg` (the main site hero image showing a mountain cabin), which better represents the Flagstaff aesthetic. This is a quick improvement using existing assets.

## 4. Verify Header CTA
The Header already correctly has "List Your Property" linking to `/owners` on both desktop and mobile. No changes needed -- this is confirmed working.

---

## Technical Details

### Files to modify:
| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Hero heading hierarchy -- make "Flagstaff Escapes" big, "Premier Rental Management" smaller |
| `src/pages/Owners.tsx` | Enhanced commission section, new "How It Works" steps, owner testimonials, swap hero image to `hero-home.jpg` |

### No new dependencies needed.
