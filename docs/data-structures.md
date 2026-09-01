# Data Structures

Living reference for the JSON collections in `src/_data/`. For each: fields, the reference standard it's modelled on (if any), and how it handles media.

**Third-party formats:** prefer open, non-proprietary, well-supported/catalogued standards over bespoke or scraped ones.

**Data ownership:** third-party APIs are fine for lookups/enrichment, but the source of truth for what we display is our own committed JSON in `src/_data/`, not a live dependency on someone else's API.

**Reference standards — two-tier:** an open database/API (Open Library, MusicBrainz, Untappd) is a data *source*, not necessarily the right schema/shape to imitate. **[Schema.org](https://schema.org)** is the primary reference standard for *shape and vocabulary* across collections — open, non-proprietary, purpose-built for websites describing their own content, with a real payoff (structured data / rich search results). Domain-specific standards (ISBN, ISRC, EXIF, BJCP, SCA) layer in underneath for identifiers/ratings schema.org doesn't define.

---

## Schema.org mapping per collection

| Collection | Type | Notes |
|---|---|---|
| `bookCollection.json` | `Book` | `author`/`format` object-wrapped; `review.reviewRating`/`reviewBody`/`datePublished` for rating/notes/date. `status` dropped (see below) |
| `musicCollection.json` | `MusicRelease` | `catalogue_number`→`catalogNumber`, `genres`→`genre` (array) match natively; `artist`→`byArtist`, `label`→`recordLabel` object-wrapped |
| `beerCollection.json` | `Product` | `userRating`→`review.reviewRating`; `brewery`→`brand`; `abv`/`ibu`→`additionalProperty` (PropertyValue). `globalRating` dropped, not migrated |
| `coffeeCollection.json` | `Product` | `roaster`→`brand`; `rating`→`review.reviewRating`; `tasting_notes`→`description`; `list`→`review.datePublished`; `buy_url`→`offers.url` |
| `randomThoughts.json` | `SocialMediaPosting` | `content`→`articleBody`, `date`→`datePublished`, `tags`→`keywords`. `status` dropped |
| `tilCollection.json` | `Article` | `title`→`headline`, `body`→`description`, `date`→`datePublished`, `source`→`citation`, `category`/`type`→`keywords`. `confidence` dropped |
| `webDevArticles.json` | `Article` | `description`/`image`/`keywords` sourced from existing `_links/` OG-metadata cache; `image` cached locally; `author` object-wrapped |
| `testimonials.json` | `Quotation` (not `Review` — self-published-review guidelines + no `itemReviewed`) | `name`→`creator` (Person), `company`→`creator.worksFor` (Organization), `location`→`creator.worksFor.address`, `quoteHtml`→`text`. `project` dropped |
| `photographyCatalogue.json` | Not built — see speculative mapping below | — |

**Cross-cutting:** schema.org expects "who made this" fields as Person/Organization/Brand objects, not flat strings — applied everywhere above. No `AggregateRating` appears anywhere in this site's data (beer's `globalRating` deliberately excluded, not migrated).

**Domain-specific standards underneath schema.org:**
- Books: ISBN (ISO 2108)
- Music: ISRC/ISWC identifiers; MusicBrainz used only as a data source, not the schema
- Beer: Untappd (scraped)
- Coffee: SCA Cupping Protocol / Q Grading — not required, using own notes
- Photography (not built): EXIF, realistic/auto-embedded by iPhone. IPTC out of scope — personal snaps, not photojournalism content

---

## Collection notes

**`bookCollection.json`** — 27 entries (19 books, 8 audiobooks). `isbn`/`editionKey`/`format` backfilled via Open Library (26/27 resolved; "Alan Partridge: Big Beacon" has no OL edition data). 7/27 have no cover art in OL. `status` (reading-progress) dropped entirely — never used (all 27 were `already-read`); if revisited, model as a schema.org `ReadAction` (`actionStatus`/`startTime`) rather than a flat enum, to support rereads.

**`musicCollection.json`** — 314 records (171 CD, 143 vinyl), static archive. Reference standard is MusicBrainz, not Discogs (open, nonprofit, CC0/PDDL vs. Discogs' auth-gated API). `id` is array order = physical shelf order — meaningful, never reorder. Covers migrated off base64 (`vinyl_covers.json`/`cd_covers.json`, now deleted) to `src/assets/img/music-covers/{id}.jpg` (312/314; 2 unresolved). `genres`: consolidated from 154 raw words into 23 fixed buckets (self-curated, not folksonomy). `barcode` present on 177/314 — usable as a future cross-collection bridge (see `docs/features.md`).

**`coffeeCollection.json`** — 41 records, self-curated tasting log. `tasting_notes`→`description` (not `review.reviewBody`) — confirmed roaster-published product data, not personal review text; present independent of whether a rating exists.

**`beerCollection.json`** — 179 records, personal Untappd log. `globalRating` (Untappd community average) dropped entirely — not our data, not wanted, no `AggregateRating` used as a substitute.

**`webDevArticles.json`** — 32 entries (16 keep, 16 maybe). All description/image/keyword data sourced from the existing `_links/` cache (Open Graph metadata), not fabricated. One broken `og:image` (pointed at source site's homepage) caught by content-type validation, left without an image rather than saving bad data.

**`testimonials.json`** — 10 entries. `project` dropped — only 2/10 had a value, no matching case study to link to. **Open question:** `company` (Zotefoams, e.fundamentals) does match real case-study pages — worth a future `about`/case-study link via `Quotation.about`, not implemented.

---

## `photographyCatalogue.json` — speculative future mapping (not built)

Sketched against real planned content ideas (`CareerHub/_inbox.md` → "Photography Collection Ideas"). Not one homogeneous archive — several distinct content shapes:

| Planned idea | Best-fit type |
|---|---|
| Travel logs, Fife Coastal Path notes, Glasgow guide | `ImageGallery` (or `Article` if narrative-led), `contentLocation`→`Place` |
| Food/eating-out map | `Map` + `Place` entries — not a photo collection conceptually |
| Furniture builds / maker projects | `HowTo` if step-by-step, else `ImageGallery`/`Article` |
| Illustrated food (hand-drawn) | `VisualArtwork`, not `Photograph` — schema.org distinguishes drawings from photos |
| Individual photo (atomic unit) | `Photograph` (more accurate than generic `ImageObject`) |

Expect multiple sub-collections (`travelLogs.json`, `makerProjects.json`, etc.) each with their own type, not one flat archive, when this is actually built.

---

## Media caching policy

Cache third-party media locally under `src/assets/img/{collection}/` rather than hotlinking or embedding base64 — applies to every `src/_data/` collection. Pattern: download once at data-entry time, reference by local path in the JSON. `vinyl_covers.json`/`cd_covers.json`'s old base64 approach is the one pattern actively avoided going forward.

---

## Open questions

- **`keywords`/tag-like data has no shared taxonomy** across collections (TIL, coffee, random thoughts, music genres each use their own vocabulary) — a common tagging schema would enable cross-collection browsing, deferred.
- **Photography** data structure not yet designed beyond the speculative mapping above.

---

## Data audit page

`/internal/data-audit/` — unlinked from nav, internal reference for data-cleansing work. Shows field-completeness counts (missing vs. present) per collection, covering all 8 migrated collections.
