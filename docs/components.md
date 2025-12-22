# Component Library

## c-referral-form

- **Purpose:** Reusable hero + referral capture experience for affiliate landing pages with advanced tracking capabilities.
- **Tokens:** `space-40` (outer padding), `space-24` (inner gap), `type-heading-xl`, `type-body`, `color-accent-1`, `color-bg-soft`, `radius-2xl`, `color-info`, `glass-shadow`.
- **HTML structure:**  
  `section.c-referral-form` > `div.grid` (2-column layout) >  
  - Accents column: text block with `rounded-[2.25rem]`, `border`, `shadow-[0_25px_55px_-35px_rgba(15,23,42,0.45)]`, `backdrop-blur`. Contains headline/subheadline, `ul` of highlights (each `flex gap-3` with a dot icon).  
  - Form column: `div` with `rounded-[2.25rem]`, `border border-[#E0E7FF]`, `bg-white`, `shadow-xl`. Inside `form` with grouped inputs (`div.grid` for name), `input`, `select`, `textarea` styled with `rounded-2xl`, `border`, `focus:ring`, and the `Button` component for submission.
- **Classes:** `bg-gradient-to-b`, `from-[#F5F3FF]`, `rounded-[2.25rem]`, `border`, `px-4`, `py-12`, `shadow-xl`, `text-[#0F172A]`, `text-[#475569]`, `uppercase tracking-[0.4em]`, `focus:ring-[#EDE9FE]`.
- **Role Options (Updated 2025-12-22):**
  - Property Owner
  - Affiliate Marketer
  - Cleaning Service
  - ~~Traveler~~ (removed)
- **Tracking Features (New 2025-12-22):**
  - **Company Source**: Hidden field to track which company/brand the form is for (configurable)
  - **Form Engagement**: Automatically tracks partial vs completed submissions
  - **Time Tracking**: Records start time, completion time, and duration
  - **Abandonment Tracking**: Captures partial submissions when users leave
  - See [Form Tracking System](./form-tracking-system.md) for full documentation
- **Props:**
  - `linkId` (required): Affiliate link ID
  - `headline` (optional): Custom headline text
  - `subheadline` (optional): Custom subheadline text
  - `companySource` (optional): Company/brand identifier for tracking (default: 'EasyStay')
- **Example usage:**
  ```tsx
  import { ReferralForm } from '@/components/referral/ReferralForm';

  export default function ReferralPage() {
    const link = { id: 'abc', headline: 'Custom', subheadline: 'Tailored' };
    return (
      <ReferralForm 
        linkId={link.id} 
        headline={link.headline} 
        subheadline={link.subheadline}
        companySource="EasyStay"
      />
    );
  }
  ```

## c-landing-page-builder

- **Purpose:** Visual landing page builder canvas for affiliates to drag/drop and configure hero, benefits, testimonial, form, and CTA sections before publishing to `/refer/[slug]`.
- **Tokens:** `space-40`, `space-24`, `radius-3xl`, `type-heading-lg`, `color-bg-soft`, `color-border`, `color-accent-1`, `color-text-muted`.
- **HTML structure:**  
  `div.c-landing-page-builder` >  
  - Header summary with page name/slug plus `Button` controls for preview/save/publish.  
  - Component library section (`div.grid`) listing `Hero`, `Benefits`, `Testimonial`, `Referral form`, `Final CTA` cards.  
  - `DndContext` canvas where each `section.card` is presented as a rounded panel with drag handle, removal action, and form inputs tailored to that section type.  
  - Preview modal overlay showing `LandingPreview` components rendering hero, benefits grid, testimonial block, referral `ReferralForm`, and CTA strip using the configured data.
- **Classes:** `rounded-[2.5rem]`, `border`, `px-8`, `py-6`, `bg-white/90`, `shadow-2xl`, `tracking-[0.4em]`, `text-[#0F172A]`, `text-[#475569]`.
- **Recent changes (2025-12-22):**
  - Preview container: removed border-radius (0px), updated to use `var(--secondary)` background
  - Preview container border: updated to `rgba(248, 250, 252, 1)`
  - Preview container text color: updated to `rgba(130, 130, 130, 1)`
  - Benefits section icons: changed color from white to `rgba(47, 54, 61, 1)` for better contrast
  - **Drag & Drop Enhancement:**
    - Added visual feedback during drag (opacity, scale, shadow effects)
    - Larger, more accessible drag handle with hover states
    - DragOverlay for smoother dragging experience
    - 8px activation distance to prevent accidental drags
    - Improved collision detection with `closestCenter`
    - Active dragging state with enhanced visual indicators
  - **Modern Section Redesign:**
    - Hero: Full-width hero with centered content, overlay gradient, modern typography
    - Benefits: Two-column layout with text + image (grid-based, responsive)
    - Testimonial: Full-width hero style with prominent messaging
    - CTA: Full-width hero with property background image
    - Form: Gradient background with improved spacing
    - All sections: Removed heavy borders, added modern shadows, improved spacing
    - Typography: Larger headings (4xl-5xl), better line-height, improved hierarchy
    - Buttons: Modern rounded-md style with green accent color (#5a8f7b)
    - Images: Integrated background images with proper overlays for readability
  - **Full-Screen Desktop App Experience:**
    - Removed centered container wrapper (max-w-[1100px])
    - Preview area now full-width for desktop mode
    - Mobile preview mode centers with max-w-[440px]
    - Removed nested borders and rounded containers
    - Clean, edge-to-edge preview experience
  - **Responsive Design Enhancements:**
    - All sections: Mobile-first responsive classes (sm:, md:, lg:)
    - Typography: Scales from text-2xl → text-6xl across breakpoints
    - Padding: Responsive padding (p-4 → p-16) for all sections
    - Hero sections: Adaptive min-height (350px mobile → 500px desktop)
    - Benefits grid: Stacks vertically on mobile, side-by-side on lg:
    - Buttons: Responsive sizing (px-6 py-3 → px-8 py-4)
    - Images: Next.js Image component with proper optimization
  - **Preview Mode Fix (2025-12-22):**
    - Added `previewMode` prop to `LandingPreview` component
    - Mobile preview now correctly shows vertical layout
    - Desktop preview shows responsive layout with lg: breakpoints
    - Feature section respects preview mode for accurate mobile/desktop rendering
  - **Form Section Enhancements (2025-12-22):**
    - Added configurable "Company Source" field in form inspector
    - Hidden field tracks which company/brand the form is for
    - Enables multi-brand tracking and analytics
    - Default value: "EasyStay"
    - Passed to ReferralForm component for tracking
- **Example usage:**  
  ```tsx
  import { LandingPageBuilder } from '@/components/landing/LandingPageBuilder';

  export default function LandingBuilder({ link }) {
    return (
      <LandingPageBuilder
        link={link}
        initialSections={link.landing_page?.sections ?? []}
        isPublished={link.landing_page?.is_published}
      />
    );
  }
  ```

