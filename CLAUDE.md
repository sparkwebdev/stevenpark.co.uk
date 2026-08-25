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

## Content rebuild in progress

As of branch `2026-update--content-rebuild`, `src/pages/`, `src/posts/`, `src/_includes/partials/`,
and `src/_includes/layouts/` have been cleared for a from-scratch content/sitemap rebuild — only a
minimal `layouts/base.html` and placeholder `src/index.html` remain so the build stays green.
The architecture/collections/pipeline notes above describe the intended shape of the site once
rebuilt, not its current contents. See `docs/rebuild.md` for planning context. The Known
Issues/Exceptions previously logged here referenced files that no longer exist post-wipe — revisit
and re-document as equivalent situations resurface during the rebuild, don't assume they're
resolved.
