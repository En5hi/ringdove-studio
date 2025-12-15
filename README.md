# Ringdove Studio

Dark, designer-led agency site built with Next.js (App Router), TypeScript, Tailwind, and Framer Motion. Features a reactive canvas hero, sliding content panel with left-side navigation, EN/PL i18n with geo-based default, and a Resend-powered contact form.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

- `npm run dev` — start dev server
- `npm run prepare:unicorn` — strip non-effect layers from the Unicorn export into `public/unicorn/flow_gradient.bg.json`
- `npm run build` — prepare Unicorn assets then run the production build
- `npm run start` — run built app
- `npm run lint` — lint

## Environment Variables

Create `.env.local` (see `.env.example`):

- `RESEND_API_KEY` — Resend API key
- `CONTACT_TO_EMAIL` — destination inbox for the contact form
- `DRIBBBLE_TOKEN` — optional, fetches latest Dribbble shots server-side
- `NEXT_PUBLIC_SITE_URL` — base URL (optional for metadata)
- `NEXT_PUBLIC_BG_MODE` — `webgl` (default) or `unicorn` to switch hero background
- `NEXT_PUBLIC_UNICORN_BG_VERSION` — optional version string appended to the Unicorn JSON for cache busting

## Contact Form (Server Action)

- Uses `lib/email/sendContactEmail.ts` with zod validation, honeypot, and minimum submit time.
- Renders via `Contact` section; server action handles sending via Resend.
- To test locally, add `RESEND_API_KEY` and `CONTACT_TO_EMAIL`, then submit the form. Errors surface inline.

## i18n & Geolocation

- Default EN at `/`, PL at `/pl`.
- `middleware.ts` uses `@vercel/functions` geolocation; visitors from Poland go to `/pl` unless they set a language cookie via the UI switch.
- Accept-Language is a fallback for local dev when geolocation isn't available.

## Deploying to Vercel

1. Connect the repo in Vercel.
2. Add environment variables (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `DRIBBBLE_TOKEN`).
3. Deploy. Middleware will respect Vercel's edge geolocation automatically.

## Structure

- `app/` — App Router pages (`page.tsx`, `pl/page.tsx`), layout, globals.
- `components/` — hero, panel, nav, sections, and UI primitives.
- `content/` — EN/PL typed copy dictionaries.
- `lib/` — i18n helpers, geo helpers, experiments data, email action, Dribbble stub.
- `middleware.ts` — locale routing + cookie preference.
