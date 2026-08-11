# Navbar + Footer - Loop Engineering Prompt & Definition of Done

Source review: `L180_HomePage Wireframe.png`, `Sample_Website.png`, `L180 Mood Board.png`,
`L180 Website OS_v3.0.xlsx`, `L180_Typography_ColorSystem.docx`, `index.html`.

## Findings used to build this prompt

- **Palette**: Sandeep's moodboard (`L180 Mood Board.png`) is ready and matches
  `L180_Typography_ColorSystem.docx` exactly - Navy `#1B2A3D`, Amber `#E8A838`,
  Canvas `#FCFCFA`, plus the extended token set in the docx. Use this system, not
  the pitch-deck fallback.
- **Legacy conflict**: `L180 Website OS_v3.0.xlsx` sheet `20_Design_System` contains
  an older, superseded system (Saffron/Midnight, Cormorant Garamond, DM Sans, Syne)
  marked "REMOVED." Ignore it - only Plus Jakarta Sans + the docx palette are valid.
- **Nav/footer ground truth**: cross-checked `05_Sitemap` against the wireframe.
  Primary nav (desktop): `Home | Services ▾ | Our Work | About | Contact` + CTA
  `Book Free AI Audit`. Services dropdown: AI Strategy, AI Development, AI Ops,
  AI Training. Mobile: hamburger, CTA always visible in header. Footer: logo +
  tagline + social icons (LinkedIn, X, YouTube, GitHub), Services/AI Startups/
  Company/Legal columns, dark navy bottom bar with copyright + "Built in India.
  Serving globally." This supersedes the task brief's nav order (Home, About,
  Services, Work, Contact) - the wireframe is the approved IA.
- **Tokens**: spacing scale 4/8/16/24/32/48/64/80/100px; container max-width
  1200px (60px side padding desktop / 24px mobile); breakpoints mobile `<768px`,
  tablet `768–1024px`, desktop `>1024px` (test 375 / 768 / 1440); radius 6px
  buttons / 8px cards; shadow `0 2px 8px rgba(13,31,60,.06)` default.
- **SEO/AEO scope decision**: scoped to the homepage + the site-wide files/schema
  the Navbar/Footer/head partials own (sitemap.xml, robots.txt, llms.txt,
  Organization/Service schema, OG/canonical meta, breadcrumb partial). The other
  12 approved sitemap pages get their own SEO pass when built, not fabricated now.

---

## Loop Engineering Prompt

```
ROLE: Front-end engineer building the reusable global Navbar and Footer for the
Life180 Labs marketing site, matching an approved wireframe pixel-for-pixel, and
wiring up SEO/AEO foundations for the homepage and shared components.

SOURCE OF TRUTH (in priority order):
1. L180_HomePage Wireframe.png - exact layout, copy, spacing, nav items, footer columns
2. L180_Typography_ColorSystem.docx - color hex values, type scale, weights, line-heights
3. L180 Mood Board.png - confirms the same palette (moodboard is final/approved)
4. L180 Website OS_v3.0.xlsx, sheet 05_Sitemap + 20_Design_System - spacing scale,
   breakpoints, container widths, radius/shadow tokens, and the 13-page approved
   sitemap (for URL structure and internal linking only - do not build those pages
   in this pass). IGNORE any Saffron/Midnight/Cormorant Garamond/DM Sans/Syne
   references in that sheet - that's a superseded draft marked REMOVED. Only
   Plus Jakarta Sans + the docx palette are valid.
5. index.html (existing repo file) - current implementation to refactor, not a design source

TASK:
Extract the header and footer markup/styles currently inlined in index.html into two
reusable components (Navbar, Footer) that can be dropped into every page of the site
with zero visual drift. Do not change index.html's other sections. Then add the
SEO/AEO foundation described below, scoped to the homepage plus the site-wide
files/schema the Navbar/Footer/head partials are responsible for. Do not fabricate
content for the other 12 sitemap pages - they get their own SEO pass when built.

NAVBAR SPEC:
- Logo: Life180 Labs mark + "LIFE180 / LABS" wordmark, left-aligned
- Links (desktop, in order): Home, Services (dropdown), Our Work, About, Contact
  - Services dropdown items: AI Strategy, AI Development, AI Ops, AI Training
  - Dropdown opens on hover (desktop) and tap (touch), closes on outside click/Escape
  - Active page link gets the amber underline/indicator shown in the wireframe (Home
    is active on homepage)
- CTA button, right-aligned: "Book Free AI Audit" - amber (#E8A838) bg,
  navy (#101838) text, arrow icon, 6px radius, hover darkens per docx CTA Hover spec
- Sticky on scroll, white/canvas background, subtle bottom border or shadow on scroll
- Mobile (<768px): logo left, CTA button always visible (never collapses into the
  hamburger menu), hamburger icon opens a full-screen or slide-in menu with the same
  5 links + Services as an accordion (not hover dropdown)
- Tablet (768–1024px): confirm whether full desktop nav fits at 1024px; if not,
  fall back to the mobile hamburger pattern at that breakpoint too
- Nav markup must use semantic <nav aria-label="Primary"> and a real <ul>/<li> link
  list (see AEO section) - not div soup

FOOTER SPEC:
- Dark navy (#1B2A3D) background, white/muted text
- Top CTA banner strip immediately above the footer (dark navy, "Let's build AI
  systems that drive real business value." + two buttons: "Book Free AI Audit"
  amber, "Request a Pilot" outline) - confirm in wireframe whether this banner is
  part of Footer component or a separate homepage section; if it's reused on every
  page, include it in the Footer component
- Logo + one-line description, left column
- Social icons row: LinkedIn, X/Twitter, YouTube, GitHub (line icons, 24px, per
  docx icon spec) - each with descriptive aria-label, real absolute href
- Link columns: Services (AI Strategy, AI Development, AI Ops, AI Training) |
  AI Startups (Startup AI Ops Hub) | Company (About, Our Work, Contact) |
  Legal (Privacy Policy, Terms of Service) - every link points to the correct URL
  from the approved sitemap (05_Sitemap), even if that page doesn't exist yet
- Bottom bar: "© 2026 Life180 Labs. All rights reserved." left,
  "Built in India. Serving globally." right
- Footer markup uses <footer role="contentinfo"> with semantic <nav> per link column
- Responsive: 4-column grid desktop → 2-column tablet → stacked single column
  mobile, columns collapse in the order shown in the wireframe

VISUAL PARITY METHOD (do this, not "eyeball it"):
1. Before coding, list every color, font-size, weight, and spacing value you'll use,
   sourced from the docx/xlsx tokens above - no invented values.
2. Build the components.
3. Take a browser screenshot of the rendered Navbar and Footer at 375px, 768px, and
   1440px widths.
4. Overlay/compare each screenshot against the matching region of
   L180_HomePage Wireframe.png. List every pixel-level discrepancy found
   (spacing, alignment, font size, color) and fix it - do not mark done with known
   deltas. If a wireframe element is genuinely ambiguous (e.g. exact px gap), default
   to the nearest token in the spacing scale (4/8/16/24/32/48/64/80/100) rather than
   guessing an arbitrary number.
5. Re-screenshot after fixes and confirm zero remaining discrepancies before
   reporting done.

SEO DELIVERABLES (generate as real files in the repo, not descriptions):
- sitemap.xml - homepage entry now; include commented-out <url> placeholders for the
  other 12 approved sitemap pages + 404, sourced from 05_Sitemap URLs, so it's ready
  to uncomment as pages ship
- robots.txt - allow all, reference sitemap.xml location
- llms.txt - plain-language summary of Life180 Labs, what the site offers, and links
  to key pages, formatted per the emerging llms.txt convention, for LLM/answer-engine
  crawlers
- JSON-LD on the homepage <head>, combining:
  - Organization schema (name, logo, url, sameAs → the four social links,
    description from docx brand essence copy)
  - Service schema for each of the 4 services in the nav dropdown (AI Strategy,
    AI Development, AI Ops, AI Training), minimal valid instances linking to their
    (future) service page URLs
  - FAQ schema ONLY if the homepage wireframe actually contains an FAQ section -
    do not invent Q&A content that isn't in the wireframe; if none exists, skip and
    note it as N/A rather than fabricating one
  - Article schema is not applicable to the homepage - skip it here, it belongs on
    Content Hub / case study pages when built
- OpenGraph + Twitter Card metadata in <head>: og:title, og:description, og:image,
  og:url, og:type=website, twitter:card=summary_large_image - copy sourced from the
  homepage hero/brand-essence text already in index.html or the docx, not invented
- Canonical URL tag on the homepage (<link rel="canonical" href=".../">)
- Breadcrumbs: homepage is the root, so a visible breadcrumb trail isn't needed on
  Home itself - instead build the breadcrumb component (with BreadcrumbList JSON-LD)
  as a reusable partial so inner pages can drop it in later; do not render a fake
  breadcrumb on the homepage

AEO REQUIREMENTS (apply across homepage + components):
- Use semantic HTML throughout: <header>, <nav>, <main>, <section>, <article> where
  appropriate, <footer> - no generic <div> for structural regions
- Any homepage copy block that reads as a question-answer pattern (e.g. "Why
  Life180 Labs" / differentiator sections) should use a real, visible H2 or H3
  phrased as the question a user/answer-engine would ask, followed by a concise,
  answer-first paragraph (lead with the direct answer in the first sentence,
  elaborate after) - only reformat sections that already exist in the wireframe,
  don't invent new copy blocks
- Ensure one and only one <h1> on the page (the hero headline), correct heading
  hierarchy below it (no skipped levels)
- Internal links: every nav item, footer link, and in-body CTA must use descriptive
  link text (not "click here") and point to the correct sitemap URL
- Author/entity information: since this is a company site not a blog post, represent
  entity info via the Organization JSON-LD (above) rather than a byline - do not add
  a fake author name
- All interactive/structured content must remain readable with CSS/JS disabled
  (progressive enhancement) - nav links and footer links must be real <a href>
  elements, not JS-only handlers, so crawlers and answer engines can read them
  without executing scripts

CONSTRAINTS:
- No new dependencies unless index.html already uses them
- Reuse existing CSS custom properties in index.html (--navy, --orange, etc.) -
  extend them to match the docx hex values exactly if any currently differ
- Components must be drop-in reusable (e.g. partials/includes or JS components -
  match whatever templating approach the rest of the repo uses; if none exists,
  use plain includable HTML fragments + shared CSS/JS files)
- Do not touch homepage body sections (hero, cards, sitemap block) beyond wiring
  them to the new Navbar/Footer components
- Do not fabricate content, stats, testimonials, or copy anywhere (schema, meta
  tags, AEO headings) that isn't already present in the wireframe/docx/xlsx sources
```

---

## Definition of Done

**Navbar/Footer**
- [ ] Navbar and Footer exist as standalone, reusable files (not copy-pasted per page)
- [ ] Every color/font-size/weight/line-height matches the docx exactly; all spacing uses only the approved scale
- [ ] Nav links, dropdown items, CTA copy, footer columns, social icons, and bottom-bar copy match the wireframe exactly
- [ ] Verified responsive at 375px / 768px / 1440px with screenshots diffed against the wireframe - zero unreviewed discrepancies
- [ ] Mobile nav: CTA stays visible in header; hamburger opens accordion Services; 44px min tap targets
- [ ] Sticky/scroll behavior works, no layout shift; dropdown closes on outside click/link click/Escape
- [ ] Keyboard navigable with visible focus states
- [ ] Zero regressions to non-nav/footer homepage sections

**SEO**
- [ ] sitemap.xml exists, valid XML, homepage listed live, other 12 pages present as commented placeholders with correct URLs from 05_Sitemap
- [ ] robots.txt exists and references sitemap.xml
- [ ] llms.txt exists, accurate, no invented claims
- [ ] Organization JSON-LD present and validates in Google's Rich Results Test / Schema.org validator
- [ ] Service JSON-LD present for all 4 services, valid, correct URLs
- [ ] FAQ schema included only if an FAQ section exists on the wireframe; otherwise explicitly marked N/A (not silently skipped without note)
- [ ] OpenGraph + Twitter Card tags present, all values sourced from real site copy, og:image resolves to an actual image
- [ ] Canonical tag present on homepage, correct absolute URL
- [ ] Breadcrumb component + BreadcrumbList JSON-LD built as reusable partial, not rendered fake on homepage

**AEO**
- [ ] Exactly one `<h1>`, correct heading hierarchy, no skipped levels
- [ ] All structural regions use semantic HTML tags, not generic divs
- [ ] Any question-style section uses a real H2/H3 phrased as a question with an answer-first opening sentence - only where that content already exists in the wireframe
- [ ] All nav/footer/CTA links are real `<a href>` with descriptive text, functional with JS disabled
- [ ] No fabricated stats, quotes, author names, or Q&A content anywhere in markup or schema
- [ ] JSON-LD validates with zero errors/warnings in schema.org validator
