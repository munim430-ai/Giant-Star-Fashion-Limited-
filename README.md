# Giant-Star-Fashion-Limited-

Saem bhai er sosurer website

B2B website for **Giant Star Fashion Limited**, a 100% export-oriented sweater manufacturer in Ashulia, Dhaka, Bangladesh. The site is built for international brands, sourcing directors and buying houses.

## Stack

- **Next.js 15** (App Router, TypeScript, strict mode). The homepage is statically generated and `/api/rfq` runs as a serverless function.
- **Tailwind CSS 3** with brand tokens sampled from the GSFL logo, plus CVA, `clsx` and `tailwind-merge`.
- **Framer Motion** for scroll reveals, counters, tab indicators, accordions and the modal. It respects `prefers-reduced-motion`.
- **Lucide React** icons. Fonts are Outfit, Inter and JetBrains Mono, loaded with `next/font`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-checks and lints)
npm run lint
npm run typecheck
npm run format     # Prettier
```

## Project structure

```
src/
  app/
    layout.tsx          fonts, metadata, Open Graph, icons
    page.tsx            section order and Organization JSON-LD
    api/rfq/route.ts    RFQ endpoint: validation, honeypot, optional email delivery
    robots.ts  sitemap.ts  manifest.ts  not-found.tsx
  components/
    Navbar.tsx          contact strip, sticky nav, scroll-spy, mobile menu
    Hero.tsx            headline, trust badges, CTAs, animated jacquard chart
    Metrics.tsx         animated production counters
    About.tsx           corporate profile
    MachineryTable.tsx  searchable, tabbed machinery inventory and gauge mix
    FactoryTour.tsx     interactive facility grid
    Capacity.tsx        capacity tiers and order-capacity estimator
    ProcessFlow.tsx     17-stage production flow
    ProductGrid.tsx     filterable styles, opens InquiryModal
    Compliance.tsx      policy cards and credentials
    ClientMarquee.tsx   buyer roster reel (pausable, static when motion is reduced)
    ContactSection.tsx  RFQ form, location guide, leadership, banking drawer
    Footer.tsx
    ui/                 Button, Field, Logo, DotMatrixMark, KnitSwatch, Counter…
  data/factoryData.ts   every company fact, figure, contact and product
  lib/                  cn(), number formatting, RFQ validation and submit hook
public/                 logo.png, logo-transparent.png, favicon.ico, icons, og-image.png
```

**To update content, edit `src/data/factoryData.ts`.** Machine counts, capacity, contacts, bank details, products and facility areas are all stored there.

### Adding real photography

Products and facility areas accept an optional `image` field. Set it to a file in `/public` (for example `"/products/aran-crew.jpg"`) or to a URL on an allowed host (configured in `next.config.mjs`). The image then replaces the illustrated knit swatch or the placeholder panel.

## RFQ delivery

The RFQ form and the style-inquiry modal post to `/api/rfq`. The same validation runs in the browser and on the server.

- **With email configured:** set `RESEND_API_KEY`, `RFQ_FROM_EMAIL` (a sender on a domain verified in Resend) and optionally `RFQ_TO_EMAIL`. Each inquiry is then emailed with its tech pack attached and `reply-to` set to the buyer.
- **Without it:** the submission is still validated and given a reference number. The buyer is then offered a pre-filled email to `info@giantstarbd.com`, so no inquiry is lost.

See `.env.example`. Tech packs are limited to 4 MB, which is under Vercel's request-body limit.

## Deploying to Vercel

Import the repository in Vercel. No configuration is needed: `vercel.json` sets the framework, the build commands, security headers and asset caching. Optionally, set `NEXT_PUBLIC_SITE_URL` to the production domain for canonical URLs and the sitemap. Without it, the Vercel production URL is used.
