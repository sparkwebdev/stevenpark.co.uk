# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # dev server (Eleventy + Parcel CSS watchers in parallel)
npm run build    # production build (clean → Parcel CSS → Eleventy)
npm run clean    # delete dist/ and src/_includes/css/critical.css
```

Dev runs three processes concurrently via `npm-run-all`:
- `dev:11ty` — Eleventy with live reload
- `dev:parcel` — watches `src/assets/scss/common.scss` → `dist/css/`
- `dev:critical` — watches `src/assets/scss/critical.scss` → `src/_includes/css/`

There is no lint or test script at root level. The `tests/` directory contains only a `vrc/` subdirectory (visual regression check); it is not wired to a test command.

## Architecture

### Static site generator
This is an [Eleventy](https://www.11ty.dev/) (v3) personal portfolio/blog site deployed to Netlify. Source is in `src/`, output goes to `dist/`.

Template engine: Nunjucks (`.html` and `.njk`), with Markdown (`.md`) for blog posts. All three use Nunjucks for templating (`markdownTemplateEngine`, `htmlTemplateEngine`, and `dataTemplateEngine` are all set to `njk`).

### Configuration split
`.eleventy.js` is the entry point but delegates everything to modules in `eleventyConfig/`:
| File | Responsibility |
|---|---|
| `createCollection.js` | Factory for all Eleventy collections (sorted newest-first, optional filter/limit) |
| `filters.js` | Custom Nunjucks filters: `cssmin`, `jsmin`, `readableDate`, `htmlDateString`, `urlmatch`, `head`, `menu`, `getPageBySlug`, `logme` |
| `tagCollection.js` | Builds the `tagList` collection from all post tags |
| `layouts.js` | Layout aliases: `base`, `page`, `posts`, `post`, `portfolio` |
| `markdown.js` | markdown-it with `markdown-it-anchor` and `markdown-it-attrs`; inline code blocks disabled |
| `assets.js` | Passthrough copy for images, fonts, and root static files |
| `browserSync.js` | BrowserSync dev server config |

### CSS pipeline
SCSS is compiled by **Parcel** (not Eleventy). Two entry points:
- `src/assets/scss/common.scss` → `dist/css/common.css` — main stylesheet loaded on every page
- `src/assets/scss/critical.scss` → `src/_includes/css/critical.css` — inlined per-page critical CSS (currently commented out in base layout)

Design tokens are powered by **[Gorko](https://github.com/hankchizljaw/gorko)**. All sizes, colors, fonts, and breakpoints are defined in `src/assets/scss/_config.scss`. Use `get-size('600')`, `get-color('brand-1')`, `apply-utility('font', 'base')`, and `media-query('sm')` helpers throughout SCSS.

Breakpoints: `sm` 37em · `md` 44em · `lg` 62em.

In production, HTML is minified via `src/transforms/html-min-transform.js` (html-minifier-terser). This transform only runs when `NODE_ENV=production`.

### JS
Inline JS only — no bundler for JavaScript. `src/assets/js/app.js` and `src/assets/js/form.js` are included raw via Nunjucks `{% include %}` and output inline in `<script>` tags at the bottom of the base layout. The `jsmin` Nunjucks filter can minify them but is currently commented out.

### Content structure
```
src/
  pages/          # Static pages
    work/
      portfolio/  # Portfolio items (.html, date-prefixed filenames)
    about/        # About, FAQs, Testimonials
  posts/          # Blog content (Markdown)
    articles/     # permalink: /articles/{slug}/
    tutorials/    # permalink: /tutorials/{slug}/
    resources/    # permalink: /resources/{slug}/
  _data/          # Global data files
    metadata.json # Site title, URL, author, social links, availability status
    navigation.json # Primary and support nav menus (has "online" flag per item)
    testimonials.json
  _includes/
    layouts/      # base, home, page, post, posts, portfolio
    partials/     # header, footer, nav, meta, preview cards, etc.
  _links/         # Cached link preview metadata (SHA1-named JSON files)
  misc/           # Misc pages (e.g., 404)
  transforms/     # html-min-transform.js
```

Directory data files (`.json` in each content folder) set `layout` and `permalink` patterns for their siblings.

### Collections defined in `.eleventy.js`
| Name | Source | Notes |
|---|---|---|
| `portfolio` | `pages/work/portfolio/*.html` | All items |
| `featuredPortfolio` | same | Filtered to `data.featured === true` |
| `blog` | `posts/**/*.md` | All posts |
| `blogLatest` | same | Limit 2 |
| `articles` | `posts/articles/*.md` | |
| `resources` | `posts/resources/*.md` | |
| `tutorials` | `posts/tutorials/*.md` | |
| `tagList` | all content | Unique tags, excludes `all`, `nav`, `post`, `posts` |

All collections are sorted newest-first (`.reverse()`).

### Link previews
`helpers/linkPreview.js` is an async Nunjucks filter (`linkPreview`) that fetches Open Graph/JSON-LD metadata for external links and renders a styled card. Results are cached as SHA1-named JSON files in `src/_links/` — commit these cache files to avoid re-scraping.

### Navigation visibility
The `navigation.json` `"online"` flag controls whether a nav item is shown. Pages with `"online": false` are hidden from the rendered nav.

### Deployment
Netlify: `npm run build` → publish `dist/`. Node 18. Security headers set globally. Two permanent redirects: `/services` → `/work/services`, `/portfolio` → `/work`.

## Known Issues (Unresolved)

Real bugs, deliberately left unfixed for now because the straightforward fix causes a worse regression. Don't attempt a quick patch without reading the history below.

1. **`<figcaption>` isn't a direct child of `<figure>`** in `image-group.html`'s `"row"`/`"thirds"` variants (affects `bandstands`, `galbani`) — HTML requires `figcaption` to be `figure`'s direct child; it currently sits inside the last `.image-group__row-*` div instead. Unwrapping it breaks `_image-group.scss`'s `"thirds"` caption overlay at `md`, which depends on the caption being a grid item *inside* that row's own `grid-template-rows: 74% auto 8rem` split (grid placement only works on direct children). Tried unifying everything into one grid on `<figure>` itself, but percentage row-tracks on an auto-height container hit a real CSS circular-sizing bug — same values resolved to a 1282px-tall figure in one run and a 2px-collapsed one in another. `position: absolute` on just the caption sidesteps this and works, but trades away the caption being a true grid-flow item — open question whether that's acceptable, or whether the container needs a definite height (`aspect-ratio`) instead. Reverted for now; needs a proper design pass.

## Known Exceptions

Decisions that look like bugs or lint noise but are intentional — don't "fix" these without reading the reasoning first.

- **`role="list"` on `<ul>`/`<ol>` elements** (`tagslist.html`, `portfolio.html`, `page-header--blog.html`, `social-links.html`, `about-this-site.html`) — required, not redundant. `src/assets/scss/resets/more-modern-modified.scss` scopes `list-style: none` to `:where(ul[role="list"], ol[role="list"])`, so removing the attribute both regresses accessibility (Safari/VoiceOver still strips list semantics from a `<ul>` once `list-style: none` is applied — still true as of 2026) and brings back bullet points, since the CSS selector depends on it too. `.htmlvalidate.json`'s `no-redundant-role` rule excludes the `list` role value specifically (`"exclude": ["list"]`) rather than being disabled outright, so it still catches genuinely redundant roles elsewhere (e.g. `role="button"` on a `<button>`).
- **`role="img"` on meaningful emoji spans** (`about-this-site.html`, release-notes icon legend) — a bare `<span>` has implicit ARIA role `generic`, which prohibits an accessible name entirely, so `aria-labelledby` on one is simply invalid HTML/ARIA (not just unhelpful). `role="img"` makes it a legitimate nameable icon so the `aria-labelledby` reference to the visually-hidden legend (`icon-feature`, `icon-improvement`, etc.) actually works — functionally equivalent to `<img alt="…">`. Only applies to icons that carry real meaning per the legend; purely decorative emoji should stay `aria-hidden="true"` with no label instead.
