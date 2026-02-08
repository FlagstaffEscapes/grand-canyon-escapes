
# Implementation Plan: Scroll-to-Top & Pre-Delivery Review

## Primary Fix: Scroll-to-Top on Navigation

### The Issue
When users click navigation links, the page changes but the scroll position remains where it was on the previous page. This creates a jarring experience - users land in the middle of the new page instead of at the top.

### Solution
Create a `ScrollToTop` component that listens for route changes and scrolls to the top of the page. This is a common React Router pattern.

**New file:** `src/components/layout/ScrollToTop.tsx`
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
```

**Update:** `src/App.tsx`
- Import and add `<ScrollToTop />` inside the `<BrowserRouter>` wrapper

---

## Additional Issues Identified

### 1. Missing Social Media Links (Minor)
**Issue:** Footer social media icons point to "#" placeholder links.
**Location:** `src/components/layout/Footer.tsx` (lines 16-37)
**Recommendation:** Either remove the social icons or have the client provide actual URLs before delivery.

### 2. Missing Privacy Policy & Terms Links (Minor)
**Issue:** Footer links for "Privacy Policy" and "Terms of Service" point to "#".
**Location:** `src/components/layout/Footer.tsx` (lines 114-115)
**Recommendation:** These pages need to be created or the links should be removed for launch.

### 3. Check Availability Button Non-Functional (Moderate)
**Issue:** The "Check Availability" button on property detail pages doesn't do anything.
**Location:** `src/pages/PropertyDetail.tsx` (line 282)
**Recommendation:** Either:
- Link to an external booking system (Airbnb, VRBO, etc.)
- Implement a booking inquiry form
- Change to "Contact Us" and link to the About page

### 4. TODO Comments in index.html (Minor)
**Issue:** There are TODO comments in the HTML head.
**Location:** `index.html` (lines 7, 12)
**Recommendation:** Remove the TODO comments before delivery.

### 5. Sticky Filter Bar Z-Index (Minor UX)
**Issue:** The filter bar on the Properties page uses `z-40` which may cause it to appear over the header on some edge cases.
**Location:** `src/pages/Properties.tsx` (line 75)
**Recommendation:** Ensure the header z-index (`z-50`) is properly layered above filters.

### 6. Email Domain Consistency
**Issue:** Two different email domains are used:
- `info@flagstaffescapes.com` (Footer, About page)
- `owners@flagstaffescapes.com` (Owners page)
**Recommendation:** Verify with client that both email addresses are set up and working.

---

## Files to Change

| File | Change |
|------|--------|
| `src/components/layout/ScrollToTop.tsx` | **Create** - New scroll-to-top component |
| `src/App.tsx` | **Modify** - Add ScrollToTop component inside BrowserRouter |
| `index.html` | **Modify** - Remove TODO comments |

---

## Implementation Details

### Step 1: Create ScrollToTop Component
A simple, lightweight component that hooks into React Router's location changes.

### Step 2: Update App.tsx
Add the component after the BrowserRouter opening tag but before Routes:

```tsx
<BrowserRouter>
  <ScrollToTop />
  <Routes>
    ...
  </Routes>
</BrowserRouter>
```

### Step 3: Clean Up index.html
Remove the two TODO comment lines to present a polished codebase.

---

## Summary Before Delivery

**Critical (blocking):** None - the site is functional

**Recommended fixes:**
1. Scroll-to-top on navigation (implementing now)
2. Remove TODO comments from index.html (implementing now)

**Client decisions needed:**
- Social media URLs
- Privacy Policy / Terms of Service pages
- Check Availability button behavior
- Confirm both email addresses work

The site is in good shape overall - clean code, consistent design, working forms, and functional admin panel.
