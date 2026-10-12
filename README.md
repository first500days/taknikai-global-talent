# TaknikAI website

One site, two related offerings:

| URL | What | Source |
| --- | --- | --- |
| `/` | Global Talent Digital Technology Programme (homepage) | React app (`src/`) |
| `/upskill/` | Courses — the original taknikai.com homepage | original site (static) |
| `/success-stories/` | Learner success stories (kept, but no longer linked from the header or footer) | original site (static) |
| `/about-us/` | About Us | original site (static) |
| `/blogs/` | All articles: original posts + Global Talent articles | original site (static) |
| `/<post-slug>/` | Blog posts (original URLs preserved; 5 Global Talent posts added) | original site / generated |
| `/privacy-policy/`, `/terms-condiiton/` | Legal pages (original URLs) | original site (static) |

```bash
npm install
npm run dev       # builds the static pages, then serves everything at http://localhost:5173
npm run build     # static pages + type-check + production build → dist/
npm run preview   # serve dist/ (use trailing-slash URLs, e.g. /about-us/)
```

Requires Node 22.18+ (the build scripts import `.ts` files directly).

## Deploying (Vercel)

`vercel.json` already holds the settings, so the project needs no overrides in the Vercel dashboard:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `./` (repository root) |
| Install command | `npm install` (default) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 22.x or later (taken from `engines` in `package.json`) |

No environment variables are needed: the site is fully static, and the only third-party services (Tally forms,
Razorpay payment link, WhatsApp links) are plain public URLs.

The Tally form's "Redirect on completion" points to `https://taknikai.com/thank-you/`. On any other domain (localhost,
Vercel preview URLs) a small script added by `scripts/build-site.mjs` keeps the visitor on the same site.

`.gitignore` patterns are anchored to the root (`/dist`, not `dist`) because `legacy/` contains WordPress asset
folders named `dist` that the pages load.

## How it fits together

- `legacy/taknikai_com/` — an **untouched** static export of the original WordPress/Elementor site. Never edit it.
- `legacy/supplement/` — Elementor lazy-loaded chunks the export missed, fetched from the live site
  (`npm run fetch:elementor`).
- `scripts/build-site.mjs` — turns the export into the merged static pages in `.generated/public/` (Vite's
  `publicDir`, git-ignored): rewrites absolute asset/page links to root-relative, applies the shared navigation and
  footer links, moves the course homepage to `/upskill/`, generates the Global Talent articles from the original
  post template and lists them on `/blogs/`, decodes Cloudflare-obfuscated emails, fixes staging-domain links, and
  writes `sitemap.xml`/`robots.txt`.
- `public/site/merge.css` — stylesheet for additions to the static pages (sticky header, footer offices, blog labels,
  shared article typography and layout, article call-to-action, footer disclaimer).
- `src/lib/site.ts` — navigation, contact details and disclaimers, shared by the React homepage **and** the build script.
- `src/content/insights.ts` — the five Global Talent articles, verbatim from "BLOGS FOR TAKNIK AI.docx".
  After adding an article run `npm run covers` to render its cover image (`public/images/blog/`).
- `vercel.json` — trailing-slash URLs and redirects from the old `/insights` URLs to the Blogs section.

## Design system

The homepage follows the original site's brand: navy surfaces (`#07101F`, header `#101A34`), blue → violet accents
(`#2563EB` → `#7C3AED`), red header actions (`#E22D4B`), Poppins text and Montserrat headings. Tokens live in
`tailwind.config.js`; the header and footer replicate the original Elementor header/footer.

## Before launch

- **Assessment form** — the homepage's "Book a free profile assessment" buttons open the Tally form `TALLY_FORM_ID`
  (`src/lib/site.ts`) in a popup (`src/components/TallyPopup.tsx`). It is currently the site's existing lead form
  (`KY66Vk`, "Taknik website lead"), which asks about courses; swap the ID for a dedicated assessment form when one exists.
  The articles' "Discuss Your Profile" button still uses `BOOKING_URL` (an email to team@taknikai.com).
- **Case studies** — `src/components/CaseStudies.tsx` holds example profile journeys, not client stories. Replace
  them with verified client stories (with consent) before presenting them as real.
- The original pages' forms are Tally embeds and keep working on static hosting. WordPress-only features
  (admin-ajax "Load More", WP search, feeds) are not available.
