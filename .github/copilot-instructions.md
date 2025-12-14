# Copilot Instructions — Ringdove Studio (Next.js)

You are assisting on a Next.js (App Router) + TypeScript + Tailwind project for a designer-led agency site.

## Product intent
- Dark, modern agency website.
- Hero: full-viewport reactive **2D** canvas background (no 3D).
- On scroll: bottom panel slides up to take over; hero fades.
- Panel: left-side navigation with scroll spy and smooth scroll.
- Languages: EN at `/`, PL at `/pl`; Poland defaults to `/pl`; language switch in nav persists via cookie.
- Contact form: Server Action + Resend email sending.

## Tech choices
- Next.js App Router, TypeScript
- Tailwind CSS
- Framer Motion for motion + scroll-driven panel
- zod for validation
- Resend for email
- `@vercel/functions` geolocation in middleware (do **not** use `NextRequest.geo`)

## Code style
- Small, composable components; functional-first.
- Tailwind for styling; minimal custom CSS except for canvas layering.
- Add brief comments only where behavior isn’t obvious (canvas math/loop).
- Honor `prefers-reduced-motion`.
- Avoid heavy dependencies unless clearly useful.

## Structure
- `app/` for routes/layouts
- `components/` for hero, panel, nav, sections, UI
- `content/` for EN/PL typed dictionaries
- `lib/` for i18n helpers, geo helpers, email, experiments, dribbble stub
- `middleware.ts` at root

## Accessibility & UX
- Keyboard-friendly nav + language switch.
- Contact form: loading, success, clear error states.
- Reduced motion: simplify scroll/hover effects.
- Canvas: requestAnimationFrame, pointer throttling, pause/reduce when tab hidden if possible.

## Definition of done
- EN `/` and PL `/pl` both work.
- Middleware redirects Poland to `/pl` unless cookie override; no loops.
- Canvas hero renders smoothly.
- Sliding panel + nav scroll-spy works on desktop/mobile.
- Contact form sends via Resend with validation + spam mitigation.
- README and `.env.example` updated; `npm run build` clean.
