# Chiramel & Co Website - Current Project Handoff

**Document status:** First comprehensive project documentation and current handoff reference  
**Prepared:** 24 May 2026 (Asia/Kolkata)  
**Production URL:** <https://chiramelco.com/>  
**Hosting:** GoDaddy cPanel / Apache document root deployment  
**Local project root:** `/Users/nithinkdavid/Documents/chiramelco-website`

## Purpose of This Document

This document is intended to let another engineer or coding agent safely resume work on the Chiramel & Co website from its current live state. It records:

- what has been built and deployed;
- architectural and design decisions;
- where source content and public files live;
- how to build, preview and publish changes;
- decisions that should be preserved unless intentionally revisited;
- current limitations and suggested future work.

The root-level `PROJECT-NOTE.md` predates implementation and is an initial planning artifact. It does not reflect the present architecture, production domain, article system, deployment setup or live verification. Use this document as the current operational handoff.

The completed intellectual property firm profile PDF has its own design and publication record:

```text
project_documentation/IP_FIRM_PROFILE_HANDOFF.md
```

Read that note before editing, optimising or redeploying the profile PDF or its `/profile-ip` public route.

## Current Production State

The redesigned website is live at:

```text
https://chiramelco.com/
```

The previous `.org` site remains relevant only as the original publication source for imported Knowledge Bank articles:

```text
https://chiramelco.org/knowledge-bank
```

### Live Verification Performed

The following were verified publicly on 24 May 2026:

- `https://chiramelco.com/` serves the production site.
- `http://chiramelco.com/` redirects to `https://chiramelco.com/`.
- `https://www.chiramelco.com/` redirects to `https://chiramelco.com/`.
- TLS certificate is valid for `chiramelco.com` and `www.chiramelco.com`.
- The certificate was issued by Go Daddy Secure Certificate Authority - G2 and was valid from 24 May 2026 through 22 August 2026 at time of check.
- All 18 public HTML page routes returned `200 OK`.
- Representative desktop and mobile visual checks showed no horizontal overflow.
- Homepage disclaimer action remains reachable at `320x568`.
- Public CSS and image assets loaded successfully.
- `robots.txt`, `sitemap.xml` and `llms.txt` are live and return `200`.
- Every URL listed in `sitemap.xml` returned `200`.
- The deployed `robots.txt` was rechecked after the AI crawler update: `Claude-SearchBot` and `Claude-User` are allowed, while `ClaudeBot` is disallowed. The live file also currently disallows OpenAI's `GPTBot`; see the source/live discrepancy note in the SEO section before the next deployment.
- `https://chiramelco.com/profile-ip` serves the completed five-page IP firm profile as an inline browser-displayable PDF. Its full artifact history and deployment notes are in `project_documentation/IP_FIRM_PROFILE_HANDOFF.md`.

## Technology Stack

| Concern | Implementation |
| --- | --- |
| Static site framework | Astro 5 |
| Styling | Tailwind CSS plus scoped Astro component/page styles |
| Content | Astro Content Collections using Markdown article files |
| Client behavior | Minimal inline scripts for theme toggle, mobile navigation and disclaimer acceptance |
| Hosting | Static files extracted into GoDaddy cPanel document root |
| Web server configuration | Apache `.htaccess` in `public/` |
| Production domain | `https://chiramelco.com` |

Relevant dependencies from `package.json`:

```json
{
  "@astrojs/tailwind": "^5.1.5",
  "alpinejs": "^3.14.1",
  "astro": "^5.0.0"
}
```

`alpinejs` is installed but the current feature work described here uses ordinary inline JavaScript rather than Alpine components.

## Repository Layout

Key source locations:

```text
astro.config.mjs                 Astro site origin, optional preview base, Tailwind integration
package.json                     Development and build commands
tailwind.config.mjs              Tailwind configuration

public/
  .htaccess                      Production HTTPS/domain canonicalization and `/profile-ip` PDF route
  Chiramel-Co-IP-Profile.pdf     Public IP firm profile PDF source for static deployments
  robots.txt                     Search crawler instructions
  sitemap.xml                    Complete live route list
  llms.txt                       Optional machine-readable site overview
  images/                        Logos, hero imagery, portraits, map and QR assets

scripts/
  import-knowledge-bank.mjs      One-time/import utility for original Knowledge Bank HTML

src/
  layouts/MainLayout.astro       Shared document shell, header/footer, base metadata
  components/Header.astro        Desktop/mobile navigation and dark mode toggle
  components/Footer.astro        Footer branding and social links
  components/IPDetailPage.astro Shared template for IP sub-practice pages
  utils/sitePath.ts              Prefixes internal paths for root or `/dist/` builds
  styles/globals.css             Tailwind layers and Google Fonts import
  content.config.ts              `articles` collection schema
  content/articles/*.md          Full article bodies and card metadata
  pages/                         Static and generated site routes
```

Generated/deployment artifacts may exist locally:

```text
dist/                                  Last generated build output; not source of truth
chiramelco-live-root.zip               Prior complete root-deployment archive
chiramelco-preview-dist.zip            Prior `/dist/` preview archive
chiramelco-disclaimer-mobile-update.zip Prior targeted preview patch
chiramelco-seo-root-update.zip         Targeted SEO root-file upload archive
seo-root-update/                       Temporary packaging directory
disclaimer-mobile-update/              Temporary packaging directory
```

Important: archives are snapshots. After any source change, rebuild and create a fresh deployment archive rather than assuming an older ZIP contains current changes.

There is also a `gullible-gravity/` directory in the workspace. It is not part of the current production Chiramel & Co site implementation and should not be used as the deployment source.

## Astro Configuration and Deployment Bases

Current `astro.config.mjs` behavior:

```js
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://chiramelco.com',
  base: process.env.PREVIEW_BASE || '/',
  trailingSlash: 'never',
});
```

### Root Production Build

The production site is hosted at the root of `chiramelco.com`.

Build command:

```bash
npm run build
```

Output:

```text
dist/
```

The production ZIP must contain the contents of `dist/` at archive root, so extraction directly into cPanel `public_html` produces:

```text
public_html/index.html
public_html/.htaccess
public_html/images/...
public_html/_astro/...
public_html/news-articles/...
```

Example packaging command:

```bash
rm -f chiramelco-live-root.zip
find dist -name '.DS_Store' -delete
(cd dist && zip -qr ../chiramelco-live-root.zip .)
```

### `/dist/` Preview Build

During stakeholder preview, the site was built to live inside:

```text
https://chiramelco.com/dist/
```

Command retained for future staging needs:

```bash
npm run build:preview-folder
```

which runs:

```bash
PREVIEW_BASE=/dist astro build
```

Do **not** upload a `/dist/` base build as the root production website. Its internal assets and links intentionally point to `/dist/...`.

### Internal Path Decision

All site-local links and images should use:

```ts
import { sitePath } from '../utils/sitePath';

sitePath('/images/logo.png')
sitePath('/news-articles')
```

Implementation:

```ts
export function sitePath(path: string) {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}
```

This exists because root-relative paths such as `/images/logo.png` break when the same site is built for a subdirectory preview. When adding internal links or assets, use `sitePath()` consistently. External links, `mailto:` and `tel:` URLs should remain direct.

## Apache and HTTPS Configuration

`public/.htaccess` is copied to the deployment root by Astro:

```apache
RewriteEngine On

# Serve the production website from the secure primary domain.
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^chiramelco\.com$ [NC]
RewriteRule ^ https://chiramelco.com%{REQUEST_URI} [R=301,L]

DirectoryIndex index.html
```

This is a critical production file. It replaces the pre-launch redirect that sent `.com` visitors to `chiramelco.org`.

Its intended effects:

- force HTTP requests to HTTPS;
- canonicalize `www.chiramelco.com` to `chiramelco.com`;
- keep request paths intact during redirects;
- serve `index.html` as the directory index.

Before overwriting `.htaccess` during any future hosting migration or cPanel change, retain this canonicalization intent unless the business explicitly changes its preferred domain.

## Routes and Page Ownership

The currently generated public pages are:

| Live Route | Source |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/about/` | `src/pages/about.astro` |
| `/team/` | `src/pages/team.astro` |
| `/practice-areas/` | `src/pages/practice-areas.astro` |
| `/intellectual-property/` | `src/pages/intellectual-property.astro` |
| `/trademarks/` | `src/pages/trademarks.astro` via `IPDetailPage.astro` |
| `/copyright/` | `src/pages/copyright.astro` via `IPDetailPage.astro` |
| `/media-entertainment/` | `src/pages/media-entertainment.astro` via `IPDetailPage.astro` |
| `/commercial-transactions/` | `src/pages/commercial-transactions.astro` via `IPDetailPage.astro` |
| `/technology/` | `src/pages/technology.astro` via `IPDetailPage.astro` |
| `/patents-designs/` | `src/pages/patents-designs.astro` via `IPDetailPage.astro` |
| `/news-articles/` | `src/pages/news-articles.astro` |
| `/news-articles/territorial-jurisdiction-consumer-commissions/` | Markdown content plus `[id].astro` |
| `/news-articles/change-in-law-workers-cess/` | Markdown content plus `[id].astro` |
| `/news-articles/restriction-on-period-of-limitation/` | Markdown content plus `[id].astro` |
| `/news-articles/cpwd-arbitrator-eligibility/` | Markdown content plus `[id].astro` |
| `/careers/` | `src/pages/careers.astro` |
| `/contact/` | `src/pages/contact.astro` |

Although Astro configuration uses `trailingSlash: 'never'`, the live Apache hosting currently redirects paths such as `/about` to `/about/`. The sitemap intentionally lists the final live slash form. A future technical SEO pass may align generated internal links and canonical tags with live server normalization.

## Shared Layout and Navigation

### Layout

`src/layouts/MainLayout.astro` provides:

- the `<html>` shell;
- global CSS import;
- shared `Header` and `Footer`;
- document title from page props;
- one current general meta description.

### Header

`src/components/Header.astro` includes:

- logo hidden only on the homepage because homepage hero carries branding;
- primary links: Home, About Us, Our Team, Practice Areas, News & Articles, Careers, Contact Us;
- light/dark theme toggle persisted using `localStorage.theme`;
- compact navigation menu for screens below Tailwind `lg` (`1024px`);
- expanded desktop navigation at `lg` and above.

Do not regress the navigation breakpoint to `xl`: it caused desktop-width windows below `1280px` to show the mobile menu unexpectedly.

### Footer

`src/components/Footer.astro` uses the long dark logo, LinkedIn and Instagram links, and the informational-purpose statement. Footer assets also use `sitePath()`.

## Design System and Visual Decisions

### Overall Character

The site was intentionally designed as a restrained, professional law-firm presentation:

- deep black or zinc surfaces paired with warm amber highlights;
- serif display headings for authority and editorial character;
- sans-serif body typography for readability;
- large photographic hero banners with dark overlays;
- clean bordered cards rather than busy effects;
- light and dark theme support throughout core redesigned surfaces.

### Typography

Fonts imported in `src/styles/globals.css`:

- `Inter` for body copy;
- `Playfair Display` for headings using `.font-serif`.

The Google Fonts `@import` is intentionally placed before Tailwind layer directives to avoid the PostCSS build warning previously encountered.

### Color and Component Language

Common patterns:

- Amber accents: Tailwind amber values and scoped `rgb(217 119 6)` / `rgb(180 83 9)`.
- Zinc neutral borders and text for light/dark compatibility.
- Rounded cards generally use `rounded-3xl` or custom `1.5rem` radii.
- Hover behavior is subtle: amber border emphasis and small vertical motion.

### Homepage

The homepage includes:

- a full hero image with drifting background animation;
- central logo and established mark;
- contact and practice-area calls to action;
- a redesigned four-card practice-area teaser using inline line icons;
- an entry disclaimer modal required for Indian legal practice advertising constraints.

### Disclaimer Modal Responsiveness

The disclaimer modal is a deliberate compliance-oriented interaction:

- acceptance is stored for the browser session using `sessionStorage`;
- it reappears in a new browsing session;
- on short mobile devices, the legal text area scrolls while the acceptance button remains visible;
- this behavior was verified at `320x568`, `360x640` and `390x844`.

When modifying the modal, preserve reachability of the acceptance button on short devices.

### Practice and IP Pages

- General `Practice Areas` provides the firm-wide list.
- The intellectual property area has a dedicated landing page with service cards and IP Desk contact.
- Six specialized IP pages share `src/components/IPDetailPage.astro` to maintain consistent layout and contact presentation.

### Team Page

The team page includes:

- profile cards for Jos Chiramel and Christine Chiramel;
- email, LinkedIn and WhatsApp contact paths;
- associate advocates list;
- a Survey of India-attributed map with associate office location markers.

## News and Articles Architecture

### Decision

The News & Articles section uses Astro Content Collections rather than hardcoding cards in the index or introducing an external CMS immediately. This provides:

- locally editable Markdown files;
- structured metadata validation;
- auto-generated article routes;
- a simple migration path to a headless CMS later.

The user has indicated that browser-based CMS publishing is a likely future step, but it has not yet been implemented.

### Content Collection

Collection config:

```text
src/content.config.ts
```

Schema:

```ts
{
  title: string;
  author: string;
  category: string;
  order: number;
  excerpt: string;
  sourceUrl: valid URL string;
}
```

### Article Files

Current article Markdown files:

```text
src/content/articles/territorial-jurisdiction-consumer-commissions.md
src/content/articles/change-in-law-workers-cess.md
src/content/articles/restriction-on-period-of-limitation.md
src/content/articles/cpwd-arbitrator-eligibility.md
```

The full article bodies were migrated from the original page at:

```text
https://chiramelco.org/knowledge-bank
```

Each migrated article keeps `sourceUrl: "https://chiramelco.org/knowledge-bank"` and the rendered detail page attributes its original publication there. This `.org` link is intentional and should not be globally replaced merely because the new site is hosted on `.com`.

### Listing and Detail Pages

`src/pages/news-articles.astro`:

- obtains articles with `getCollection('articles')`;
- sorts by numeric `order`;
- shows title, author, category and excerpt;
- links into the local full article route.

`src/pages/news-articles/[id].astro`:

- generates a static page for each content entry;
- renders full Markdown body;
- displays author/category information;
- links back to the article index;
- provides original Knowledge Bank attribution.

### Adding a New Article Today

Until a CMS is introduced, create a Markdown file under `src/content/articles/`, for example:

```md
---
title: "Data Privacy Compliance for Businesses in India"
author: "Christine Chiramel"
category: "Technology Law"
order: 5
sourceUrl: "https://chiramelco.com/news-articles/data-privacy-compliance/"
excerpt: "The opening preview paragraph visible on the article index page."
---

Full article text begins here.

Additional paragraphs follow with blank lines between them.
```

Then:

1. Add its canonical final URL to `public/sitemap.xml`.
2. Add it to `public/llms.txt` if appropriate.
3. Run `npm run build`.
4. Verify the generated listing and detail page.
5. Upload a newly packaged production build or carefully upload all changed generated files.
6. Submit/request indexing for the new URL in Google Search Console if desired.

### Original Import Utility

`scripts/import-knowledge-bank.mjs` is a migration utility that parsed downloaded HTML from the prior combined Knowledge Bank page into Markdown bodies. It is not part of normal publishing. Do not rerun it over edited content unless intentionally remigrating and overwriting the article files.

## SEO and Discoverability

### Root Files Currently Live

All of these files are source-controlled under `public/` and live at the site root:

| URL | Purpose |
| --- | --- |
| `/robots.txt` | Allows crawler access and announces sitemap location |
| `/sitemap.xml` | Lists all 18 current canonical live page URLs |
| `/llms.txt` | Optional factual machine-readable site summary and key page links |

`llms.txt` is not required by Google for indexing or Google AI features. It was added as an optional low-risk discoverability aid. Normal indexability, sitemap submission and useful public content remain the important search requirements.

The intended Anthropic policy is explicit: `Claude-SearchBot` and `Claude-User` are permitted, while Anthropic's training crawler, `ClaudeBot`, is disallowed. This reflects the owner's decision to retain Claude search discovery and user-request access while opting future site materials out of Anthropic's model-training crawling. Permitting retrieval does not guarantee model attribution, recall, ranking or recommendation of the firm; publishable authority and search retrieval remain separate concerns.

**Source/live discrepancy recorded on 24 May 2026:** the current deployed `https://chiramelco.com/robots.txt` also disallows OpenAI's training crawler, `GPTBot`, although local `public/robots.txt` currently permits it. Both local and live permit `OAI-SearchBot` and `ChatGPT-User`. Before the next production upload, confirm whether OpenAI training should remain allowed or should be blocked too, then align `public/robots.txt` with that decision.

### SEO Work Completed Without Template Changes

- Production domain set to `https://chiramelco.com`.
- HTTPS and non-`www` canonical redirect added through `.htaccess`.
- Complete sitemap added and made public.
- `robots.txt` added and pointed at sitemap.
- Anthropic search and user-triggered retrieval permitted while `ClaudeBot` training crawling is blocked.
- Live `robots.txt` currently also blocks OpenAI `GPTBot`; local source awaits confirmation before this difference is reconciled.
- `llms.txt` added.
- The full sitemap was checked live; all 18 URLs resolved successfully.

### Recommended Next SEO Work Requiring Core/Layout Edits

The following are not yet implemented and would improve search and sharing quality:

- per-page meta descriptions rather than the shared generic description;
- `<link rel="canonical">` tags using the live slash-normalized URL convention;
- Open Graph and Twitter/X sharing metadata;
- favicon and related icon declarations; `/favicon.ico` was missing when checked;
- JSON-LD structured data for `LegalService` or `Organization`;
- `Article` structured data, publication date and potentially updated date for articles;
- sitemap automation from Astro routes/content rather than hand-maintained XML;
- improved social preview image strategy;
- Google Search Console verification/submission if not already completed.

### Search Console Next Step

After live deployment of any route changes, submit or re-submit:

```text
https://chiramelco.com/sitemap.xml
```

and optionally request indexing for important newly changed pages.

## Contacts and Public Data as Currently Encoded

Use caution when updating public information: confirm changes with the site owner before normalizing addresses or email domains.

Current site content includes:

- Head office: Thakkar Sadan, Link Road, New Delhi 110 055, India.
- Court chamber: Block III / Chamber No. 611, Delhi High Court, New Delhi 110 003.
- IP Desk office: C-478, FF, Defence Colony, New Delhi 110 024, India.
- Jos Chiramel email: `jos@chiramelco.com`.
- General email shown on Contact and Careers pages: `info@chiramelco.org`.
- IP contact emails: `ip@chiramelco.com`, `christine@chiramelco.com`.

Note: the general email uses `.org` while the production domain is `.com`. This may be intentional. Do not change it without confirmation.

## Build and Release Workflow

### Local Development

```bash
npm install
npm run dev
```

Astro commonly serves locally at:

```text
http://127.0.0.1:4321/
```

### Production Validation Checklist

Before uploading a root release:

1. Ensure new internal links and asset paths use `sitePath()`.
2. Add new routes/articles to `public/sitemap.xml`.
3. Update `public/llms.txt` when public content inventory changes materially.
4. Run:

   ```bash
   npm run build
   ```

5. Inspect generated root HTML for accidental preview references:

   ```bash
   rg -n '/dist/' dist --glob '*.html'
   ```

   Expected result: no matches for a root production build.

6. Check that key root files exist:

   ```bash
   ls -la dist/.htaccess dist/robots.txt dist/sitemap.xml dist/llms.txt
   ```

7. Serve `dist/` locally at root and browser-check:

   - homepage and disclaimer at phone width;
   - header at desktop and phone widths;
   - practice and IP navigation;
   - article index and article detail;
   - loaded images and styles;
   - no horizontal overflow.

8. Remove `.DS_Store` from deployment output before packaging:

   ```bash
   find dist -name '.DS_Store' -delete
   ```

9. Package the contents of `dist/` directly:

   ```bash
   rm -f chiramelco-live-root.zip
   (cd dist && zip -qr ../chiramelco-live-root.zip .)
   ```

10. Back up existing `public_html/.htaccess` and production files before extracting an updated release.
11. Upload ZIP to cPanel `public_html` and extract in place.
12. Publicly recheck redirects, assets, routes, mobile modal and root SEO files.

### Targeted Root-File Update

For a root-file-only change such as `robots.txt`, `sitemap.xml` or `llms.txt`, it is acceptable to package and upload only those files, extracting directly in `public_html`. This was already done once using:

```text
chiramelco-seo-root-update.zip
```

On 24 May 2026, an AI-crawler-specific `robots.txt` replacement was also uploaded through cPanel. Live verification after upload confirmed that Claude retrieval agents are allowed and `ClaudeBot` is blocked; it also revealed that the deployed file blocks `GPTBot`, which differs from the current local source and needs an explicit owner decision before a later deployment.

For changes to templates or styles, prefer a complete rebuilt release because Astro stylesheet filenames are content-fingerprinted and multiple HTML pages may reference changed output assets.

## Hosting Notes

### GoDaddy cPanel

The production release is manually uploaded through GoDaddy cPanel. A typical target is:

```text
public_html/
```

Confirm the document root associated with `chiramelco.com` before extraction if hosting configuration changes.

### SSL

An SSL certificate was installed for:

```text
chiramelco.com
www.chiramelco.com
```

At verification, it was a GoDaddy-issued certificate expiring on 22 August 2026. Verify renewal/AutoSSL behavior in cPanel ahead of expiry.

### Previous Preview Deployment

Before go-live, a staging preview was uploaded at:

```text
https://chiramelco.com/dist/
```

The root release replaced the need for this preview. Public checks after launch found `/dist/` assets no longer served, which is acceptable. Avoid confusing the old preview ZIP with the root production build.

## Known Gaps and Future Roadmap

### IP Firm Profile PDF

A five-page intellectual property focused firm profile is complete and available publicly at:

```text
https://chiramelco.com/profile-ip
```

It is intended to display within the browser. The editable PDF builder, page structure, design rationale, QR/link behavior, publication file locations and prior download-routing caveat are documented separately in:

```text
project_documentation/IP_FIRM_PROFILE_HANDOFF.md
```

The live PDF checked on 24 May 2026 was smaller than the local publication-quality copy. Treat future web optimisation or replacement as deliberate publishing work rather than overwriting the hosted copy automatically.

### Content Management

Current publication workflow is file-based Markdown plus rebuild/upload. The owner has expressed interest in a browser-editable CMS as a next phase.

Potential approaches to evaluate:

- Decap CMS with Git-based content editing;
- Sanity;
- Contentful;
- another headless CMS integrated into Astro collections/builds.

Required decisions before implementing:

- who publishes articles;
- whether drafts/approvals are required;
- whether publishing should automatically deploy;
- whether articles need dates, tags, authors, SEO metadata and images;
- whether the existing GoDaddy static deployment remains viable or should move to CI-backed hosting.

### Technical SEO and Sharing

Recommended next implementation scope:

- enhance `MainLayout.astro` props for title, description, canonical URL and social metadata;
- create organization/legal service JSON-LD;
- extend article schema with publish dates and article metadata;
- automate sitemap generation as article count grows;
- add favicon and branded social image assets.

### Repository Hygiene

The workspace currently contains generated artifacts and installed dependency files that may not belong in version control, including local ZIPs, `dist/`, `.astro/`, temporary packaging folders and possible `.DS_Store` files. Before formal source-control work:

- inspect current git status carefully;
- avoid deleting user assets or production archives without consent;
- add or update `.gitignore` intentionally;
- remove generated artifacts only after confirming what the owner wishes to retain.

## Safe Editing Guidelines for Future Agents

- Treat `src/`, `public/`, `astro.config.mjs`, `package.json` and content entries as source of truth.
- Treat `dist/` and ZIP packages as generated artifacts.
- Use `sitePath()` for new internal URLs and image references.
- Preserve `.htaccess` canonical HTTPS behavior unless intentionally changing domain strategy.
- Keep the disclaimer interaction present and mobile-reachable.
- Respect that the site is a law-firm information site: avoid unapproved marketing claims or substantive edits to published legal articles.
- Do not silently change contact data, original article attribution or source links.
- Validate light and dark modes when editing major visual components.
- Validate both desktop expanded navigation and phone menu for header changes.
- Use a root production build for live deployment; use `/dist/` build only for a future subfolder preview.
- Recheck live status after any cPanel extraction, especially because `.htaccess`, CSS fingerprints and directory placement are easy sources of deployment regression.

## Quick Resume Checklist

For an agent beginning new work:

1. Read this file.
2. Inspect `git status --short` and do not discard existing work.
3. Confirm whether the requested change is for source, preview deployment or live production.
4. Review relevant source modules and use existing visual/content patterns.
5. Run `npm run build` before any root production delivery.
6. For visual work, inspect live/local behavior in desktop and phone layouts.
7. If adding/removing routes or articles, update sitemap and `llms.txt`.
8. Produce a fresh upload artifact only after verification.

## Current Baseline Summary

The live site is a static Astro/Tailwind redesign deployed at `https://chiramelco.com/` with:

- branded responsive homepage and legally required session-based disclaimer;
- responsive navigation and dark theme;
- firm, team, careers and contact pages;
- full practice listing;
- dedicated intellectual property landing and detail pages;
- a file-based article publishing system containing four migrated Knowledge Bank articles;
- production HTTPS/domain canonicalization through Apache;
- live crawler discovery files (`robots.txt`, full sitemap and optional `llms.txt`).

This is a solid static baseline. The most natural next development phase is a lightweight publishing/CMS workflow plus metadata and structured-data SEO enhancements.
