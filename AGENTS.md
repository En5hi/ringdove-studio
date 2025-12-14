# AGENTS.md — Codex Project Instructions (Next.js Agency Site)

You are acting as a senior frontend engineer pairing with a designer. Priorities: ship a polished, performant site fast; keep code simple, readable, and easy to iterate on.

## Product intent
Build a modern, dark, designer-led agency website with:
- A full-viewport HERO featuring a dynamic reactive **2D** background (Canvas 2D; no 3D).
- Hero content: centered logo + slogan beneath; one small text block in a bottom corner.
- On scroll: a bottom **content panel slides up** and takes over; hero content fades out as panel becomes primary.
- Inside the panel: an unconventional **left-side navigation** that scrolls to one-page sections and highlights active section.

Sections (placeholder copy OK):
- About
- Projects
- Experiments
- Contact

## Tech stack (use these)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (scroll-driven panel + microinteractions)
- zod (validation)
- Resend (email sending)
- Vercel geolocation helper for default locale (see i18n section)

Avoid extra dependencies unless they clearly reduce effort.

## i18n requirements (EN default + PL)
Routing:
- English at `/`
- Polish at `/pl`

Default language selection:
- If visitor is in **Poland**, default to `/pl`
- Otherwise default to `/`

User override:
- Provide a language switch in the top UI (within panel navigation area).
- Persist preference via cookie so user choice beats geolocation and avoids repeated redirects.

Implementation notes:
- Use `middleware.ts` to handle redirects.
- Use Vercel geolocation helper (do NOT rely on deprecated/removed NextRequest.geo).
- Local dev fallback: if geolocation isn’t available, infer from `Accept-Language`.
- Ensure middleware does not redirect `/pl` to `/` or cause loops.

## Hero background (Canvas 2D)
Goal: a MONOPO-like vibe (generative gradients / lens-like cursor influence), but keep it tasteful and performant.

Requirements:
- Canvas fills hero, behind content, responsive to resize.
- React to pointer movement (subtle distortion/brightness/field effect around cursor).
- Use `requestAnimationFrame` loop; throttle pointer events.
- Respect `prefers-reduced-motion`:
  - Reduce animation intensity or pause heavy effects.
- Pause or reduce work when tab is hidden (optional but encouraged).

Keep background code isolated in:
- `components/hero/ReactiveBackgroundCanvas.tsx` (client component)
or `lib/background/*` if you prefer.

## Sliding panel + navigation behavior
- Hero occupies 100vh.
- Panel starts off-screen at bottom and translates up based on scroll.
- Once panel is “up”, it becomes the main content surface.
- Left nav inside panel:
  - Desktop: fixed left column
  - Mobile: collapses into top bar menu / compact nav
- Use IntersectionObserver for scroll-spy active section.
- Smooth scroll to sections on nav click.
- Optionally update URL hash.

Use Framer Motion for:
- Panel slide-up and hero fade-out
- Subtle section reveals and hover microinteractions

Always support `prefers-reduced-motion` (disable or simplify scroll-parallax/reveals).

## Contact form (email sending)
Implement a working form in the Contact section:
- Use Next.js **Server Actions** (preferred) for submission.
- Use `zod` validation on the server (client optional).
- Env vars:
  - `RESEND_API_KEY`
  - `CONTACT_TO_EMAIL`
- Anti-spam:
  - Honeypot field
  - Minimum time-to-submit check
- UX states:
  - loading
  - success
  - error with clear messages
- Accessible labels, keyboard-friendly, reasonable contrast.

Put logic in:
- `lib/email/sendContactEmail.ts` (server action helper)

Provide `.env.example`.

## Experiments + optional Dribbble stub
Ship now with local experiments list:
- title, description, tags, link, image (placeholder allowed)

Optionally include a Dribbble adapter stub:
- If `DRIBBBLE_TOKEN` exists: fetch latest shots server-side via a route handler or server utility.
- If missing: fall back to local list.
- Cache results to avoid rate-limit issues.

This must not block launch.

## Repository structure (target)
- `app/` routes/layout
  - `page.tsx` (EN)
  - `pl/page.tsx` (PL)
- `components/`
  - `hero/`, `panel/`, `nav/`, `sections/`, `ui/`
- `content/` (typed dictionaries)
  - `en.ts`, `pl.ts`
- `lib/` (helpers: i18n, geo, email, experiments, dribbble)
- `middleware.ts` at root
- `public/` assets

## Code style & quality bar
- Small composable components; clear names.
- Minimal “magic”; add comments where behavior isn’t obvious (especially canvas math).
- Avoid layout shift; keep performance in mind.
- Ensure `npm run build` passes.
- Keep README current:
  - dev commands
  - env vars
  - deployment steps (Vercel)
  - how to test contact form

## Definition of Done (for initial ship)
- Home page works in EN and PL.
- Middleware: Poland -> `/pl`, others -> `/`, user cookie override works, no loops.
- Hero canvas renders and reacts to pointer smoothly.
- Sliding panel behavior works; nav scroll-spy highlights correctly.
- Contact form sends mail via Resend with success/error UX.
- Mobile layout is usable.
- Basic accessibility: keyboard nav, focus states, reduced motion support.
- Deployed successfully on Vercel with env vars documented.
