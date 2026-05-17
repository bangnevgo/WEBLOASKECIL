# Task: Create Pricing Component for Neville Goddard Curriculum Website

## Summary
Created a complete pricing component (`/home/z/my-project/src/components/pricing.tsx`) with all requested features, plus integrated the full application with view switching.

## Files Created/Modified

### Created
- **`/home/z/my-project/src/components/pricing.tsx`** - Main pricing component with:
  - Three pricing tiers: Penggemar (Free), Pelajar ($9/mo, featured), Master ($27/mo)
  - framer-motion card entrance animations with staggered delays
  - "POPULER" badge on featured Pelajar tier with gold border
  - Name input modal dialog before subscribing
  - Calls `subscribe(name)` from zustand store on confirmation
  - Responsive grid layout (3 columns desktop, 1 column mobile)
  - Dark theme with gold accents
  - All nv- prefixed CSS classes as specified

- **`/home/z/my-project/src/components/dashboard.tsx`** - Dashboard view component
- **`/home/z/my-project/src/components/lesson-detail.tsx`** - Lesson detail view component

### Modified
- **`/home/z/my-project/src/app/globals.css`** - Added comprehensive CSS for:
  - All nv- prefixed classes (nv-page, nv-container, nv-glass, etc.)
  - Full pricing page styles (nv-pricing-page, nv-pricing-grid, nv-pricing-card, etc.)
  - Modal styles (nv-modal-overlay, nv-modal-content, etc.)
  - Dashboard styles, lesson detail styles, landing page styles
  - Custom scrollbar, dark theme variables

- **`/home/z/my-project/src/app/page.tsx`** - Updated to render views based on zustand store:
  - 'landing' → Landing component
  - 'pricing' → Pricing component
  - 'dashboard' → Dashboard component
  - 'lesson' → LessonDetail component
  - Dark mode enforcement
  - Scroll-to-top on view change

- **`/home/z/my-project/src/app/layout.tsx`** - Added dark class to html element, updated metadata

## Key Implementation Details
- Store `subscribe(name)` sets `isSubscribed: true`, `userName: name`, and `view: 'dashboard'`
- Name defaults to "Pengguna" if input is empty
- Modal uses AnimatePresence for smooth enter/exit
- All three CTA buttons trigger the same subscribe flow
- Lint passed with zero errors
- Dev server compiling successfully
