# Data Structures

Living reference for the JSON collections in `src/_data/`. For each: fields (required/optional), the reference standard it's modelled on (if any), whether our data actually conforms to that standard, alternatives considered, and how it handles media. Also tracks progress toward common ground across collections.

Maintained by the `data-structure` agent (`.claude/agents/data-structure.md`) — update this file rather than letting findings live only in chat.

**Principle for third-party formats:** prefer open, non-proprietary, well-supported/catalogued standards with reliable data integrity over bespoke or scraped ones.

**Principle for data ownership:** the data should belong to us, not live only inside a third party. Third-party APIs/sources are fine to *use* — for lookups, enrichment, reference standards, initial import — but the source of truth for what we display should be our own committed JSON in `src/_data/`, not a live dependency on someone else's API/database staying up, unchanged, and accessible. This is separate from the media-caching policy above (which is about files); this is about the structured data itself. Not something we audit/score — just a standing design principle to apply when adding or reviewing a collection.

**Principle for reference standards — two-tier (revised August 2026):** an open *database/API* (Open Library, MusicBrainz, Untappd) is a data **source**, not necessarily the right schema/shape to imitate — its structure reflects that organization's own app, which may be more complex (nested, relational) than a flat personal JSON file needs. **[Schema.org](https://schema.org)** is now the primary reference standard for *shape and vocabulary* across collections — an open, non-proprietary, extremely well-documented vocabulary purpose-built for websites describing their own content, with a real practical payoff (structured data / rich search results). Domain-specific standards (ISBN, ISRC, EXIF, BJCP, SCA) layer in underneath for identifiers/ratings schema.org doesn't define. See "Schema.org mapping" below for the full per-collection audit. Full reasoning: `docs/decision-log.md` → "Schema.org as the primary reference standard (turning point)".

---

## Review status

*Whether a collection has had the full field-by-field / standards-conformance review this document is meant to capture — as opposed to only appearing in the high-level survey table below.*

| Collection | Reviewed? |
|---|---|
| `bookCollection.json` | ✅ Reviewed (see detailed evaluation below) |
| `musicCollection.json` | ✅ Reviewed and cleansed — see below |
| `beerCollection.json` | Not yet |
| `coffeeCollection.json` | ✅ Reviewed and migrated |
| `tilCollection.json` | ✅ Reviewed and migrated |
| `randomThoughts.json` | ✅ Reviewed and migrated |
| `webDevArticles.json` | ✅ Reviewed and cleansed — see below |
| `photographyCatalogue.json` | Not yet |
| `testimonials.json` | ✅ Reviewed and cleansed — see below |
| `vinyl_covers.json` / `cd_covers.json` | Deleted (superseded by `musicCollection.json`'s `coverUrl`) |

---

## Survey status

| Collection | Reference standard | Conformance | Media handling | Notes |
|---|---|---|---|---|
| `bookCollection.json` | Open Library Works/Editions/Covers/Reading Log APIs | Partial — conforms on `status` and `coverUrl` pattern; Work-level key only (no edition/ISBN); `dateFinished` unused. See full evaluation below | `coverUrl` — hotlinked from `covers.openlibrary.org` using OL's documented Covers API pattern, not cached | Full field-by-field evaluation in the section below |
| `musicCollection.json` | **MusicBrainz** Release schema — the direct music equivalent of Open Library (nonprofit, CC0/PDDL, no auth/paywall for lookups) | Data conceptually maps cleanly (artist/album/date/barcode/label/catalogue-number all have direct MB equivalents); `genres` renamed + reshaped to array to match MB's own field, consolidated into 23 fixed buckets (self-curated, not MB's folksonomy tags) | `coverUrl` — cached locally under `src/assets/img/music-covers/`, id-referenced | See "musicCollection.json — notes" below |
| `beerCollection.json` | Untappd (via `beerId`, `untappdUrl`) | Data sourced from Untappd but reshaped into custom flat fields | `imageUrl` — hotlinked from Untappd's CDN, not cached | Untappd has no fully open public API for this kind of export; data is likely scraped/manually logged |
| `coffeeCollection.json` | None — custom shape | Custom | `logo` — self-hosted under `/assets/img/coffee-logos/` | Only collection so far that self-hosts its images rather than hotlinking |
| `tilCollection.json` | None — custom shape, loosely article/note-like | Custom | No media | Has `source` (external URL) as a citation field — different concept from cover-art media |
| `randomThoughts.json` | None — micro-post shape, loosely comparable to a minimal ActivityPub/JSON Feed item | Custom, currently placeholder/lorem-ipsum content | No media | `status: "published"` field — worth reconciling with `bookCollection`'s `status` semantics (different meaning: workflow state vs. reading-progress state) |
| `webDevArticles.json` | Loosely JSON Feed / bookmark-list shape | Custom, minimal (title/author/url only) | No media | Simplest collection — good candidate for early "common structure" experiments since it's low-risk |
| `photographyCatalogue.json` | None yet — currently just a description string, not real item data | N/A | Not yet — this is the biggest open media question (large photo archive, storage/hosting undecided) | Flagged as a "needs its own data structure" item, not yet designed |
| `testimonials.json` | None — custom shape | Custom | No media | Stores rendered `quoteHtml` rather than raw quote text — a formatting decision, not a structural one |
| `navigation.json` | Not a lifestream collection — site nav config | N/A | N/A | Out of scope for this document |

---

## Schema.org mapping — audit (August 2026)

*Proposed schema.org type per collection, and field-level findings. Audit only — no data files changed yet. No data loss identified anywhere; costs are structural (reshaping) or require value-translation tables.*

**Cross-cutting finding:** schema.org expects "who made this" fields (`author`, `byArtist`, `brand`, `recordLabel`) as Person/Organization **objects**. Every collection currently stores these as flat strings. This is a wrap (`"Bob Mortimer"` → `{"@type":"Person","name":"Bob Mortimer"}`), not a deletion, but touches most records in most collections if pursued for full literal conformance — noted once here rather than repeated below.

| Collection | Schema.org type | Fields that map cleanly | Fields needing reshape/translation | Fields with no equivalent (stay custom) |
|---|---|---|---|---|
| `bookCollection.json` | `Book` | `title`→`name`, `isbn`, `coverUrl`→`image`, `publishYear`→`datePublished` | `author` (object-wrap, not yet done), `format`→`bookFormat` (enum, not yet done); `rating`/`notes`→`review.reviewRating`/`review.reviewBody`, `dateFinished`→`review.datePublished` — **done**; `yearRead` dropped | `status` — personal reading-progress tracking isn't part of `Book` |
| `musicCollection.json` ✅ | `MusicRelease` | `album`→`name`, `catalogue_number`→`catalogNumber` (**exact match already**), `date`→`datePublished`, `genres`→`genre` (**already array — matches natively**), `coverUrl`→`image`, `barcode`→`identifier` — **all done** | `artist`→`byArtist`, `label`→`recordLabel` — full nested objects, **done**; `media_type`→`musicReleaseFormat` (enum, not yet done) | — |
| `beerCollection.json` ✅ | `Product` | `name`, `imageUrl`→`image`, `untappdUrl`→`sameAs` | `userRating`→`review.reviewRating` — **done**; `brewery`→`brand`, `abv`/`ibu`→`additionalProperty` — signed off, not yet implemented in data | — (`globalRating` deliberately dropped, not migrated) |
| `coffeeCollection.json` ✅ | `Product` | `coffee`→`name`, `logo`→`image`, `tags`→`keywords` (already array) | `roaster`→`brand`, `rating`→`review.reviewRating`, `tasting_notes`→`description`, `list`→`review.datePublished`, `buy_url`→`offers.url` — all done | — |
| `randomThoughts.json` ✅ | `SocialMediaPosting` | `content`→`articleBody`, `date`→`datePublished`, `tags`→`keywords` (array, matches) | — | — (`status` dropped) |
| `tilCollection.json` ✅ | `Article` | `title`→`headline`, `body`→`description` (corrected — not `articleBody`; entries are ~1-3 sentence capsule facts with no real article structure/content, so `description` is the honest fit), `date`→`datePublished`, `source`→`citation`, `category`/`type`→`keywords` (both feed the same property — `type` expected to grow tag-like, not stay a fixed section) | — | — (`confidence` dropped) |
| `webDevArticles.json` ✅ | `Article` | `title`→`headline`, `url`, `description`→`description` (pulled from existing `_links/` OG-metadata cache), `image`→`image` (downloaded/cached locally), `keywords`→`keywords` (Medium's internal junk values filtered out) | `author`→`author` — full nested `Person` object | — |
| `testimonials.json` ✅ | `Quotation` (corrected from `Review`) | `name`→`creator` (nested `Person`), `company`→`creator.worksFor` (`Organization`), `location`→`creator.worksFor.address`, `quoteHtml`→`text` | — | `project` dropped |
| `photographyCatalogue.json` (not built) | Several — see speculative mapping below | — | — | Not one flat archive — see "photographyCatalogue.json — speculative future mapping" |

**Domain-specific standards layered underneath schema.org (unchanged from earlier decisions, now explicitly secondary to schema.org for shape):**
- Books: ISBN (ISO 2108) — already adopted
- Music: ISRC/ISWC (recording/work identifiers); MusicBrainz remains a *data source* for lookups, not the schema
- Beer: Untappd (scraped)
- Coffee: SCA Cupping Protocol / Q Grading — not required, using own notes
- Photography: EXIF (ISO, capture metadata) — realistic, auto-embedded by the iPhone camera, not yet built. IPTC Photo Metadata (captions/keywords/copyright) — considered, out of scope: these are personal snaps, not photojournalism-style tagged/captioned/copyrighted content, and nothing in the actual workflow (iPhone Camera/Photos app) generates it automatically the way EXIF is

**Status:** rating/review fields for books, coffee, and beer have been migrated to nested schema.org `Review`/`Rating` objects (`review.reviewRating`, `review.reviewBody`), following the confirmed full-literal-conformance policy. `Review`/`Rating` is nested *within* the item type (`Book`, `Product`) — not a replacement for it. No `AggregateRating` appears anywhere in this site's data by deliberate choice (beer's `globalRating` was dropped, not migrated to it). Remaining object-wrap fields (`author`, `byArtist` for the un-migrated parts, `brand`, `recordLabel`) are signed off conceptually but not yet implemented in every collection — see each collection's notes section above for current status.

---

## `bookCollection.json` — detailed evaluation

*Reviewed against Open Library's Works API, Editions API, Covers API, and Reading Log API. 27 entries surveyed (19 books, 8 audiobooks); all currently `status: already-read` — no `currently-reading`/`want-to-read` entries exist yet.*

| Field | OL equivalent? | Assessment |
|---|---|---|
| `id` | None | Internal PK (`book-NNN`), fine to keep — OL has no concept of "my library row" |
| `type` | Loosely: OL Editions have a `physical_format` (e.g. "Audible Audio", "Audio CD") | Custom binary `book`/`audiobook`. Reasonable simplification, but see edition-key note below |
| `title` / `author` | OL Works `title`, `authors` | Conforms in spirit; we store author as a flat string rather than OL's structured author-key reference — fine for our scale |
| `coverUrl` | OL Covers API: `covers.openlibrary.org/b/$key/$value-$size.jpg` | **Conforms** — pattern used (`/b/id/{coverId}-M.jpg`) is exactly OL's documented format. But we store the full built URL rather than the raw cover ID + size separately, so we can't request a different size (S/L) without re-deriving the ID from the URL string |
| `publishYear` | OL Works/Editions `first_publish_year` | Conforms |
| `openLibraryKey` | OL **Work** key (`/works/OLxxxxxxW`) | Conforms as a Work-level reference. Note: this points to the abstract work, not the specific edition — an audiobook and its print counterpart share the same Work key, so nothing here distinguishes "I read the print edition" from "I listened to the Audible edition" beyond our own `type` field |
| `rating` | None (OL) / schema.org `Review.reviewRating` | **Remodeled.** No longer a flat field — nested under `review.reviewRating` as a schema.org `Rating` object (`ratingValue`, `bestRating: 10`, `worstRating: 0`). Personal, no OL equivalent, but schema.org has the right shape |
| `notes` | None (OL) / schema.org `Review.reviewBody` | **Remodeled.** Nested under `review.reviewBody` where present (1/27 entries has real content). `review` is `null` for entries with no rating |
| `yearRead` | Reading Log has per-entry timestamps, not just a year | **Dropped.** Superseded by `review.datePublished` — deriving the year from a real date field rather than keeping a separate coarser one |
| `dateFinished` | Reading Log `date` events | **Remodeled** into `review.datePublished` (schema.org `Review`'s own date field). Populated with a per-book date (year-precision, day/month set to 01-01) for all 27 entries — for unrated books, `review` holds only `datePublished` (no `reviewRating`), rather than staying `null` |
| `source` | None | Always `"manual"` across all entries — currently a no-op field, but plausibly forward-looking (e.g. future `"open-library-import"` provenance). Leave as-is |
| `addedAt` | None | ISO 8601 timestamp, fine |
| `status` | OL Reading Log shelves | **Dropped.** See "Currently Reading — dropped" below for reasoning and a proposed future implementation |
| `isbn` | OL Editions `isbn_13`/`isbn_10` | **Added and backfilled** via live Open Library API lookups (see below) — 26/27 entries now have a real ISBN |
| `editionKey` | OL **Edition** key (`/books/OLxxxxxxM`) | **Added and backfilled** the same way — the actual OL edition record, not guessed |
| `format` | OL Editions `physical_format` | **Added.** Backfilled from OL where the edition had it recorded; where OL had no `physical_format` value, defaulted to an assumed label (`Paperback` for books, `Audible Audio` for audiobooks) rather than leaving blank — these assumed values are not verified OL data, just reasonable defaults |

**Backfill results (August 2026):** Looked up all 27 works via the Open Library Editions API (`/works/{key}/editions.json`) and Search API (for the 4 entries missing a Work key). 26/27 resolved to a real edition with ISBN + edition key. The one exception, **book-008 "Alan Partridge: Big Beacon"**, resolves to a Work (`/works/OL37832210W`) with no edition data indexed in OL at all — nothing to backfill there until OL's own catalogue improves.

Cover art: confirmed via direct ISBN-based Covers API lookup (`?default=false`, checking for 404) that the 7 entries still missing `coverUrl` (book-004, 007, 008, 014, 017, 021, 022) have **no cover art indexed in Open Library under any key** — not a lookup-method gap, genuinely absent from OL's data. Nothing more to do there short of sourcing covers from elsewhere.

**Edition-level key discussion:** confirmed `type` (book/audiobook) was a custom field with no direct OL equivalent — OL tracks format at the edition level (`physical_format`), not as a Work-level flag. Decided to add both `editionKey` (real OL edition ID) and `format` (OL's own format vocabulary where available) to eventually let `type` be cross-checked against real OL data rather than staying a hand-set flag only.

**Subjects/genres** — OL Works expose a `subjects` list; still not captured. Left out of this pass — flagged as a future addition if tagging/filtering on the Bookshelf page becomes a priority.

**Currently Reading — dropped (August 2026).** `status` (`want-to-read`/`currently-reading`/`already-read`, adopted from Open Library's Reading Log shelf convention) has been removed from `bookCollection.json` entirely, along with the Bookshelf page's "Currently Reading" section and the data-audit page's status breakdown. Conclusion: no entry has ever actually used `currently-reading`/`want-to-read` (all 27 are `already-read`), so the feature was speculative scaffolding, not something backed by real data — a "nice to have," not a current need. Removing it now rather than carrying dead scaffolding; the concept can be revisited when it's actually wanted.

**Proposed future implementation, if revisited:** rather than reintroducing a flat `status` enum, model it as a genuine schema.org `Action` (specifically `ReadAction`), separate from the catalog record itself — this was flagged earlier in this document as the more correct long-term shape for "engagement with an item" (a book being read is an event with a start/actionStatus, not a static property of the book). Concretely: a `ReadAction` with `object` referencing the book (by `id`), `actionStatus` using schema.org's own enum (`PotentialActionStatus`/`ActiveActionStatus`/`CompletedActionStatus` — structurally identical to the old `want-to-read`/`currently-reading`/`already-read`), and `startTime`. This would also naturally support rereads (multiple `ReadAction`s per book), which a single `status` field never could. Not implemented — a proposal to evaluate if/when this becomes a real need again.

---

## `musicCollection.json` — notes

*314 records (171 CD, 143 vinyl) — a static personal archive, unlikely to grow. Kept succinct; not a full field-by-field table like books, since the data itself won't be re-fetched/re-verified.*

- **Reference standard: MusicBrainz**, not Discogs. Our field vocabulary superficially resembles Discogs' terminology (`catalogue_number`, `barcode`, `label`), but Discogs' live API is auth-gated/rate-limited — closer to Untappd's status in this document than to Open Library's. MusicBrainz is the actual open-data equivalent for music (nonprofit MetaBrainz Foundation, CC0/PDDL, no paywall), matching the same principle that led us to Open Library for books. Existing values map cleanly to MusicBrainz's Release schema (`artist`→`artist-credit`, `album`→`title`, `catalogue_number`→`label-info.catalog-number`, etc.) — no data lost or changed, just correctly labeled. For any *future* streaming-activity collection (Tidal/Spotify listens, liked tracks), **ListenBrainz** (MusicBrainz Foundation's open listening-history project) is the target standard — a different data domain, not a replacement for this one.
- **`id` field:** added as `music-NNN`, strictly array order. This order is not arbitrary — it's the physical order records were taken off/returned to the shelf, and is meant to be the default display sort. Documented here so the array is never "tidied"/reordered by mistake; new records should be appended, not inserted mid-array.
- **Media caching:** fixed — `vinyl_covers.json`/`cd_covers.json` (base64, keyed by fragile `"Artist|||Album"` strings) migrated to real files under `src/assets/img/music-covers/{id}.jpg`, referenced via the new `id`. 312/314 covers migrated; 2 records (Genaro – *A Safe Passage*, Norken – *Spring In A Small Town*) have no cover art in either source, unresolved.
- **`genres` field (was `genre`):** renamed to match MusicBrainz's own field name and reshaped from a single free-text string into an **array** of consolidated genre buckets — MusicBrainz's own `genres` field is likewise a list (crowd-tagged there; ours is self-curated, kept deliberately since our data isn't sparse/inconsistent the way folksonomy tags are). Raw data was 154 distinct genre words / 203 raw combo-strings across 314 records — consolidated down to **23 fixed buckets** (Techno, House, IDM / Ambient, Downtempo / Trip Hop, Drum and Bass / Dubstep, Electronic, Experimental / Leftfield, Electro, Synth-Pop / New Wave, Rock, Indie Rock, Alternative Rock, Art Rock, Post-Rock, Folk, Pop, Jazz, Funk / Soul / Disco, Blues / Roots / World, Hip Hop, Classical, Soundtrack, Reggae / Dub, Spoken Word / Other). Multi-genre records keep every matching bucket rather than being flattened to one — 186/314 have 2+, 82 have exactly 1, 46 have none (no original genre data).
- **Cross-collection bridge (planned, not yet built):** no identifier currently links this archive to a future streaming/listening collection. `barcode` (UPC, present on 177/314 records after promoting `barcode_draft` values) is immediately usable as a bridge via a link-resolution service. See "Listen on your platform" in `docs/features.md` for the concrete feature this enables. ISRC/MusicBrainz ID enrichment for full (track-level, not just album-level) coverage is a future nice-to-have, not urgent.
- **Dropped fields:** `catalogue_number_draft` (always empty, unused), `verified` (always `true` across all 314, no differentiating value), `barcode_draft` (17 values promoted into `barcode` where it was empty, 2 cross-assigned Meat Puppets entries checked and left correct, then dropped).

---

## `coffeeCollection.json` — notes

*41 records — self-curated personal tasting log. Reviewed against schema.org `Product`.*

- **`rating`→`review.reviewRating`**: personal opinion, correctly modeled as a schema.org `Review` (0–10 scale, `bestRating: 10`). `review` is `null` where there's no rating and no notes.
- **`roaster`→`roaster`**: full nested `Brand` object (`{"@type":"Brand","name":"..."}`), per the confirmed full-literal-conformance policy.
- **`tasting_notes`→`description`**, not `review.reviewBody`: confirmed via the live source (`coffee-ratings.md`) that this column sits alongside Origin/Roast/Process/URL — it's roaster-published product data, not Steven's own review text. Kept outside `review` entirely; present independent of whether a rating exists (8 entries have a description but no rating).
- **`list` (precovid/new) dropped**, replaced by `review.datePublished` — the correct schema.org home for "when," matching the same shape used elsewhere.

---

## `beerCollection.json` — notes

*179 records — personal Untappd log. Reviewed against schema.org `Product`.*

- **`userRating`→`review.reviewRating`**: Steven's own rating (0–5 scale, `bestRating: 5`), correctly modeled as a schema.org `Review`. `review` is `null` where unrated (4 entries). Done.
- **`globalRating` dropped entirely** — this was Untappd's community-average rating, not Steven's own opinion. Schema.org has a distinct type for exactly this (`AggregateRating`), but it was deliberately excluded rather than migrated: not our data, not something we want to store or display on this site. No `AggregateRating` appears anywhere in this collection as a result — this is intentional, not a gap to fill later. Done.
- **`brewery`→`brand`**: full nested `Organization`-style object (`{"@type":"Brand","name":"..."}`). Done.
- **`abv`/`ibu`→`additionalProperty`**: array of `PropertyValue` objects (`{"@type":"PropertyValue","name":"ABV","value":3.4,"unitText":"%"}`). Where a value was genuinely absent (some entries have no IBU), the `PropertyValue` is omitted entirely rather than kept with a `null` value. Done — new `propValue(array, name)` Nunjucks filter added (`eleventyConfig/filters.js`) to look these up in templates.

---

## `webDevArticles.json` — notes

*32 entries (16 keep, 16 maybe) — curated bookmark list. Reviewed against schema.org `Article`.*

- **`description`/`image`/`keywords` — pulled from the existing `_links/{sha1(url)}.json` cache**, not fabricated. This cache already exists (committed to the repo, populated by the `linkPreview` Nunjucks filter from each link's Open Graph/JSON-LD metadata) and was already being used to render link-preview cards on the page — this migration just formalizes those same values as the schema.org properties they actually are, and stores the resolved values directly on each `webDevArticles.json` entry rather than only deriving them at render time.
  - `description`: OG/general meta description — genuinely a short summary, correctly modeled as `Article.description` (not `articleBody`, since we don't host the source article's content).
  - `image`: OG/Twitter image, downloaded and cached locally under `src/assets/img/webdev-article-covers/`, per the site's media caching policy — not hotlinked. One entry (Madalyn Parker's accessibility-testing article) had a broken `og:image` value on the source site (pointing at their homepage, not an image) — caught by validating actual downloaded content, not just checking the URL existed; left with no `image` rather than saving a bogus HTML file.
  - `keywords`: only where the source data was genuinely usable — 11/32 entries had any keyword data at all, and Medium's JSON-LD mixes real tags (`"Tag:CSS"`) with internal workflow metadata (`"LayerCake:3"`, `"LockedPostSource:..."`); only the real tags were extracted, junk filtered out, rest left absent rather than guessed.
- **`author`→`author`**: full nested `Person` object, per the confirmed full-literal-conformance policy.
- The page template (`src/pages/journal/web-dev-articles.html`) still primarily renders cards via the `linkPreview` filter (which independently re-derives description/image from the same cache each time) rather than the newly-stored fields — the two aren't yet consolidated into one render path. Not a conformance issue, just a duplication worth resolving later if the template is revisited.

---

## `testimonials.json` — notes

*10 testimonials. Reviewed against schema.org — type corrected from `Review` to `Quotation` during design review.*

- **Type corrected: `Quotation`, not `Review`.** Two separate reasons, not just one: (1) Google's structured data guidelines specifically discourage/penalize `Review`/`AggregateRating` markup for self-published reviews of your own business on your own site, without third-party/neutral verification — exactly this situation, even though the quotes themselves are genuine. (2) `Review`'s entire structural purpose is being *about* something (`itemReviewed`), which we don't model — `Quotation` carries no such implicit claim, so that gap disappears rather than needing to be filled.
- **`name`→`creator`**: full nested `Person` object.
- **`company`→`creator.worksFor`**: `Organization`, a real official `Person` property — not a stretch, this is precisely what `worksFor` means.
- **`quoteHtml`→`text`**: kept as HTML (not converted to plain text) — `Quotation.text`/`CreativeWork.text` is typed as plain `Text` in the schema.org spec, but this is our own display field, not literal JSON-LD output; if real structured-data markup is ever emitted on the page, a stripped-text derivative would be produced for that specific purpose at that time, not by changing the stored field now.
- **`location`→`creator.worksFor.address`**: `Organization.address` accepts plain `Text`, not just a structured `PostalAddress` — a bare city name is a legitimate value, not a stretch. Done; absent where location was empty (1 entry, Josi Mathar).
- **`project` dropped entirely**, not migrated. Checked real data first: only 2/10 entries had a non-empty `project` (both "Forth Valley Art Beat"), and no matching case-study page exists for it — nothing to link to, so kept the field's absence rather than half-populating an `about` property with a name and no url.
- **Open question, not yet decided:** `company` (not `project`) is what actually matches real site content — Aaron McIvor's `Zotefoams` and Scott Ferguson/Josi Mathar's `e.fundamentals` both have live case studies (`/the-pitch/case-studies/zotefoams/`, `/the-pitch/case-studies/efundamentals/`). If linking a testimonial to the case study it's about becomes a goal, `about` sourced from `company`-matched-to-case-study (via `Quotation.about` → `CreativeWork` with a real `url`) would be more truthful than reviving `project`. Deliberately left open, not implemented.

---

## `photographyCatalogue.json` — speculative future mapping (not built)

*Nothing exists yet beyond a placeholder description. Sketched out early based on real future content ideas (`CareerHub/_inbox.md` → "Photography Collection Ideas"), so the eventual data structure isn't designed blind. Entirely speculative — no data, no schema commitment, revisit when actually built.*

Key finding: this isn't one homogeneous archive with one schema.org type. The actual planned content (travel logs, a food/eating-out map, hand-drawn food illustrations, maker/IoT build documentation, a Glasgow guide) is several genuinely different content shapes sharing some common building blocks — forcing all of it into a single `Photograph`/`ImageObject` list would be the wrong fit for most of it.

| Planned idea | Best-fit schema.org type | Reasoning |
|---|---|---|
| Travel logs (per-destination: photos, maps, notes) | `ImageGallery`, or `Article` if notes are narrative-led, each with an `image` array + `contentLocation` | Genuinely a themed collection with supporting context, not a flat photo list — `ImageGallery` is schema.org's real type for exactly this |
| Fife Coastal Path walk notes | Same `ImageGallery`/`Article` pattern, `contentLocation`→`Place` | Location-anchored content |
| Food/eating-out map | `Map` (a real, dedicated schema.org type) + individual `Place` entries | Not a photo collection at all conceptually — a map artifact, structurally distinct from the photo galleries |
| Furniture builds / maker/IoT projects | `HowTo` if step-by-step, otherwise `ImageGallery`/`Article` | Depends on whether it ends up process-documented (steps) or narrative "here's what I built" |
| Food products (illustrated/hand-drawn) | `VisualArtwork`, not `Photograph` | These are drawings, not photos — schema.org deliberately distinguishes photographic works from art/drawings |
| Glasgow guide | `ImageGallery` + `contentLocation` | Same pattern as travel logs, city-scoped |
| Individual photo (the atomic unit inside the above) | `Photograph` | More accurate than `ImageObject` for actual camera-original photography; `ImageObject` is a more generic "this is an image file" descriptor, better suited to the illustration case if we don't want to imply "photograph" for a drawing |

**Shared building blocks across sub-types:** `Photograph`/`VisualArtwork` as the atomic item type, optionally grouped into an `ImageGallery`/`Article`, optionally location-tagged via `contentLocation`→`Place` (with `GeoCoordinates` where relevant). **EXIF** (embedded capture metadata, auto-generated by the iPhone camera) layers in underneath for the individual `Photograph`/`ImageObject` items — IPTC Photo Metadata was considered and ruled out (personal snaps, not photojournalism-style tagged content; nothing in the actual capture workflow generates it).

**Conclusion:** when this actually gets built, expect multiple sub-collections (e.g. `travelLogs.json`, `makerProjects.json`, `illustratedFood.json`) rather than one `photographyCatalogue.json`, each with its own best-fit type — not a single flat archive. Media caching policy (cache locally, don't hotlink) applies regardless of which sub-type ends up hosting the actual image files.

---

## Media caching policy

*Decided: August 2026 — applies to all `src/_data/` collections with images, not just books.*

**Cache media locally rather than hotlinking or embedding base64.** Given the expected scale across every collection here (tens to low hundreds of items each — books, coffee logos, beer labels, eventually photography), the total footprint stays small (a handful of MB), so there's no real storage cost to owning the files.

Pattern to follow (matches `coffeeCollection.json`'s existing `assets/img/coffee-logos/` convention):
- Download the source image once (at data-entry/enrichment time), store it under `src/assets/img/{collection}-{media-type}/`, e.g. `src/assets/img/book-covers/`
- Reference it in the JSON by local path (`/assets/img/book-covers/book-001.jpg`), not the third-party URL
- Do **not** embed base64 image data directly in the JSON data file — `vinyl_covers.json`/`cd_covers.json` currently do this and it's the one pattern to actively move away from (bloats the data file, can't be served/cached efficiently by the browser, hard to diff)

Reasoning: hotlinking risks broken images if the third-party source 404s, rate-limits, or reorganizes URLs — invisible until a visitor hits it. Caching locally means the site is self-contained and resilient to any external source going away.

Applied to `bookCollection.json` in August 2026: 19 of 27 entries had a cover URL; all 19 were downloaded and cached under `src/assets/img/book-covers/`, `coverUrl` updated to the local path. The remaining 8 entries have no cover art indexed in Open Library at all (confirmed via direct lookup, not a caching gap). `vinyl_covers.json`/`cd_covers.json` not yet migrated off base64 — flagged as a future cleanup, not urgent since they already work, just inconsistent with the policy above.

## Open questions toward a common structure
- **`status` field means different things in different collections** (`bookCollection`: reading progress; `randomThoughts`: publish workflow). If a shared top-level schema emerges, this needs a consistent name/semantics or to stay collection-specific.
- **No collection has a documented "why this schema" rationale except books.** As each is reviewed, capture the reasoning here, not just the shape.
- **Custom/common tagging schema across the site (future).** `keywords`/tag-like data currently exists independently per collection — TIL's `category`/`type`, coffee's `tags`, random thoughts' `tags`, music's `genres` — each with its own vocabulary, no shared taxonomy. A common tagging schema would let the same tag mean the same thing across collections (e.g. cross-collection browsing/filtering by tag). Deliberately deferred — not designed yet.

---

## Data audit page

`/internal/data-audit/` — unlinked from any nav, not gated yet (deliberately deferred: this is about data quality first, publish/access controls later). Shows field-completeness counts per collection (missing vs present, not a raw dump) so gaps are visible without being overwhelming. Currently covers `bookCollection.json` only; other collections to be added as each gets the same review treatment as books above.

**Bug found and fixed while building it:** `selectattr('status', 'equalto', value)` silently does not filter in this project's Nunjucks setup — it was returning the full unfiltered array every time. This meant the Bookshelf page's new "Currently Reading" section (added earlier this session) was rendering **all 27 books**, not just ones with that status — caught before it shipped since there are no `currently-reading` entries yet to have flagged it visually. Replaced with two new custom filters in `eleventyConfig/filters.js`: `whereEquals(array, key, value)` and `whereMissing(array, key)`, both plain JS `.filter()` — use these instead of `selectattr`/`rejectattr` anywhere filtering-by-value is needed on these collections going forward.

## Change log

*Significant structural changes to a data collection, in date order — newest first. Cross-reference `docs/decision-log.md` for the reasoning behind ones with existing entries there.*

- **August 2026** — `photographyCatalogue.json`: speculative future schema.org mapping sketched out against real planned content ideas (travel logs, food map, illustrated food, maker builds, Glasgow guide) — no data built, documentation only. Conclusion: likely several sub-collections with different types (`ImageGallery`, `Map`, `VisualArtwork`, `HowTo`), not one flat archive.
- **August 2026** — `bookCollection.json`: `status` dropped entirely (never actually used — all 27 entries were `already-read`), along with the Bookshelf "Currently Reading" section and the data-audit status breakdown. Proposed future implementation (schema.org `ReadAction`) recorded above, not built.
- **August 2026** — `testimonials.json`: `location`→`creator.worksFor.address` (real `Organization.address` property, plain text). `project` dropped entirely — only 2/10 entries had a value, neither linkable to a real case study. Flagged as an open question: `company` (not `project`) is what actually matches live case-study pages (Zotefoams, e.fundamentals) — worth revisiting as a genuine `about`/case-study link later. Signed off.
- **August 2026** — `testimonials.json`: corrected schema.org type from `Review` to `Quotation` (self-serving-review guideline concern, plus removes the missing-`itemReviewed` gap entirely rather than needing to fix it). `name`→`creator` (nested `Person`), `company`→`creator.worksFor` (`Organization`), `quoteHtml`→`text`. Both testimonial templates updated. Signed off.
- **August 2026** — `beerCollection.json`, `randomThoughts.json`, `tilCollection.json`: finished the actual data migrations for mappings that had only been designed/signed off previously — `brewery`→`brand`, `abv`/`ibu`→`additionalProperty` (beer); `content`→`articleBody`, `date`→`datePublished`, `tags`→`keywords`, `status` dropped (random thoughts); `title`→`headline`, `body`→`description`, `date`→`datePublished`, `source`→`citation`, `category`/`type` merged into `keywords`, `confidence` dropped (TIL). All three templates updated; new `propValue` Nunjucks filter added for reading `additionalProperty` arrays. "Reviewed" and "migrated" are now the same status for every collection with a schema.org mapping.
- **August 2026** — `tilCollection.json`: corrected `body`'s schema.org mapping from `articleBody` to `description` (capsule facts, not article-length content) — audit correction.
- **August 2026** — `webDevArticles.json`: added `description`, `image`, and `keywords`, sourced from the existing `_links/` cache (not fabricated); `author` object-wrapped. Images downloaded and cached locally under `src/assets/img/webdev-article-covers/`. This closes out `webDevArticles.json`'s schema.org migration entirely.
- **August 2026** — `coffeeCollection.json`: `roaster` object-wrapped (`Brand`), `buy_url`→`offers.url` (`Offer` object). This closes out `coffeeCollection.json`'s schema.org migration entirely.
- **August 2026** — `bookCollection.json`: `author` object-wrapped (`Person`), `format`→`bookFormat` mapped to real schema.org enum URLs (`https://schema.org/Paperback` etc.). This closes out `bookCollection.json`'s schema.org migration entirely.
- **August 2026** — `bookCollection.json`: `dateFinished`/`yearRead` consolidated into `review.datePublished` (year precision); `yearRead` dropped entirely. Bookshelf's year-grouping display updated to derive the year from `review.datePublished` instead. `/internal/data-audit/` updated to check the new nested fields (`whereMissing` filter extended to support dotted paths).
- **August 2026** — `bookCollection.json`, `coffeeCollection.json`, `beerCollection.json`: `rating`/`notes`/`userRating`/`tasting_notes` remodeled into nested schema.org `Review`/`Rating` objects (`review.reviewRating`, `review.reviewBody`). Coffee's `tasting_notes` maps to `description` instead (confirmed roaster-published product data, not personal review text). Coffee's `list` (precovid/new) dropped, replaced by `review.datePublished`. Beer's `globalRating` (Untappd community average) dropped entirely, not migrated to `AggregateRating` — deliberate exclusion. Templates updated to match. See `docs/decision-log.md`.
- **August 2026** — `musicCollection.json`: consolidated `genre` (free text, 154 distinct words) into `genres` (array, 23 fixed buckets), matching MusicBrainz's own field name/shape; dropped `catalogue_number_draft` and `verified` (no data value); promoted `barcode_draft` into `barcode` (17 entries) then dropped it. See "musicCollection.json — notes" above.
- **August 2026** — `musicCollection.json`: added `id` (array order, meaningful — shelf order), migrated covers off base64/string-key to `src/assets/img/music-covers/{id}.jpg`. `vinyl_covers.json`/`cd_covers.json` deleted (superseded). Corrected reference standard to MusicBrainz (not Discogs, despite similar field naming) — MusicBrainz is the actual open-data equivalent of Open Library for music. No data changed, just correctly labeled. ListenBrainz reserved as the standard for a future streaming-activity collection. See "musicCollection.json — notes" above.
- **August 2026** — Adopted a site-wide media caching policy (cache locally under `src/assets/img/`, don't hotlink or embed base64). Applied to `bookCollection.json`: 19 covers downloaded and cached, `coverUrl` now points locally. See "Media caching policy" above and `docs/decision-log.md`.
- **August 2026** — `bookCollection.json`: added `isbn`, `editionKey`, and `format` fields; backfilled all 27 entries via live Open Library API lookups (26/27 resolved). `dateFinished` kept despite being empty — will be filled going forward. See `docs/decision-log.md`.
- **August 2026** — `bookCollection.json`: added `status` field (`want-to-read` / `currently-reading` / `already-read`), adopting Open Library's Reading Log shelf convention. See `docs/decision-log.md`.
