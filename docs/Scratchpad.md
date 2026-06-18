# Scratchpad

A working document for links, ideas and notes. Paste a link (with optional notes) and it gets organised below.

---

## Business Process

- Late payment statutory interest is 8% + BoE base rate (B2B); calculate daily rate as annual interest ÷ 365, then issue a new invoice. [[ref]](https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt)

## Positioning & Identity

- **"Design Engineer"** is gaining traction but is primarily a design systems / product company term (GitHub, Stripe, Adobe). Risks meaning nothing to SME clients. Lineage: web designer → UI/UX dev → front-end dev → creative technologist → design engineer. [[ref]](https://zeroheight.com/blog/design-engineer/)
- Alternative titles worth considering: **Creative Technologist**, Design Technologist, UX Engineer — better for signalling dual design+build skills to industry peers.
- **Current title "Freelance Web Developer & Designer"** remains strongest for client-facing use. Consider **Creative Technologist** or **Front-end Developer & Designer** for LinkedIn/peer-facing contexts.

## Tools & Assets

### CSS Tools

#### Fonts & Typography

- Curated directory of freely-licensed typefaces across serif, sans, display, monospace, and slab categories. [[freefaces.gallery]](https://www.freefaces.gallery/)
- Independent type foundry with 50+ families — most include at least one free weight, full families on a pay-what-you-want model. [[atipofoundry.com]](https://www.atipofoundry.com/)

#### General

- Fluid type and space scale calculator — generates clamp-based CSS that interpolates between min/max screen sizes without breakpoints. [[utopia.fyi]](https://utopia.fyi/)
- 500+ CSS custom properties (design tokens) covering color, spacing, typography, shadows, and animations — use via CDN or npm, no prescriptive component styles. [[open-props.style]](https://open-props.style/)
- Lightweight JS library for adding interactivity directly in HTML markup via attributes — no build step, minimal footprint. [[alpinejs.dev]](https://alpinejs.dev/)
- Eleventy starter with Lightning CSS and Esbuild — practical CSS architecture and lightweight patterns for fast, adaptable sites. [[web-grease]](https://web-grease.netlify.app/)
- Extremely fast CSS parser, transformer, bundler, and minifier written in Rust — handles vendor prefixing, nesting, and modern syntax transforms. [[lightningcss.dev]](https://lightningcss.dev/)
- Minimalist classless CSS framework — styles semantic HTML elements directly with no JS dependencies, good for rapid prototyping. [[picocss.com]](https://picocss.com/)
- Web Components UI library built on vanilla CSS and JS — no build step, HTML-first, pairs well with static site generators. [[kelpui.com]](https://kelpui.com/)
- Pre-built video/audio player themes using Media Chrome Web Components — copy-paste into any framework, CSS-customisable. Made by Mux. [[player.style]](https://player.style/)
- Curated collection of reusable CSS animation and transition snippets — copy-paste ready. [[transitions.dev]](https://transitions.dev/)
- 600+ pure CSS loading animations, single `<div>` only — organised into 40+ categories, copy-paste code. By Temani Afif. [[css-loaders.com]](https://css-loaders.com/)
- Visual generator for glassmorphism CSS — adjust blur, opacity, and saturation to produce `backdrop-filter` frosted glass effects, copy-paste output. [[ui.glass]](https://ui.glass/generator)
- Syntax highlighter using TextMate grammars — runs at build time (zero browser runtime), accurate highlighting for 100+ languages and themes. [[shiki.style]](https://shiki.style/)

#### Code Quality & Review

- Browser-based CSS auditing tool — flags legacy hacks, repeated literal values (token candidates), and duplicate declarations to accelerate stylesheet cleanup. Files never leave your machine. [[ReliCSS]](https://www.alwaystwisted.com/relicss/about)
- Automated accessibility testing tool — runs against any URL or local page and reports WCAG violations with line-level detail. [[pa11y]](https://bitsofco.de/pa11y/)
- MDN Baseline — standardised browser compatibility indicator: **Widely available** = supported 2.5+ years across all major browsers; **Newly available** = works in latest versions only. Use as a quick cross-browser safety signal alongside caniuse. [[MDN]](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility)

### CSS Notes & Ideas

- **Dark/light mode with user override** — use `:root:not([data-user-color-scheme])` to apply `prefers-color-scheme` only when the user hasn't set a manual preference via JS/localStorage. Treats OS setting as a default, not a source of truth. Degrades gracefully: no JS still gets system dark mode. [[piccalil.li]](https://piccalil.li/blog/create-a-user-controlled-dark-or-light-mode/)
- **Design tokens & theming — three approaches worth combining for the rebuild:**
  - **Heydon's native Eleventy approach** — tokens in `_data/tokens.json`, a Nunjucks template with a custom permalink outputs `css/theme.css` by interpolating token values directly into CSS custom property declarations. Same data can populate `manifest.json` or any other output. No extra tooling. [[heydonworks.com]](https://heydonworks.com/article/design-tokens-in-eleventy/)
  - **Harry Cresswell's YAML pipeline** — YAML as single source of truth, converted to JSON (Eleventy templates/styleguide) and SCSS (CSS custom properties). More complex but drives a living styleguide page. [[harrycresswell.com]](https://harrycresswell.com/writing/design-tokens-styleguides-eleventy/)
  - **Andy Bell's three-layer semantic architecture** — raw tokens → semantic aliases → component variables. Components reference semantic properties with fallbacks: `var(--button-bg, var(--color-surface-bg))`. Themes only override a handful of variables; his dark theme was 43 lines. [[piccalil.li]](https://piccalil.li/blog/how-were-approaching-theming-with-modern-css/)
  - **Rebuild recommendation:** use Heydon's token management (tokens in `_data`, output via Nunjucks template) + Bell's semantic layering. Evaluate whether Gorko is still needed or can be replaced by this simpler native approach.
- **Modern CSS table styling** — use `color-mix()` for zebra stripes from a single token; scrollable table wrappers need `role="region"`, `aria-labelledby`, and `tabindex="0"` for keyboard access; don't use Grid (breaks native a11y); sticky `<th>` borders need a pseudo-element fix. [[piccalil.li]](https://piccalil.li/blog/styling-tables-the-modern-css-way/)
- **Claude skill idea: browser support evaluator** — based on Josh Comeau's three-factor framework (fallback experience, your actual browser breakdown, potential harm), a `/browser-support` skill could take a CSS feature name, check caniuse data, and walk through the three factors to give a project-specific recommendation rather than a raw percentage. [[joshwcomeau.com]](https://www.joshwcomeau.com/css/browser-support/)
- **Always develop on Fast 3G throttling** — keep Chrome DevTools network throttle on Fast 3G to surface loading states, race conditions, and flakiness that are invisible on localhost. Pair with MSW ([msw.io](https://mswjs.io/)) for full control over simulated responses. [[via @kettanaito]](https://x.com/kettanaito/status/1692197084500234716)

### CSS Notes & Ideas — Fun Stuff

- **Free tool idea** — W3C WAI decision tree for choosing the correct `alt` attribute strategy across different image types (decorative, functional, complex, text-in-image, etc.). [[w3.org]](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- **Fun idea to use all web safe colours** — full W3C extended colour keyword list (140 named CSS colours). [[w3.org]](https://www.w3.org/wiki/CSS3/Color/Extended_color_keywords)
- **Fun idea to count HTML tags** — using Python's HTMLParser to tally tag occurrences across an HTML document; could be a fun diagnostic tool for a site audit. [[leportella.com]](https://leportella.com/htmlparser-count-tags/)

### Advanced CSS Stretch Goals

- [ ] Roll our own lightweight utility covering two abandoned-but-useful library patterns:
  - **Scroll-triggered animations** ([sal.js](https://mciastek.github.io/sal/) — last updated 2023): trigger CSS animations via `IntersectionObserver` as elements enter the viewport
  - **Reactive browser state** ([Tornis](https://tornis.robbowen.digital/) — last updated 2023): subscribe to scroll position, pointer position, and viewport size via `requestAnimationFrame`
  - Both are well-served by native APIs now — the goal is a thin, dependency-free wrapper that ties them together with a consistent interface

## Articles & Reading

## To-dos & Ideas

## Client & Larger Project Tools

Tools evaluated and set aside for the personal site rebuild — too heavy, too opinionated, or freemium-gated for a lightweight portfolio — but worth reaching for on client work or larger app projects.

- **[Motion](https://motion.dev/)** — production-grade animation library for JS, React, and Vue. Spring physics, scroll-linked animations, layout transitions, gesture handling. Core library is free/MIT; Motion+ (£299 one-time) adds premium components, AI kit, and 400+ examples. Cited as up to 90% smaller than GSAP. Overkill for a personal site but the go-to for client work needing rich animation.
- **[Web Awesome](https://webawesome.com/docs)** — Web Components UI library by Fonticons (Font Awesome). Framework-agnostic, accessible, CDN-friendly. Freemium: some components (charts, advanced forms) are Pro-only. Evolved from the Shoelace design system. Good fit for client sites or app projects needing a production-grade component library without framework lock-in.
- **[Sevalla](https://sevalla.com/)** (by Kinsta) — Full-stack hosting platform covering static sites, app hosting, managed databases, and S3-compatible object storage under one roof. Usage-based pricing, 25 data centres, 260+ edge PoPs. Overkill for a static site (Netlify wins there), but worth considering for client projects that need a backend or managed database alongside the frontend.
- **[Surge](https://surge.sh/)** — CLI-only static site host; `surge` in your terminal and you're live in seconds with a free subdomain or custom domain. No dashboard, no config. Not a Netlify replacement but ideal for spinning up quick client demos or throwaway prototypes.

## Eleventy Plugins & Patterns

- **[eleventy-reusable-components](https://github.com/MWDelaney/eleventy-reusable-components-example-project)** — single-file component format for Eleventy; define markup, data model, styles, and JS in one file (Vue SFC-style) and use anywhere in your templates. Actively maintained (last updated Aug 2025).
- **[eleventy-from-notion](https://jsr.io/@vrugtehagel/eleventy-from-notion)** — Eleventy plugin to import Notion pages directly as content in your project. Use Notion as a CMS for an 11ty site.

### Official Eleventy Plugins [[docs]](https://www.11ty.dev/docs/plugins/)

| Plugin | Purpose |
|---|---|
| Image | Resize and generate optimised images |
| Fetch | Fetch and cache network requests at build time |
| `<is-land>` | Lazy/conditional loading of client-side components |
| Render | Render an Eleventy template string or file inside another template |
| i18n | Manage pages and links across localised content |
| RSS | Generate RSS/Atom feeds |
| Syntax Highlighting | PrismJS code highlighting, no client-side JS |
| Navigation | Hierarchical nav with Eleventy collections |
| Bundle | Bundle small chunks of CSS/JS/HTML inline |
| InputPath to URL | Map input file paths to output URLs |
| HTML `<base>` | Emulate `<base>` by prefixing all URLs in HTML output |
| Id Attribute | Auto-add `id` attributes to headings |
| Directory Output | Console output grouped by directory with file sizes |
| Inclusive Language | Flag non-inclusive language in Markdown |
| Upgrade Helper | Assists migration between major Eleventy versions |

## Eleventy Themes

Reference starters — most are a few years old but useful for patterns and architecture ideas.

- **[Eleventastic](https://github.com/maxboeck/eleventastic)** (Max Böck) — minimal Eleventy starter kit. Last updated 2023.
- **[11ty-base](https://github.com/Andy-set-studio/11ty-base)** (Andy Bell) — bare-bones base project from the creator of CUBE CSS. Last updated 2023.
- **[Eleventyone](https://github.com/philhawksworth/eleventyone)** (Phil Hawksworth) — quick-start scaffold from a core Eleventy contributor. Last updated 2024.
- **[Hylia](https://github.com/Andy-set-studio/hylia)** (Andy Bell) — lightweight starter for blogs and personal sites, design-opinionated. Last updated 2021.
- **[Supermaya](https://github.com/MadeByMike/supermaya)** (Mike Riethmuller) — feature-rich starter with CMS integration patterns. Last updated 2023.
- **[eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog)** (Google) — performance-first blog template; good reference for image optimisation and Core Web Vitals patterns. Last updated 2024.

## Blogroll Candidates
