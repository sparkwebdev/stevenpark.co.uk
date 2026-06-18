# Code Snippets

A catalogue of concrete, copy-paste-ready code patterns and techniques for the site rebuild.

---

## CSS Tables

Source: [Styling Tables the Modern CSS Way — piccalil.li](https://piccalil.li/blog/styling-tables-the-modern-css-way/)

### Accessible scrollable table wrapper

Overflow containers need these attributes or keyboard/screen reader users can't navigate the table:

```html
<div
  role="region"
  aria-labelledby="table-caption-id"
  tabindex="0"
  style="overflow-x: auto;"
>
  <table>
    <caption id="table-caption-id">Table title</caption>
    ...
  </table>
</div>
```

```css
/* Visible focus ring on the scroll container */
[role="region"][tabindex]:focus-visible {
  outline: 2px solid var(--color-focus);
}
```

### Zebra stripes via color-mix()

Derive the stripe colour from a single token rather than hardcoding two values:

```css
tbody tr:nth-child(odd) {
  background-color: color-mix(in srgb, var(--color-surface) 90%, var(--color-text));
}
```

### Sticky column header with border fix

`position: sticky` causes `<th>` borders to detach on scroll. Use a pseudo-element to fake them:

```css
thead th {
  position: sticky;
  top: 0;
  background: var(--color-surface);
}

thead th::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  bottom: 0;
  width: 100%;
  border-bottom: 2px solid var(--color-border);
}
```

### Responsive fixed layout

Balance equal column widths with a minimum readable column size:

```css
table {
  table-layout: fixed;
  width: 100%;
}

th, td {
  width: max(10rem, 100% / var(--col-count));
}
```

### Notes

- Always use semantic elements: `<thead>`, `<tbody>`, `<tfoot>`, `scope` attributes on `<th>`
- Do **not** use CSS Grid for table layout — it breaks native browser accessibility semantics
- Use logical properties (`border-block`, `text-align: start`) for i18n support

---

## Favicons

Source: [How to Favicon in 2021 — Evil Martians](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)

### The short version — 5 files + 1 JSON

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180×180 -->

<!-- PWA only -->
<link rel="manifest" href="/manifest.webmanifest">
```

```json
// manifest.webmanifest
{
  "icons": [
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-mask.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

### Why each file

| File | Purpose |
|---|---|
| `favicon.ico` (32×32) | Legacy browsers, RSS readers, tools that request `/favicon.ico` directly — must live at root, no cache-busting. `sizes="32x32"` stops Chrome preferring it over SVG. |
| `icon.svg` | Modern browsers (72%+ support). Smaller than raster, supports dark mode via embedded `@media (prefers-color-scheme: dark)` in a `<style>` tag. |
| `apple-touch-icon.png` (180×180) | iOS home screen since iOS 8. Add 20px padding + background colour. |
| `icon-192.png` | Android home screen via manifest. |
| `icon-mask.png` (512×512 maskable) | Android adaptive icon launchers crop to a circle/shape — needs extra padding. Validate at [maskable.app](https://maskable.app). Safe zone is a 409×409 circle. |
| `icon-512.png` | PWA splash screens. |

### Gotchas

- Never use `rel="shortcut"` — invalid HTML; use `rel="icon"`
- SVG dark mode: edit as text, add `<style>` with `@media (prefers-color-scheme: dark)`
- Obsolete and skippable: Windows tile icons, Safari pinned tab SVGs, Opera Coast icons

---

## Animated Radial Gradient Background (Orbiting Blobs)

Source: [CodePen by Ana Tudor (@thebabydino)](https://codepen.io/thebabydino/pen/poKeMZd)

Each colour blob is a `radial-gradient` whose position is calculated from an angle using `cos()`/`sin()`. `@property` registers each angle as a typed custom property so the browser can interpolate it — without this, CSS can't tween custom property values. Each angle animates from its start value to `start - 360deg`, making the blob orbit in a circle. Varying durations and `animation-direction: reverse` on some creates the lava-lamp effect.

**SCSS version (original — requires a build step):**

```scss
$col: #f94144, #f3722c, #f8961e, #90be6d, #43aa8b, #577590;
$n: length($col);
$grd: ();
$ani: ();

@for $i from 0 to $n {
  $t: (1.5 + random(5))*1s;
  $d: random(100)*$t/100;
  $a: random(360)*1deg;

  @property --a#{$i} {
    syntax: '<angle>';
    initial-value: #{$a};
    inherits: false
  }

  @keyframes a#{$i} { to { --a#{$i}: #{$a - 360deg} } }

  $ani: $ani, a#{$i} $t (-1*$d)
    if(random(100) < 50, #{unquote(' ')}, reverse);

  $x: calc(50%*(1 + .5*cos(var(--a#{$i}))));
  $y: calc(50%*(1 + .5*sin(var(--a#{$i}))));
  $grd: $grd,
    radial-gradient(circle at $x $y, nth($col, $i + 1), #0000 35%)
}

html {
  min-height: 100%;
  background: $grd #f9c74f;
  animation: $ani;
  animation-timing-function: linear;
  animation-iteration-count: infinite
}
```

**Vanilla CSS equivalent (2 blobs to show the pattern):**

```css
/* Register each angle as a typed property so it can be animated */
@property --a0 {
  syntax: '<angle>';
  initial-value: 45deg;
  inherits: false;
}
@property --a1 {
  syntax: '<angle>';
  initial-value: 200deg;
  inherits: false;
}

@keyframes orbit0 { to { --a0: -315deg; } } /* 45 - 360 */
@keyframes orbit1 { to { --a1: -160deg; } } /* 200 - 360 */

html {
  min-height: 100%;
  background:
    radial-gradient(circle at
      calc(50% * (1 + .5 * cos(var(--a0))))
      calc(50% * (1 + .5 * sin(var(--a0)))),
      #f94144, transparent 35%),
    radial-gradient(circle at
      calc(50% * (1 + .5 * cos(var(--a1))))
      calc(50% * (1 + .5 * sin(var(--a1)))),
      #577590, transparent 35%)
    #f9c74f;
  animation:
    orbit0 4s -1.2s linear infinite,
    orbit1 6s -3s linear infinite reverse;
}
```

### Key concepts

- **`@property` with `syntax: '<angle>'`** — the only way to animate a CSS custom property; without type registration the browser doesn't know how to interpolate it
- **`cos()` / `sin()`** — native CSS math functions (Baseline: widely available); no JS needed for trigonometry
- **Negative `animation-delay`** — starts the animation mid-orbit so blobs don't all begin at the same position
- **`animation-direction: reverse`** on some blobs adds orbital complexity with no extra keyframes

---

## Images

### Animate native lazy-loaded images

Source: [Animate Native Lazy Loading — medienbaecker.com](https://medienbaecker.com/articles/animate-native-lazy-loading)

CSS can't detect when an image finishes loading (no `:loaded` pseudo-class), so JS is needed. The `@media (scripting: enabled)` guard means images remain visible if JS is absent:

```html
<img src="image.jpg" width="800" height="600" loading="lazy" alt="...">
```

```css
/* Only hide if JS is available — prevents invisible images if JS fails */
@media (scripting: enabled) {
  [loading="lazy"] {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
}
```

```js
document.querySelectorAll('[loading="lazy"]').forEach(img => {
  const show = () => { img.style.opacity = 1; };
  // .complete catches already-cached images that won't fire 'load'
  img.complete ? show() : img.addEventListener('load', show);
});
```

### Notes

- Always set explicit `width` and `height` on `<img>` — prevents layout shift while image loads
- The `scripting: enabled` media query is the progressive enhancement hook — no JS = images show at full opacity from the start

---

## Form Elements

### Styled `<select>` dropdown

Source: [CSS Select Styles — sliderrevolution.com](https://www.sliderrevolution.com/resources/css-select-styles/)

`appearance: none` strips the browser default, then a custom SVG arrow is added via `background-image`:

```css
.select-wrapper {
  position: relative;
  display: inline-block;
}

select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 0.5em 2.5em 0.5em 0.75em;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  cursor: pointer;

  /* Custom arrow via inline SVG */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75em center;
}

select:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Notes

- The `<select>` dropdown list (`<option>` items) cannot be styled with CSS — only the closed state is styleable
- For fully custom dropdown appearance, a JS-driven custom component is required (at the cost of accessibility complexity)
- Always preserve a visible `:focus-visible` state for keyboard users

---

## Animated Borders

Source: [How to Animate Borders in CSS — letsbuildui.dev](https://www.letsbuildui.dev/articles/how-to-animate-borders-in-css/)

CSS `border` can't be animated directly for most effects — the techniques below use pseudo-elements or SVG to fake it.

### 1. Rotating gradient border

A `::before` pseudo-element with a gradient background spins behind the card, clipped by the parent's `overflow: hidden`:

```css
.card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  z-index: 0;
}

.card::before {
  content: "";
  position: absolute;
  inset: -50%; /* larger than parent so rotation doesn't show corners */
  background: conic-gradient(
    from 0deg,
    hsl(197 100% 64%),
    hsl(339 100% 55%),
    hsl(197 100% 64%)
  );
  animation: rotate 4s linear infinite;
  z-index: -1;
}

/* Inner fill to create the "border" illusion */
.card::after {
  content: "";
  position: absolute;
  inset: 2px; /* controls border width */
  background: var(--color-surface);
  border-radius: 6px;
  z-index: -1;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}
```

### 2. Glimmer / shimmer sweep

A narrow gradient stripe rotates around the element's centre — creates a single travelling highlight rather than a full gradient border:

```css
.card::before {
  content: "";
  position: absolute;
  inset: -50%;
  width: 80px; /* narrow stripe */
  background: linear-gradient(
    transparent,
    hsl(197 100% 80% / 0.6),
    transparent
  );
  transform-origin: center center;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { transform: rotate(360deg); }
}
```

### 3. SVG stroke draw

Cleanest approach for partial or draw-on effects — no overflow hacks needed:

```html
<div class="card">
  <svg class="border" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="1" y="1" width="98" height="98" rx="4" />
  </svg>
</div>
```

```css
.card {
  position: relative;
}

.border {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.border rect {
  fill: none;
  stroke: hsl(197 100% 64%);
  stroke-width: 2;
  stroke-dasharray: 400; /* roughly the perimeter */
  stroke-dashoffset: 400;
  animation: draw 1.5s ease forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

### Notes

- The rotating gradient technique requires `overflow: hidden` on the parent — check this doesn't clip content you need
- `conic-gradient` is cleaner than `linear-gradient` for full rotation effects
- SVG stroke is the best choice when you want a partial draw-on animation or precise control over which sides animate

---

## Frosted Glass / `backdrop-filter`

### Basic glassmorphism

Generator: [ui.glass/generator](https://ui.glass/generator)

```css
.glass {
  background: rgb(255 255 255 / 0.15);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgb(255 255 255 / 0.25);
  border-radius: 8px;
}
```

### Sticky header blur — extend and mask (Josh Comeau technique)

Source: [The Magic of CSS `backdrop-filter` — joshwcomeau.com](https://www.joshwcomeau.com/css/backdrop-filter/)

The blur algorithm only samples pixels directly behind the element — content just about to scroll into view isn't blurred yet, causing a hard edge. Fix: extend the blurred element to 200% height and mask the bottom half away:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  /* Visible part — no blur here, just background */
}

.header::before {
  content: "";
  position: absolute;
  inset: 0;
  height: 200%; /* extend downward */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  mask-image: linear-gradient(
    to bottom,
    black 0% 50%,   /* visible — the actual header area */
    transparent 50% 100% /* hidden — but still sampled for blur */
  );
  pointer-events: none; /* mask hides visually but not functionally */
  z-index: -1;
}
```

### Depth-based blur (Shu's technique)

Source: [frosted-glass.shud.in](https://frosted-glass.shud.in/)

Divide the element into vertical slices via `::mask-image`, each with an independently adjustable `--blur`. JS updates `--blur` per slice based on 3D tilt to simulate real optical depth:

```html
<!-- 8 spans = 8 slices, each covering full element -->
<div class="card">
  <span style="--blur: 2px"></span>
  <span style="--blur: 4px"></span>
  <span style="--blur: 8px"></span>
  <!-- ... -->
</div>
```

```css
.card {
  position: relative;
  perspective: 1000px;
}

.card span {
  display: block;
  position: absolute;
  inset: -40px; /* bleed past edges */
  --x: 50%;     /* horizontal centre of this slice — set per nth-child */
  --offset: 50%;
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));

  /* Mask: show only a vertical column centred on --x */
  mask-image:
    linear-gradient(to right,
      transparent calc(var(--x) - var(--offset)),
      black       calc(var(--x) - var(--offset) / 2),
      black       calc(var(--x) + var(--offset) / 2),
      transparent calc(var(--x) + var(--offset))
    ),
    /* Fade edges top/bottom so blur doesn't bleed outside card */
    linear-gradient(to bottom, transparent 40px, black 44px, black calc(100% - 44px), transparent calc(100% - 40px)),
    linear-gradient(to right,  transparent 40px, black 44px, black calc(100% - 44px), transparent calc(100% - 40px));
  mask-composite: intersect;
}

/* Position each slice */
.card span:nth-child(1) { --x: 11.11%; }
.card span:nth-child(2) { --x: 22.22%; }
.card span:nth-child(3) { --x: 33.33%; }
.card span:nth-child(4) { --x: 44.44%; }
.card span:nth-child(5) { --x: 55.55%; }
.card span:nth-child(6) { --x: 66.66%; }
.card span:nth-child(7) { --x: 77.77%; }
.card span:nth-child(8) { --x: 88.88%; }
```

### Gotchas

- Always include `-webkit-backdrop-filter` prefix for Safari
- `pointer-events: none` required when using mask overlays — the masked area still intercepts clicks
- Firefox: `backdrop-filter` breaks on `position: sticky` elements when any ancestor has both `overflow` and `border-radius`
- Rounded corners break the mask approach — use an SVG mask as a workaround

---

## Highlighted Text (`::selection`, `<mark>`)

Source: [A Brief Note on Highlighted Text — Adrian Roselli](https://adrianroselli.com/2024/05/a-brief-note-on-highlighted-text.html)

Once you define custom highlight colours you own the contrast — browser defaults are off the hook, yours aren't.

**WCAG requirements:**
- Highlight background vs. page background: **3:1** minimum (SC 1.4.11)
- Text vs. highlight background: **4.5:1** (3:1 for large or bold text) (SC 1.4.3)

```css
/* ::selection — only background-color, color, text-decoration, text-shadow are valid */
::selection {
  background-color: #005fcc; /* check 3:1 against page bg */
  color: #ffffff;            /* check 4.5:1 against above */
}

/* <mark> element — inline highlighted/searched text */
mark {
  background-color: #ffdd00;
  color: #1b1c1e;
  padding-inline: 0.1em;
}

/* Respect forced colours (Windows High Contrast Mode) */
@media (forced-colors: active) {
  mark {
    background-color: Highlight;
    color: HighlightText;
  }
}
```

### Notes

- Borders and outlines are disallowed on `::selection` — they cause layout shifts
- Also applies to `::target-text`, `::spelling-error`, `::grammar-error`
- Test contrast with [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) — pick both colours manually

---

## Colour: Avoid Pure Black

Pure `#000000` creates harsh, unnatural contrast — nothing in the physical world is truly black. Use a near-black with a slight undertone instead.

**Preferred options:**

| Token | Hex | Character |
|---|---|---|
| `--color-black` | `#1B1C1E` | Slightly warm, Apple-esque |
| `--color-black` | `#121212` | Material Design dark surface standard |
| `--color-black` | `#191919` | Neutral near-black |

```css
:root {
  --color-black: #1B1C1E; /* or #121212 / #191919 */
}

body {
  color: var(--color-black);
}
```

### Notes

- Same principle applies to dark mode backgrounds — `#121212` is the Material Design spec for dark surfaces
- Pair with an off-white (e.g. `#F5F5F5`, `#FAFAFA`) rather than pure `#FFFFFF` for the same reason
