# NanakShahi

An independent editorial website for **[nanakshahi.in](https://nanakshahi.in)** that explains the Nanakshahi and Punjabi calendars, Gurpurabs, Sikh festivals (including Bandi Chhor Divas), Guru Nanak Dev Ji, Sri Harmandir Sahib, the Hukamnama/Mukhwak tradition and Sikh history, in clear English.

The site is built as a fast, statically generated Next.js publication. Its content model is separate from the UI, so articles can later come from WordPress, and it is prepared for Google AdSense without showing any placeholder ads.

> **Independence.** NanakShahi is not affiliated with the SGPC, Sri Akal Takht Sahib or any gurdwara management. It never generates, retypes or paraphrases the daily Hukamnama. See `/about` and `/disclaimer`.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, static generation) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (design tokens in `app/globals.css`) plus a hand-written `.prose` layer |
| Fonts | `next/font/local`, self-hosted, all under the SIL Open Font License: **Newsreader** (display/reading serif), **Inter** (UI) and **Noto Sans Gurmukhi** (Punjabi text) |
| Content | Markdown and front matter (`gray-matter` + `marked`), behind a `ContentSource` interface |
| Images | `next/image` (AVIF/WebP); original illustrations in `public/images/articles` |
| Linting | ESLint 9 flat config with `eslint-config-next` |

Runtime dependencies are deliberately minimal: `next`, `react`, `react-dom`, `marked`, `gray-matter` and `server-only`. There is no client-side state library, analytics SDK or UI kit.

Only two small client components ship JavaScript: the mobile menu dialog and the copy-link button. The table of contents and FAQ use native `<details>`. Everything else is a server component.

## Getting started

Requirements: Node.js ≥ 20.9.

```bash
npm install
cp .env.example .env.local     # optional; sensible defaults exist
npm run dev                    # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (bound to `0.0.0.0`) |
| `npm run build` | Production build and static generation of every article and category page |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:content` | Content QA (see below) |

Before every deploy, run `npm run check:content && npm run typecheck && npm run lint && npm run build`.

## Environment variables

All variables are optional for local development. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used in metadata, the sitemap, robots and JSON-LD. Default `https://nanakshahi.in`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Address shown on `/contact` and in the footer. Default `contact@nanakshahi.in`. **Make sure this mailbox exists.** |
| `CONTENT_SOURCE` | `local` (default) or `wordpress`. |
| `WORDPRESS_API_URL` | WordPress REST base, for example `https://cms.nanakshahi.in/wp-json`. Only used when `CONTENT_SOURCE=wordpress`. |
| `HUKAMNAMA_API_URL` | Optional JSON endpoint for today's Hukamnama (see below). Empty means the informational state. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher id (`ca-pub-…`). While empty, no ad markup renders at all. |

Never commit `.env*` files; only `.env.example` is tracked.

## Project structure

```
app/
  layout.tsx               Root layout: fonts, skip link, header, footer, default metadata
  page.tsx                 Homepage
  [category]/page.tsx      Topic hubs (/nanakshahi-calendar, /gurpurab, …)
  articles/page.tsx        All articles, grouped by topic
  articles/[slug]/         Article template + article-specific not-found
  search/                  Server-rendered search (noindex) + loading skeleton
  hukamnama-today/         Future live Hukamnama page (informational until a verified feed exists)
  about|contact|privacy-policy|terms-and-conditions|disclaimer/
  not-found.tsx            Global 404
  sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.svg, favicon.ico
components/
  layout/                  Header (desktop dropdowns), MobileMenu (accessible dialog), Footer, Logo
  cards/ArticleCard.tsx    lead | standard | horizontal | compact | overlay variants
  article/                 Prose, TableOfContents, FaqSection, ShareButtons, RelatedArticles, EditorialNote
  sidebar/Sidebar.tsx      Search, essential reading, latest, topics, related topics
  ui/                      Breadcrumbs, SearchForm, SectionHeading, CategoryLabel, ArticleMeta, EmptyState, AdSlot, Icons
  hukamnama/               HukamnamaCard (verified entry) and HukamnamaUnavailable (fallback)
  seo/JsonLd.tsx
content/
  articles/*.md            The 20 launch articles
  pages/*.md               About, Contact, Privacy, Terms, Disclaimer
  categories.ts            Topic definitions: names, intros, SEO copy
  navigation.ts            Header, footer and mobile navigation
  authors.ts               NanakShahi Editorial Team
  calendar.ts              Nanakshahi month data and year helper
lib/
  content/                 index.ts (public API), source.ts (interface), local.ts, wordpress.ts
  markdown.ts              Markdown → HTML, heading ids and TOC, tables, callouts, word count
  seo.ts                   Metadata builders and JSON-LD
  hukamnama.ts             Official source list and the validated Hukamnama fetcher
  site.ts, format.ts
scripts/
  check-content.mjs        Content QA
  generate-illustrations.mjs  Reproducible vector illustrations, fallback image and logo
types/content.ts           Source-agnostic content types
```

## Content architecture

UI components never read files or call APIs directly. They call the functions in `lib/content/index.ts`:

- `getArticles`, `getArticleBySlug`, `getArticleSlugs`
- `getLatestArticles`, `getFeaturedArticles`, `getEssentialArticles`
- `getArticlesByCategory`, `getCategories`, `getActiveCategories`, `getCategoryBySlug`
- `getRelatedArticles`, `searchArticles`, `getPage`

These functions delegate to the active **`ContentSource`** (`lib/content/source.ts`), which returns fully normalised objects defined in `types/content.ts`.

The `Article` type carries: `id`, `slug`, `title`, `excerpt`, `content`, `category`, `secondaryCategories`, `tags`, `featuredImage`, `author`, `publishedAt`, `updatedAt`, `readingTime`, `seoTitle`, `seoDescription`, `keywords`, `relatedArticles`, `faq`, and derived `toc`, `wordCount` and `plainText`.

### Writing an article

Create `content/articles/<slug>.md`. The file name is the URL slug, served at `/articles/<slug>`. There are no dates in URLs.

```yaml
---
title: "Readable headline"
excerpt: "One or two sentences used on cards and as a fallback description."
category: "sikh-festivals"            # a slug from content/categories.ts
secondaryCategories: ["sikh-history"] # optional; the article also appears on these hubs
tags: ["Bandi Chhor Divas", "Diwali"]
image:
  src: "/images/articles/example.jpg" # 1376×768 recommended
  alt: "What the image actually shows, in plain words"
  caption: "Visible caption"
publishedAt: "2026-09-12"
updatedAt: "2026-09-25"
featured: false                        # eligible for the homepage hero list
editorialRank: 20                      # optional; lower = higher in "Essential reading"
seoTitle: "≤ 60 characters; ' | NanakShahi' is appended"
seoDescription: "110–170 characters, written for people, not keywords."
keywords: ["search intent notes"]      # guides writing only; never emitted in page markup
related: ["slug-a", "slug-b", "slug-c"]
faq:                                   # optional; only genuine questions
  - question: "…"
    answer: "…"
---
```

Markdown conventions:

- Start sections at `##`; the page title is the only H1. H2 and H3 headings get stable ids and feed the table of contents.
- Link internally with root-relative paths (`/articles/<slug>`, `/harmandir-sahib`).
- Callouts use `> [!NOTE] Title`, `> [!TIP]`, `> [!IMPORTANT]` or `> [!CONTEXT]`.
- Tables are wrapped automatically for horizontal scrolling on small screens.
- Inline Gurmukhi renders with Noto Sans Gurmukhi through the font fallback stack.
- If an image file is missing, the article falls back to `/images/fallback.jpg` instead of breaking.

### Editorial rules baked into the content

- No Gurbani quotations beyond "Ik Onkar"; meanings are paraphrased and attributed to the tradition.
- Dates that vary between calendars are hedged, and readers are told to confirm with the SGPC calendar or their gurdwara.
- The daily Hukamnama is never reproduced; articles point to `/hukamnama-today`, which links only to official sources.
- The author is always "NanakShahi Editorial Team"; no invented writers or credentials.

### Content QA

`npm run check:content` fails on:

- missing fields or unknown categories;
- duplicate slugs, titles, SEO titles or descriptions;
- related slugs that don't exist;
- broken internal links in articles and pages;
- missing image files or weak alt text;
- H1s in bodies;
- `updatedAt` earlier than `publishedAt`.

It warns on title and description lengths and on articles under 1,200 words.

### Topic clusters

Each hub (category page) has a written introduction and pulls in articles whose primary *or* secondary category matches. Pillar articles link down to supporting articles and back. For example, *Nanakshahi Calendar: History, Months, Dates* ↔ *Punjabi Calendar Explained* ↔ *A Practical Guide to Sikh Dates*.

Hubs with no articles are not pre-rendered. If one is reached (e.g. after a CMS change), it shows a noindexed empty state. Short, memorable paths such as `/golden-temple`, `/bandi-chhor-divas` and `/mukhwak` are permanent redirects in `next.config.ts`, not duplicate pages.

## SEO architecture

- **Metadata:** every route sets a unique title (template `%s | NanakShahi`), description, canonical URL, Open Graph and Twitter tags via `lib/seo.ts`. Articles use their own featured image for social cards; other pages use `app/opengraph-image.tsx`.
- **Robots:** everything is indexable except `/search`, which is `noindex, follow` and disallowed in `robots.txt`, and empty hubs.
- **Sitemap:** `app/sitemap.ts` lists the static pages, active hubs and all articles, with `lastModified` and image entries.
- **Structured data:**
  - `Organization` and `WebSite` (with `SearchAction`) on the homepage.
  - `Article` and `BreadcrumbList` on articles.
  - `FAQPage` only when an article has a genuine FAQ.
  - `CollectionPage` on hubs and `BreadcrumbList` on trust pages.
- **Semantics:** one H1 per page, landmarks (`header`, `nav`, `main`, `aside`, `footer`), a skip link, `lang="pa"` on Gurmukhi, and meaningful alt text.
- **Performance:** static HTML, self-hosted fonts with `display: swap`, responsive AVIF/WebP images with fixed dimensions (no layout shift), and no third-party scripts.

## Images

All images are original and safe to publish:

- `public/images/articles/*.jpg` for articles 1–10 are stylised illustrations created with an AI image tool and reviewed editorially. Articles 11–20, the fallback image and `public/logo.png` are vector illustrations drawn in code by `scripts/generate-illustrations.mjs` (`node scripts/generate-illustrations.mjs` regenerates them).
- None are photographs, and none depict the Gurus. Captions describe them as illustrations, and the image policy is disclosed on `/about` and `/disclaimer`.
- If you add photographs later, use only images you own or have a licence for, and set `image.credit` in the front matter.

## AdSense

Ads are **off** and invisible by default. `<AdSlot position="…" />` is placed at `home-mid`, `article-top`, `article-mid` and `article-bottom`, with `sidebar` also supported. It renders `null` until both of these are true:

1. `NEXT_PUBLIC_ADSENSE_CLIENT` is set, and
2. a slot id is mapped for that position in `components/ui/AdSlot.tsx`.

To go live after approval:

1. Set `NEXT_PUBLIC_ADSENSE_CLIENT` and map the slot ids.
2. Load the AdSense script once in `app/layout.tsx` with `next/script` (`strategy="afterInteractive"`).
3. Add `public/ads.txt` with the line Google gives you.
4. If you serve users in the EEA/UK, add a certified consent-management platform, and update `/privacy-policy`.

Units are labelled "Advertisement" and reserve height to avoid layout shift. There are no sticky, pop-up or interstitial placements.

## Future: WordPress as the CMS

`lib/content/wordpress.ts` implements the same `ContentSource` interface against the WordPress REST API.

1. Create posts in WordPress with categories whose slugs match `content/categories.ts`, and set a featured image.
2. Expose optional fields through REST (ACF or registered meta): `seo_title`, `seo_description`, `keywords`, `faq` (array of `{question, answer}`), `related` (array of slugs), `featured`, `editorial_rank`.
3. Set `CONTENT_SOURCE=wordpress` and `WORDPRESS_API_URL=https://your-cms/wp-json`.
4. Allow the media host in `images.remotePatterns` in `next.config.ts` (a commented example is included).
5. For instant updates, add an on-demand revalidation route called from a WordPress webhook. Otherwise pages rebuild on deploy.

Article routes render unknown slugs on demand, so new CMS posts appear without a full rebuild. Post HTML from WordPress is rendered as trusted HTML, so keep editor roles restricted, or add a sanitiser, before opening the CMS to more contributors.

## Future: live Hukamnama API

`/hukamnama-today` is deliberately informational today. It is clearly labelled, links to the SGPC and its broadcast channel, and shows the fields the live service will contain. It revalidates every 15 minutes.

To go live, point `HUKAMNAMA_API_URL` at an endpoint you control that returns **verified** data for the current Amritsar date:

```json
{
  "date": "2026-09-27",
  "source": "Sri Harmandir Sahib, Amritsar",
  "sourceUrl": "https://…original publication…",
  "gurmukhi": "…exactly as published…",
  "transliteration": "…optional…",
  "punjabiExplanation": "…optional, as published…",
  "englishTranslation": "…optional…",
  "translationCredit": "Translator or publisher",
  "explanation": "…optional NanakShahi commentary…",
  "raag": "…",
  "ang": 123,
  "audioUrl": "…optional…",
  "image": { "src": "…official image…", "alt": "…", "width": 1200, "height": 1600 }
}
```

`lib/hukamnama.ts` validates the payload (a date, a source and non-empty Gurmukhi are required). On any error or invalid data it falls back to the informational state; it never shows stale or invented text. See `HukamnamaEntry` in `types/content.ts` for the full shape. Obtain permission from the publisher before republishing their text, translation or audio.

## Deployment

The site is a standard Next.js app and deploys to **Vercel** with zero configuration. Import the repo and set the environment variables above. It also runs on any Node host:

```bash
npm ci && npm run build && npm run start   # listens on 0.0.0.0:3000
```

After the first deploy:

- Point `nanakshahi.in` at the host and set `NEXT_PUBLIC_SITE_URL=https://nanakshahi.in`.
- Submit `https://nanakshahi.in/sitemap.xml` in Google Search Console.
- Security headers are set in `next.config.ts`. Review the policy if you add third-party scripts such as AdSense.

## Before launch: owner checklist

- **Legal review:** `/privacy-policy`, `/terms-and-conditions` and `/disclaimer` are sensible starting drafts, not legal advice. Have them reviewed for your jurisdiction and business setup before enabling ads or analytics.
- Confirm the contact mailbox exists (`NEXT_PUBLIC_CONTACT_EMAIL`).
- Read the articles through with a knowledgeable reviewer, especially the dates flagged as varying between calendars. Update `updatedAt` when you change an article.
- Keep the independence and image disclosures in place.

## Licence

Code © NanakShahi. Fonts are under the SIL Open Font License (see `app/fonts/LICENSE-OFL.txt`). Article text and illustrations © NanakShahi; see `/terms-and-conditions` for reuse.
