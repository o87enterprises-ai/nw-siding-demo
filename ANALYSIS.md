# Website Analysis: nw-siding-demo

Scope: static review of the source in this repo plus a header check of the live preview (https://nw-siding-demo.pages.dev, HTTP 200 from Cloudflare). No Lighthouse run and no browser testing, so there are no measured performance numbers.

## 1. What it is

A **demo / sales-pitch site** that o87Enterprises built for Northwest Siding, a siding contractor in Eugene, OR. It has two parts:

- **`/`**: a one-page marketing site. Sections: Hero, Proposal CTA, Stats, Services, Portfolio, Testimonials, Contact, Footer.
- **`/proposal`**: a slide-style pricing deck with three service tiers and projected results.

The whole site sits behind an **NDA gate**: a terms modal that must be accepted before anything renders.

## 2. Tech stack

| Area | Choice |
|---|---|
| Framework | React 18 + Vite 5, client-side rendered |
| Routing | react-router-dom 7 (BrowserRouter) |
| Animation | framer-motion 11 |
| Styling | Mostly inline style objects, plus about 385 lines of global CSS with custom properties (`--gold`, `--bg`, ...) |
| Fonts | Google Fonts (Playfair Display, Inter) |
| Hosting | Cloudflare Pages, direct upload (`npm run deploy`, wrangler 3). Not git-connected. |
| Size | About 3,100 lines of source. The built JS bundle is 376 KB uncompressed. |

## 3. Strengths

- **Strong, consistent visual identity.** Dark navy with gold accents, serif headlines, a Ken Burns hero slideshow and scroll-triggered reveals. It reads as premium, which suits a pitch demo.
- **Clear conversion path.** There is a "Get Free Estimate" button in the hero, a form, and click-to-call and mailto links. The proposal CTA is placed right under the hero.
- **Mobile attention.** Recent commits fixed the proposal deck and the terms screen on phones. Spacing uses `clamp()` and there is a responsive nav.
- **Cautious claims.** A commit ("Soften unverified claims") shows deliberate editing of claims that couldn't be verified. DEPLOY.md calls it a preview site, not a live production site.
- **Clean deploy hygiene.** `node_modules` is untracked, secrets are described but not committed, and the SPA fallback (`/* /index.html 200`) is configured.

## 4. Issues and risks

Ordered by how much each matters.

### High
1. **The contact form does nothing.** `Contact.jsx` has a `<form>` with no `onSubmit`, no `action`, and no `name` attributes on the inputs. Pressing "Submit Estimate Request" reloads the page and discards the data. That is fine for a demo, but it must be wired up (email service, Formspree-style endpoint, or Cloudflare Worker) before it goes live.
2. **Stock photos are labelled as real projects.** Hero captions such as "Seamless Steel Gutters · Roseburg, OR" and "Premium Cedar Siding · Albany, OR" sit on Unsplash stock images. The Portfolio uses Unsplash images too. Presented as the company's work, these misrepresent it. For a real launch, swap in the client's own photos or remove the location and project captions.
3. **Unverified business claims and testimonials are hard-coded.**
   - Examples: "James Hardie® Exclusive Preferred Remodeler", "Master GuildQuality Award", "2,000+ homes", CCB #136733, and four named testimonials.
   - Each needs written confirmation from the client before launch. Licensing numbers and awards carry legal risk if wrong.
4. **The NDA gate is not security.** It is a `sessionStorage` flag, so anyone can bypass it from the console. The built `dist/` bundle, which is committed, contains all the content.
   - If the aim is confidentiality, this gate won't provide it. Use Cloudflare Access or a password.
   - If the aim is to record agreement, the acceptance is not logged anywhere.
   - The gate also hides the entire site from search engines and link previews (see SEO).

### Medium
5. **Weak SEO and sharing metadata.**
   - Client-rendered with an empty `<div id="root">`.
   - No meta description, Open Graph or Twitter tags, canonical URL, or structured data (LocalBusiness schema would help a contractor).
   - The NDA gate means crawlers only see the gate.
   - `index.html` references `/favicon.svg`, but `public/` only contains `_redirects`. Because of the SPA fallback, that request returns the HTML page with a 200 instead of a 404, so the tab icon silently fails.
6. **Accessibility gaps.**
   - Form `<label>`s aren't tied to inputs (no `htmlFor`/`id`), so screen readers can't announce them.
   - The hero slide-indicator buttons have no accessible names.
   - The NDA overlay is not a real `role="dialog"` and has no focus trap.
   - There is no `prefers-reduced-motion` handling for the Ken Burns zoom, the infinite bounce, and the auto-rotating testimonials. The grep found no such media query.
   - Tiny text (0.55–0.68rem) in muted gold or grey on dark backgrounds likely fails WCAG contrast.
   - The hero caption `font-size: 0.58rem` is below readable size on phones.
7. **Image weight and third-party dependence.**
   - `nw-logo.png` is about **1 MB** and is the largest asset in `dist/`. It should be a properly sized WebP or SVG at a fraction of that size (`nw-mark.svg` already exists).
   - About 22 Unsplash URLs are hotlinked at 1920px wide, so the page depends on their uptime and terms. They are loaded as CSS backgrounds, so there is no `srcset` or lazy loading.
   - The hero crossfades through 5 full-size images.
8. **Single JS bundle (376 KB raw).** The proposal deck (869 lines) and the home page ship together. Route-level `React.lazy` splitting would trim first load.

### Low
9. **Hero timer uses a `requestAnimationFrame` loop that runs continuously** just to advance a slide every 7s. A `setInterval` would do the same job, as in `Testimonials.jsx`. It also keeps running while the tab is in the background, wasting battery.
10. **Heavy use of inline styles.** Hover effects are done with `onMouseEnter`/`onMouseLeave` JS handlers instead of CSS `:hover`. This makes the code harder to maintain and rules out `:focus-visible` styling, which also hurts keyboard users.
11. **Footer logo link is `href="#"`.** It scrolls to the top rather than pointing at an o87 destination.
12. **Deploy process depends on a long-lived Global API Key** (per DEPLOY.md). A scoped Pages-edit API token is safer, and the doc already notes that.
13. **No tests, lint config, or CI.** Acceptable for a demo; worth adding if this becomes a real client site.
14. **`dist/` is committed.** That is convenient for uploads, but it makes diffs noisy and can drift from source.

## 5. Recommendations, in order

1. **Decide the site's purpose:** private pitch demo or live client site. Most of the other priorities depend on this.
2. **If it goes live:**
   - Wire up the form.
   - Replace stock photos with real project photos.
   - Get written sign-off on every claim and testimonial.
   - Remove the NDA gate (or move it to Cloudflare Access if the goal is protection).
3. **Quick wins, about an hour of work:**
   - Add `public/favicon.svg`.
   - Add meta description and OG tags.
   - Add `htmlFor`/`id` on form fields and `aria-label` on the slide buttons.
   - Add a `prefers-reduced-motion` rule.
   - Compress the 1 MB logo.
4. **Performance pass:** lazy-load the `/proposal` route, self-host or resize the imagery, and replace the rAF slider with `setInterval`.
5. **Measure.** Run Lighthouse or PageSpeed on the live preview to get real Core Web Vitals and accessibility scores before prioritising the performance work.

---

# Addendum: willamettevalleyoutfittersllc.com

Scope: homepage HTML and response headers only (curl). No rendering, Lighthouse, or crawl of inner pages.

## What it is
A WordPress site for **Willamette Valley Outfitters**, a fishing guide service (Columbia, Willamette, McKenzie, Buoy 10; Chinook trips). Theme: "Maya" with a child theme. Plugins visible in the page source: Contact Form 7, Photo Gallery, WP Google Maps, Akismet, WP-SpamShield, Meks Flexible Shortcodes. Hosted on LiteSpeed with page caching working (`x-litespeed-cache: hit`).

## Strengths
- **SEO basics are in place.** Yoast SEO provides a clear title ("Best Oregon Fishing Guide | Willamette Valley Outfitters"), a meta description, a canonical URL, Open Graph and Twitter tags, a sitemap (`/sitemap_index.xml` returns 200) and a `robots.txt`.
- **Easy to call.** A `tel:` link (541-517-7536) is on the page.
- **Basic security hygiene.** HTTP redirects to HTTPS (301) and `xmlrpc.php` returns 403.
- **Sponsor/partner links** (Daiwa, Pautzke, Edge Rods, and others) add some credibility.

## Issues
**High**
1. **Pinch-zoom is disabled.** The viewport tag contains `maximum-scale=1.0 user-scalable=no`. This is an accessibility failure for low-vision users, and the tag is also malformed (missing comma).
2. **Dated, heavy build.** The homepage loads **56 `<script>` tags and 15 stylesheets**, and only 2 images are lazy-loaded out of 16. That likely means slow mobile loads. This is the main thing to measure with Lighthouse.
3. **No clear heading structure.** There is no `<h1>` on the page. The only `<h2>`s found are "Get in Touch", "Blog" and "QUICK CONTACT". The page misses the main keywords ("Oregon fishing guide", river names, species) in its headings.

**Medium**
4. **Missing alt text.** 7 of 16 images have no `alt` attribute, and 5 more have an empty one. The empty ones are acceptable only for decorative images.
5. **Mixed content and old URLs.** The source still references `http://fonts.googleapis.com` and a logo on the old domain `willamettevalleyoutfitters.com` (no "llc") over plain `http://`. Browsers may block or upgrade these, and it breaks the padlock in some cases.
6. **No local-business structured data.** There is no `LocalBusiness` schema, which matters for a guide service competing in local search. Reviews, trip pricing and availability aren't marked up either.
7. **Stale content signals.** Yoast reports the page was last modified **2019-02-27**, the favicon and uploads date from 2015, and no copyright line was found. The page claims to be "booking" for current seasons, so it should show current dates and rates.
8. **Plugin sprawl.** Two spam plugins (Akismet and WP-SpamShield), an old gallery plugin and a maps plugin each add scripts and attack surface. Each needs ongoing updates.

**Low**
9. **Missing security headers.** No HSTS, CSP, or X-Frame-Options appeared in the headers I checked.
10. **External links go to plain `http://`** partner sites (e.g. `http://www.daiwa.com`); update to `https` where available.

## Recommendations
1. Remove `user-scalable=no` (quick fix, high value).
2. Add one `<h1>` with the primary keyword and real section headings.
3. Add alt text to all meaningful images and lazy-load below-the-fold ones.
4. Reduce scripts and CSS (disable unused plugins, combine or defer assets), then run Lighthouse to get real numbers.
5. Fix `http://` resources, add `LocalBusiness` and `Review` schema, and refresh dated content.
6. Consider a modern rebuild (like the NW Siding demo above) if the goal is bookings; a booking or availability form would convert better than the phone-first layout.
