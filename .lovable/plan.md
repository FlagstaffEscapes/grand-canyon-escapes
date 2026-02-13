

# Update Property Images to Authentic Flagstaff Aesthetic

## What's Changing
Replace all 18 property card images with Unsplash photos depicting mountain cabins, log homes, pine forest settings, and rustic-luxury properties -- the kind of homes you'd actually find in Flagstaff, AZ.

Your admin portal image management will continue to work exactly as before. These are just URL updates in the database -- you can still add, remove, reorder, or replace any image through the admin property editor at any time.

## New Image Selections

| Property | Primary Image | Secondary Images |
|----------|--------------|-----------------|
| **Ponderosa Retreat** | Log cabin nestled in tall pines | Rustic wood-beam interior; Deck overlooking pine forest |
| **Alpine Lodge** | Large timber-frame mountain lodge | Vaulted wood-ceiling great room; Mountain view from wraparound deck |
| **Canyon Vista** | A-frame cabin with scenic views | Warm wood-paneled bedroom; Sunset deck with canyon backdrop |
| **Timber Haven** | Wood-clad home surrounded by forest | Stone fireplace living room; Meadow/trail view from porch |
| **Stargazer Cabin** | Cozy cabin at twilight/dusk | Warm lantern-lit interior; Night sky observation deck |
| **Mountain Majesty** | Grand mountain estate with stone and timber | Luxurious open-concept living; Panoramic mountain vista |

## Technical Details

- **Database-only change**: 18 `UPDATE` statements on the `property_images` table replacing `image_url` and `alt_text` values
- **No code changes needed** -- the `PropertyCard` component and property detail page already render whatever URLs are in the database
- All new URLs use Unsplash's `?w=1200` parameter for consistent high-quality sizing
- Image IDs and property associations remain unchanged

