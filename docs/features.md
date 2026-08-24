# Features Documentation

Index of all site features: data structure, current state, and tasks.

Data files live in `src/_data/`. Source materials and working files in `features/`.

---

## Web Dev Articles

**URL:** `/journal/web-dev-articles/`

**What it is:** A curated "best of" web development articles gallery. Focuses on technically durable, historically significant, or principle-based reads—pieces where the resonance lives on despite age, or that serve as historical waypoints in the tech journey.

**Data file:** `src/_data/webDevArticles.json`

**Structure:**
- `keep` array (16 entries): solid-gold references with full metadata (title, author, URL)
- `maybe` array (16 entries): candidate articles under review with status notes
- Each entry has: `title`, `author`, `url`, `notes` (for maybe pile), `verified` flag

**Current state:**
- Keep pile: 16 curated articles (all with working URLs)
- Maybe pile: 16 candidates (some with incomplete URLs, marked as "pending")
- All articles render with link previews (cached metadata via `linkPreview` filter)

**Status:** ⚠️ Not production ready

**Still to do:**
1. Curate the Maybe pile: decide which candidates to promote to Keep
2. Resolve "pending" URLs (3 entries with no direct link)
3. Potentially expand Keep pile as new gold-standard articles are discovered
4. Consider adding read/watch status or personal notes per article

**Related files:**
- Source: `/Resources/CareerHub/features/articles.md` (original curation notes)
- Template: `src/pages/journal/web-dev-articles.html`

---

## Music Collection

**URL:** `/journal/music/`

**What it is:** A fully verified inventory of personal CD and vinyl records with cover art and metadata. All 314 records physically verified against collection.

**Data files:** 
- `src/_data/musicCollection.json` (314 records)
- `src/_data/cd_covers.json` (CD cover art cache, 7.0 MB base64 thumbnails)
- `src/_data/vinyl_covers.json` (vinyl cover art cache, 7.7 MB base64 thumbnails)

**Structure:**
- Records array with fields: `artist`, `album`, `media_type`, `format`, `catalogue_number`, `barcode`, `label`, `date`, `genre`, `verified`
- Cover art: base64-encoded thumbnails (CD covers use `data_uri`, vinyl covers use `b64` + `mime`)

**Current state:**
- 314 records verified (171 CDs + 143 vinyl)
- Cover art: 100% vinyl (143/143), 98.8% CDs (169/171)
- Metadata coverage: dates 93% (281/303), genres 88% (268/303)
- All records physically verified; barcode lookups via MusicBrainz, iTunes, Discogs

**Status:** ✅ Production ready (core data)

**Features not yet carried over (from collection.html, available for later):**
- **Full-text search** — artist, album, catalogue number search
- **Media type filter** — toggle All/CD/Vinyl (currently displayed as single grid)
- **Genre filter** — multi-select filter by genre tag
- **Sort controls** — sort by date, artist, album (currently reverse-chronological only)
- **Faceted browsing** — genre/media type facet counts

**Still to do:**
- Locate cover art for 2 remaining CDs (Genaro - *A Safe Passage*, Norken - *Spring In A Small Town*)
- Optional: consolidate CD and vinyl cover cache schemas (currently separate `data_uri` vs `b64`+`mime`)
- Optional: implement search/filter/sort features if needed for browsing (deferred pending UX goals)

**Related files:**
- Template: `src/pages/journal/music/index.html`
- Scanner app: `/Desktop/vinyl-scanner/` (separate project for barcode scanning, used to build vinyl side)

---

## Coffee Collection

**URL:** `/journal/coffee/`

**What it is:** Personal log of whole-bean coffees rated on a Sage Barista Express Impress. Split into Pre-Covid and New lists due to post-covid sensory changes affecting taste (scores not directly comparable between lists).

**Data file:** `src/_data/coffeeCollection.json`

**Live source:** `/Users/stevenpark/Library/CloudStorage/Dropbox/Resources/ClaudeHub/lists-and-tastes/coffee-ratings.md` (updated via `log-coffee` skill in Claude Desktop)

**Structure:**
- `roaster`, `coffee` (name), `list` (precovid/new), `rating` (1-10), `tasting_notes`, `tags` (array), `buy_url`, `logo` (base64 data URI)

**Current state:**
- 41 records total (21 Pre-Covid + 20 New)
- All roaster logos embedded as base64 (fetched live from roaster websites, cropped/auto-brightened for readability)
- Ratings split into two lists with visual badges to avoid confusion due to sensory differences

**Status:** ✅ Live (with sync pending)

**Open questions:**
- **Data syncing:** Coffee logging happens live in Claude Desktop (markdown source), but site displays static JSON snapshot. How to keep them in sync? Options: (1) periodic manual export/update, (2) automated script to read markdown and update JSON, (3) generate JSON on-demand at build time. Decision deferred pending workflow clarity.

**Still to do:**
- Sync new entries from live markdown source to site data

**Related files:**
- Live source: `/Resources/ClaudeHub/lists-and-tastes/coffee-ratings.md`
- Template: `src/pages/journal/coffee/index.html`
- Log skill: `log-coffee` in Claude Desktop (updates markdown + artifact viewer)

---

## Today I Learned (TiL)

**URL:** `/journal/til/`

**What it is:** A curated knowledge base of surprising, verifiable facts in the style of Tom Whitwell's "52 Things I Learned"—terse, specific, dry wit, often with striking numbers. Each fact has a "learned" date (discovery date, anchored to publication year), category, source, and confidence rating.

**Data files:**
- `src/_data/tilCollection.json` (live data, 143 entries)
- Source: `features/til/keep.json` (curated entries)
- Reference: `features/til/reject.json` (709 rejected entries, kept to avoid repeating similar ideas)

**Structure:**
- `id` (slug), `date` (YYYY-MM-DD), `title` (under 15 words), `body` (1-3 sentences), `type` (general/web-dev), `category`, `source` (URL), `confidence` (high/medium)

**Curation Philosophy:**

**Style:** Facts with agents doing something absurd/extreme/numerically striking (not passive announcements like "a species was discovered"). Prefer production-history war stories, institutional mischief, policy-that-actually-worked with clear mechanisms, web/tech oddities, vivid historical scenes.

**Geographic boost:** Scotland-based curator deliberately overweights UK/Ireland/Scotland content (corporate mischief, policy, industry behind-the-scenes).

**Personal interests:** Electronic/experimental music history (IDM, Warp Records, Aphex Twin, Boards of Canada), fingerstyle guitar, CSS/web standards, WCAG accessibility, Dieter Rams design, coffee/espresso science, cult cinema/animation, literary canon (Joyce, Tolstoy, Vonnegut, McCarthy, DFW).

**Avoid:** Passive "new species discovered" press releases; generic space-object-discovery stories; plain "X was named after Y" origin anecdotes.

**Already covered:** ~60 facts explicitly flagged to avoid repetition (in `portable-research-prompt.md`).

**Current state:**
- Live on site with 143 facts grouped by year (2025, 2026)
- Facts displayed with type badges (general/web-dev), category tags, optional confidence indicators, source links
- Page includes attribution to Tom Whitwell's "52 Things I Learned" series
- Data quality: working in progress (not fact-checked, somewhat curated, will be refined over time)

**Status:** ✅ Live (content quality: 🔨 In progress)

**Still to do:**
1. Fact-check and refine quality of existing 143 entries
2. Implement filtering options (by category, by type, by confidence)
3. Setup continuous curation workflow (new candidates → review → merge into keep.json)
4. Broaden topic waypoints in curation rubric (currently somewhat restrictive)

**Related files:**
- `features/til/keep.json`: Working set of facts (143 entries — 17% acceptance rate from 852 candidates)
- `features/til/reject.json`: Reference of rejected facts (709 entries — kept to avoid repeating similar ideas)
- `features/til/portable-research-prompt.md`: Detailed curation rubric, style guide, already-covered list, research methodology
- `features/til/README.md`: Feature documentation and workflow notes
- `scripts/generate_preview.py`: Interactive HTML review tool (in CareerHub, takes candidates.json, generates checkboxes for each fact, outputs JSON array of kept IDs to merge back)

---

## Testimonials

**URL:** `/pitch/testimonials/`

**What it is:** Curated testimonials from past clients/collaborators. Currently 10 entries with emphasis on key phrases and company/location context.

**Data file:** `src/_data/testimonials.json`

**Structure:**
- Array of 10 entries: `id`, `name`, `company`, `location`, `project`, `quoteHtml` (with `<em><strong>` emphasis)

**Current state:**
- 10 curated testimonials (condensed from original longer list)
- Quote emphasis preserved via HTML markup
- All verified against source

**Status:** ✅ Production ready

**Still to do:**
- Gathering: "To chase — new testimonials" section noted in source (deferred to later phase)

**Related files:**
- Source: `/Resources/CareerHub/01-site-rebuild/site-content/testimonials.md`
- Template: `src/pages/pitch/testimonials.html`

---

## Summary by Status

| Feature | Status | URL | Data file | Notes |
|---------|--------|-----|-----------|-------|
| Web Dev Articles | ⚠️ Not ready | `/journal/web-dev-articles/` | `webDevArticles.json` | Awaiting Maybe pile curation |
| Music Collection | ✅ Ready | `/journal/music/` | `musicCollection.json` + covers | 2 missing CD covers |
| Coffee Collection | ✅ Ready | `/journal/coffee/` | `coffeeCollection.json` | Complete |
| Testimonials | ✅ Ready | `/pitch/testimonials/` | `testimonials.json` | Future: gather new ones |
| Today I Learned | 🔨 In progress | `/journal/til/` | (planned) | Source data ready, needs integration |
