# Petal & Verse — a flower shop built with Sanity, Next.js and Stripe

An end-to-end e-commerce site for an independent florist: an editorial "botanical" design, a product catalogue with filters, a cart with delivery date and gift notes, Stripe Checkout, orders written back to Sanity, a journal (blog), and a fully structured Sanity Studio with Visual Editing.

```
flower-shop/
├── frontend/   Next.js 16 (App Router, React 19, Tailwind CSS 4, next-sanity Live)
└── studio/     Sanity Studio v5 (schemas, desk structure, Presentation, seed script)
```

## Features

| Area | What you get |
| --- | --- |
| **Design** | Fraunces + Inter, cream paper palette with forest/blush/terracotta, arch & oval image masks, paper-grain overlay, scroll-driven reveals, rotating badges, marquee, reduced-motion support |
| **Home & pages** | Page builder: Hero, Bloom marquee, Category bento, Featured products, Story block, Testimonials, Journal teaser, Newsletter, CTA, Info section |
| **Shop** | `/shop` with category / occasion / colour / price filters and sorting (all URL-driven), `/category/[slug]`, `/occasion/[slug]`, `/occasions` |
| **Product page** | Gallery with pointer zoom, size variants, quantity, care notes, related products, related journal posts, JSON-LD |
| **Cart** | Slide-out drawer + `/cart`, saved in the browser, free-delivery progress, delivery date, hand-written gift note |
| **Checkout** | `/api/checkout` re-prices every line from Sanity (never trusts the browser) → Stripe Checkout → `/checkout/success` |
| **Orders** | Stripe webhook (`/api/stripe/webhook`) + success page both write an idempotent `order` document to Sanity; manage status in Studio → Orders |
| **Journal** | `/journal` with tag filters, articles with table of contents, drop caps, captioned images and inline "product callouts" that sell from the story |
| **Forms** | Newsletter (→ `subscriber` docs) and contact form (→ `enquiry` docs) via Server Actions |
| **SEO** | Per-document SEO fields, Open Graph images, `sitemap.xml`, `robots.txt`, product structured data |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment variables

`frontend/.env.local` and `studio/.env` already contain your Sanity project ID and read token. Add the rest (see `frontend/.env.example`):

```bash
# frontend/.env.local
SANITY_API_WRITE_TOKEN=...     # Editor token: sanity.io/manage → API → Tokens (or: cd studio && npx sanity tokens add "Website" --role=editor)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

The site runs without these — checkout and the forms will simply show a friendly "not configured" message.

### 3. Seed content (images, products, posts)

```bash
npm run seed
```

Uploads ~37 Unsplash photos and creates 5 categories, 5 occasions, 14 products, 2 authors, 4 journal posts, 4 testimonials, Home/About/Delivery pages and site settings. It is safe to run again — documents use fixed IDs.

### 4. Run

```bash
npm run dev
```

- Website: http://localhost:3000
- Studio: http://localhost:3333 (open **Presentation** for click-to-edit Visual Editing)

## Testing payments locally

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.
2. Add something to your bag and click **Checkout securely**.
3. Pay with card `4242 4242 4242 4242`, any future date, any CVC.
4. You'll land on `/checkout/success`, and a new order appears in **Studio → Orders → Paid**.

> Even without the webhook, the success page records the order, so local tests still create orders.

## Editing content

| In Studio | Shows up at |
| --- | --- |
| Shop → Products / Categories / Occasions | `/shop`, `/shop/[slug]`, `/category/[slug]`, `/occasion/[slug]` |
| Pages → **Home** (slug `home`) | `/` — reorder sections in the page builder |
| Pages → About, Delivery & Care | `/about`, `/delivery` |
| Journal → Posts | `/journal`, `/journal/[slug]` |
| Site Settings | Name, announcement bar, delivery fee & free-delivery threshold, contact details |
| Orders / Inbox | Orders from Stripe, newsletter subscribers, contact enquiries |

Headings in the Hero and Story blocks support `*asterisks*` for the italic accent style, e.g. `Flowers, written in *full bloom*.`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Studio + website with typegen |
| `npm run seed` | Seed the dataset with demo content |
| `npm run type-check` | TypeScript in both workspaces |
| `npm run lint` | ESLint (frontend) |

## Deploying

1. Deploy the Studio: `cd studio && npx sanity deploy`.
2. Deploy `frontend/` to Vercel. Set the environment variables from `.env.example` and add your production URL as a CORS origin in sanity.io/manage.
3. In the Stripe dashboard, add a webhook endpoint `https://your-domain/api/stripe/webhook` for `checkout.session.completed`.

Photography from [Unsplash](https://unsplash.com) (Unsplash License).
