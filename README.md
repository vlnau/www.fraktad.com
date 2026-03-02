# Fraktad.com (11ty + Nunjucks + Tailwind + TypeScript)

## Quick start

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

## Key scripts

- `npm run dev` - data validation + CSS/TS watch + 11ty dev server
- `npm run build` - clean + validate + build CSS + typecheck + bundle TS + 11ty
- `npm run validate:data` - schema-like checks for `_data` files
- `npm run format` / `npm run format:check` - Prettier formatting

## Contact form backend (Cloudflare Pages)

This project includes a Pages Function endpoint at `POST /api/contact`:

- file: `functions/api/contact.ts`
- accepts JSON form payload from frontend forms
- supports honeypot anti-spam field (`website`)
- optionally verifies Cloudflare Turnstile token
- sends valid leads to your inbox via Resend API

Set these environment variables in Cloudflare Pages:

- `RESEND_API_KEY` (required): Resend API key
- `CONTACT_TO_EMAIL` (required): destination inbox for incoming leads
- `CONTACT_FROM_EMAIL` (required): verified sender in Resend
- `TURNSTILE_SECRET` (optional): enables server-side captcha validation
- `TURNSTILE_SITE_KEY` (optional, build variable): renders captcha widgets in forms

## Project structure

```text
src/
  _data/
    site.js              # global site/contact/navigation config
    services.js          # service pages content
    serviceCards.js      # cards for home services section
    portfolioCards.js    # home portfolio cards
    reviews.js           # review slides
    homeHero.js          # home hero content/actions
    homeSections.js      # home sections content (services/process/reviews/blog/faq/contact)
  _includes/
    layouts/
      base.html
      blog-post.html
    macros/
      ui.njk             # reusable Nunjucks macros
    components/
      home-*.html        # isolated home sections
      site-header.html
      site-footer.html
      head.html
  assets/
    css/
      input.css          # Tailwind source
      styles.css         # generated CSS
    ts/
      core/              # module runtime and state
      modules/           # feature modules
      main.ts            # module bootstrap
scripts/
  validate-data.mjs      # data integrity checks used in dev/build
```

## Content model rules

- Do not hardcode marketing copy in section templates; keep copy in `src/_data/*.js`.
- Prefer loops and macros over repeated markup.
- Keep global labels/contacts/navigation in `src/_data/site.js`.
- Any new major data object should be covered by `scripts/validate-data.mjs`.

## Frontend architecture

- `src/assets/ts/main.ts` registers UI modules.
- `core/module-runner.ts` initializes modules safely.
- Each module in `assets/ts/modules` owns one concern (carousel, modal, nav, etc.).
- Swiper JS is lazy-loaded from local bundle chunk.

## Assets and vendors

- Fonts are self-hosted from `@fontsource` and copied via `eleventy.config.js`.
- Font Awesome and Swiper CSS are self-hosted via passthrough copy.
- Images use `@11ty/eleventy-img` shortcode (`{% image ... %}`) for optimized output.

## Adding a new service page

1. Add a new entry in `src/_data/services.js` (unique `slug` required).
2. Ensure required fields exist (`seo`, `hero`, `outcomes`, `included`, `process`, `faq`, `cta`).
3. Run `npm run validate:data`.
4. Build and verify generated page at `/<slug>/`.
