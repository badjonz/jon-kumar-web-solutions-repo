# Story 3.3: WhatsApp Floating Button

Status: done

## Story

As a **visitor**,
I want **to instantly message Jon via WhatsApp with one tap**,
so that **I can start a conversation without filling out a form**.

## Acceptance Criteria

1. A floating WhatsApp button is visible in the bottom-right corner on all viewport sizes
2. The button is positioned 24px from right/bottom edges on desktop, 16px on mobile
3. The button is 56px diameter with WhatsApp green background (#25D366)
4. The button displays a white WhatsApp icon
5. The button has a subtle drop shadow for elevation
6. Clicking opens `wa.me/{WHATSAPP_NUMBER}?text={pre-filled message}` in a new tab
7. Pre-filled message: "Hi Jon, I found your site and I'm interested in a website for my business."
8. On hover, the button scales to 1.05 with 150ms transition
9. The button has `aria-label="Contact via WhatsApp"` for screen readers
10. The button has visible focus indicator (2px orange #f97316 outline, 2px offset) for keyboard users
11. The button has a high z-index to appear above all page content (but below modals if any)
12. The WhatsApp number is read from `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable
13. All animations respect `prefers-reduced-motion` (instant state changes, no scale transition)

## Tasks / Subtasks

- [x] Task 1: Create WhatsAppButton component (AC: #1-#5, #8, #9, #10, #11, #13)
  - [x] 1.1 Create `src/components/WhatsAppButton.tsx` as a client component (`"use client"`)
  - [x] 1.2 Implement 56px circular button with WhatsApp green (#25D366) background
  - [x] 1.3 Add WhatsApp SVG icon in white (inline SVG or lucide-react `MessageCircle` — see Dev Notes for icon guidance)
  - [x] 1.4 Apply fixed positioning: `fixed bottom-6 right-6 lg:bottom-6 lg:right-6` (24px), mobile override `bottom-4 right-4` (16px)
  - [x] 1.5 Add drop shadow: `shadow-lg` or custom `shadow-[0_2px_12px_rgba(0,0,0,0.15)]`
  - [x] 1.6 Set z-index: `z-50` (consistent with floating element pattern)
  - [x] 1.7 Add hover scale: `hover:scale-105 transition-transform duration-150`
  - [x] 1.8 Add `aria-label="Contact via WhatsApp"`
  - [x] 1.9 Add focus-visible: `focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2`
  - [x] 1.10 Use `motion-safe:` Tailwind CSS variants to conditionally disable scale transition
  - [x] 1.11 Ensure minimum 56x56px touch target (exceeds 44px requirement)

- [x] Task 2: Wire WhatsApp deep link with env variable (AC: #6, #7, #12)
  - [x] 2.1 Read `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` for the phone number
  - [x] 2.2 Construct href: `` `https://wa.me/${number}?text=${encodeURIComponent(message)}` ``
  - [x] 2.3 Pre-filled message: "Hi Jon, I found your site and I'm interested in a website for my business."
  - [x] 2.4 Render as `<a>` tag (not `<button>`) with `target="_blank"` and `rel="noopener noreferrer"`
  - [x] 2.5 Add `NEXT_PUBLIC_WHATSAPP_NUMBER` to `.env.example` with comment

- [x] Task 3: Integrate into layout (AC: #1)
  - [x] 3.1 Import and render `<WhatsAppButton />` in `src/app/layout.tsx` inside `<body>` after `<main>` (global visibility)
  - [x] 3.2 Verify button appears on all pages/viewports

- [x] Task 4: Write E2E tests (AC: #1-#13)
  - [x] 4.1 Create `e2e/whatsapp.spec.ts`
  - [x] 4.2 Test button renders and is visible on page load
  - [x] 4.3 Test button has correct aria-label
  - [x] 4.4 Test button href contains `wa.me` and pre-filled message text
  - [x] 4.5 Test button has `target="_blank"` and `rel="noopener noreferrer"`
  - [x] 4.6 Test button size is >= 56x56px (touch target)
  - [x] 4.7 Test button focus-visible styling (keyboard navigation)
  - [x] 4.8 Test desktop positioning (24px from edges)
  - [x] 4.9 Test mobile positioning (16px from edges) with mobile viewport
  - [x] 4.10 Test reduced motion: verify no scale transition when `prefers-reduced-motion: reduce`
  - [x] 4.11 Test button z-index is above page content
  - [x] 4.12 Ensure all existing tests still pass (no regressions)

## Dev Notes

### Component Architecture
- **File:** `src/components/WhatsAppButton.tsx` — standalone client component, no props needed
- **Placement:** Rendered in `layout.tsx` (NOT in `page.tsx`) so it appears globally on all pages
- **Pattern:** Follow the same `"use client"` + `useReducedMotion()` pattern used in HeroSection, ServicesSection, and AboutSection
- **Export:** Use `export const WhatsAppButton = () => {...}` (named export, consistent with all other components)

### WhatsApp Icon
- **Option A (Preferred):** Inline SVG of the official WhatsApp icon — this is a brand icon that lucide-react does not include
- **Option B:** Use a generic `MessageCircle` from lucide-react if brand accuracy is not critical
- The icon should be white (`fill="white"` or `className="text-white fill-white"`) and sized ~28px within the 56px button

### Environment Variable
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — must be added to `.env.example` with documentation
- Format: international format without `+` (e.g., `15551234567`)
- This is a public variable (safe for client-side, prefixed with `NEXT_PUBLIC_`)

### Styling Patterns (match existing codebase)
- **Orange focus ring:** `focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2` — matches Header, ContactForm, and all interactive elements
- **Touch target:** 56px diameter exceeds the 44px minimum enforced across the project
- **Transition:** `transition-transform duration-150` matches the 150ms button hover spec from UX design
- **Fixed positioning:** Use Tailwind responsive classes: `fixed bottom-4 right-4 md:bottom-6 md:right-6`
- **Shadow:** `shadow-lg` for elevation (consistent with card hover states)

### Accessibility Requirements
- `aria-label="Contact via WhatsApp"` (per UX spec)
- Must be keyboard-focusable (native `<a>` handles this)
- Focus indicator: 2px orange outline with 2px offset (matches global focus pattern)
- Last in tab order (positioned after all page content in DOM, rendered in layout.tsx after `<main>`)
- `prefers-reduced-motion`: Use `useReducedMotion()` hook — when true, remove scale transition

### Reduced Motion Implementation
```typescript
const shouldReduceMotion = useReducedMotion();
// Apply transition classes conditionally:
// shouldReduceMotion ? '' : 'hover:scale-105 transition-transform duration-150'
```

### Link vs Button
- Use `<a>` tag, NOT `<button>` — this navigates to an external URL (wa.me)
- Must include `target="_blank"` and `rel="noopener noreferrer"` for external link security
- The `<a>` tag is natively keyboard-focusable (no tabIndex needed)

### Project Structure Notes

- Component goes in `src/components/WhatsAppButton.tsx` (root of components, NOT in `ui/` which is shadcn territory)
- Environment variable added to `.env.example` (already has RESEND variables as precedent)
- Test file: `e2e/whatsapp.spec.ts` (follows existing naming: `e2e/contact.spec.ts`, `e2e/header.spec.ts`, etc.)
- No changes needed to `lib/constants.ts` — the env var is read directly in the component (simple enough, no abstraction needed)

### Testing Patterns (match existing E2E tests)
- Use `test.beforeEach(async ({ page }) => { await page.goto("/"); })` pattern
- Use `getByRole("link", { name: "Contact via WhatsApp" })` for accessible element selection
- Test touch target with `boundingBox()` — verify width/height >= 56
- Test positioning with `boundingBox()` — verify bottom/right offsets
- Mock viewport with `page.setViewportSize()` for mobile tests (matches header.spec.ts pattern)
- Test reduced motion with `page.emulateMedia({ reducedMotion: "reduce" })`
- Run full suite after: `npx playwright test` — currently 159 tests pass, ensure 0 regressions

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3] — acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Organization] — WhatsAppButton.tsx in components root
- [Source: _bmad-output/planning-artifacts/architecture.md#Environment Variables] — NEXT_PUBLIC_WHATSAPP_NUMBER
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] — wa.me deep link pattern
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#WhatsApp Float Button] — 56px, #25D366, fixed position specs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Button States] — hover/focus/active states
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Animation Patterns] — 150ms hover scale
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Patterns] — 24px desktop / 16px mobile offsets
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ARIA Usage] — aria-label specification
- [Source: _bmad-output/implementation-artifacts/3-1-contact-section-with-form-ui.md] — Playwright .blur() workaround, touch target testing pattern
- [Source: _bmad-output/implementation-artifacts/3-2-contact-form-api-email-notification.md] — env var patterns, .env.example format
- [Source: src/components/HeroSection.tsx] — useReducedMotion() pattern, client component structure
- [Source: src/app/layout.tsx] — component placement pattern (Header imported here)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Initial reduced motion test failure: `useReducedMotion()` from framer-motion (JS hook) did not respond to Playwright's `page.emulateMedia({ reducedMotion: "reduce" })` during SSR/hydration. Switched to Tailwind CSS `motion-safe:` variants (purely CSS `@media (prefers-reduced-motion)`) which reliably respond to Playwright media emulation. This is a simpler, more robust approach.

### Completion Notes List

- Created `WhatsAppButton.tsx` with official WhatsApp SVG icon, 56px circular button, #25D366 green background, fixed positioning (16px mobile / 24px desktop), z-50, shadow-lg, hover:scale-105 with 150ms transition (motion-safe only), aria-label, focus-visible orange outline
- Used Tailwind `motion-safe:` CSS variants instead of framer-motion `useReducedMotion()` JS hook for more reliable reduced-motion support in both production and test environments
- Integrated component in `layout.tsx` after `<main>` for global visibility across all pages
- Added `NEXT_PUBLIC_WHATSAPP_NUMBER` to `.env.example` with documentation
- Created 10 comprehensive E2E tests in `e2e/whatsapp.spec.ts` covering all 13 acceptance criteria
- Full regression suite: 179 passed, 1 skipped (pre-existing), 0 failed (180 total tests)

### Change Log

- 2026-02-10: Implemented Story 3.3 — WhatsApp floating button with full E2E test coverage

### File List

- `src/components/WhatsAppButton.tsx` (new) — WhatsApp floating button component
- `src/app/layout.tsx` (modified) — Added WhatsAppButton import and render after `<main>`
- `.env.example` (modified) — Added `NEXT_PUBLIC_WHATSAPP_NUMBER` variable
- `e2e/whatsapp.spec.ts` (new) — 10 E2E tests covering all acceptance criteria
