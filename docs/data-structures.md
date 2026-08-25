# Data Structures

Living reference for the JSON collections in `src/_data/`. For each: fields (required/optional), the reference standard it's modelled on (if any), whether our data actually conforms to that standard, alternatives considered, and how it handles media. Also tracks progress toward common ground across collections.

Maintained by the `data-structure` agent (`.claude/agents/data-structure.md`) — update this file rather than letting findings live only in chat.

**Principle for third-party formats:** prefer open, non-proprietary, well-supported/catalogued standards with reliable data integrity over bespoke or scraped ones.

**Principle for data ownership:** the data should belong to us, not live only inside a third party. Third-party APIs/sources are fine to *use* — for lookups, enrichment, reference standards, initial import — but the source of truth for what we display should be our own committed JSON in `src/_data/`, not a live dependency on someone else's API/database staying up, unchanged, and accessible. This is separate from the media-caching policy above (which is about files); this is about the structured data itself. Not something we audit/score — just a standing design principle to apply when adding or reviewing a collection.

---

## Review status

*Whether a collection has had the full field-by-field / standards-conformance review this document is meant to capture — as opposed to only appearing in the high-level survey table below.*

| Collection | Reviewed? |
|---|---|
| `bookCollection.json` | ✅ Reviewed (see detailed evaluation below) |
| `musicCollection.json` | ✅ Reviewed and cleansed — see below |
| `beerCollection.json` | Not yet |
| `coffeeCollection.json` | Not yet |
| `tilCollection.json` | Not yet |
| `randomThoughts.json` | Not yet |
| `webDevArticles.json` | Not yet |
| `photographyCatalogue.json` | Not yet |
| `testimonials.json` | Not yet |
| `currentlyNow.json` | Not yet |
| `vinyl_covers.json` / `cd_covers.json` | Not yet |

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
| `currentlyNow.json` | None — custom "lifestream surfacing" shape | Custom, intentionally references items in other collections (`type`, `title`, `source`) rather than owning data | No media directly | This is the closest thing we have today to a cross-collection/common structure — worth studying as a model |
| `navigation.json` | Not a lifestream collection — site nav config | N/A | N/A | Out of scope for this document |

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
| `rating` | None | Personal, 0–10 scale, no OL equivalent needed |
| `notes` | None | Personal free text, no OL equivalent needed |
| `yearRead` | Reading Log has per-entry timestamps, not just a year | Custom, coarser than OL. Reasonable for a public display page |
| `dateFinished` | Reading Log `date` events | **Still `null` on all 27 entries — kept intentionally.** Decision: keep the field, gap is known, will be filled in going forward as books are finished rather than backfilled retroactively |
| `source` | None | Always `"manual"` across all entries — currently a no-op field, but plausibly forward-looking (e.g. future `"open-library-import"` provenance). Leave as-is |
| `addedAt` | None | ISO 8601 timestamp, fine |
| `status` | OL Reading Log shelves | Conforms — but no entry currently uses `currently-reading` or `want-to-read`, so the new template section is unexercised until real data is added |
| `isbn` | OL Editions `isbn_13`/`isbn_10` | **Added and backfilled** via live Open Library API lookups (see below) — 26/27 entries now have a real ISBN |
| `editionKey` | OL **Edition** key (`/books/OLxxxxxxM`) | **Added and backfilled** the same way — the actual OL edition record, not guessed |
| `format` | OL Editions `physical_format` | **Added.** Backfilled from OL where the edition had it recorded; where OL had no `physical_format` value, defaulted to an assumed label (`Paperback` for books, `Audible Audio` for audiobooks) rather than leaving blank — these assumed values are not verified OL data, just reasonable defaults |

**Backfill results (August 2026):** Looked up all 27 works via the Open Library Editions API (`/works/{key}/editions.json`) and Search API (for the 4 entries missing a Work key). 26/27 resolved to a real edition with ISBN + edition key. The one exception, **book-008 "Alan Partridge: Big Beacon"**, resolves to a Work (`/works/OL37832210W`) with no edition data indexed in OL at all — nothing to backfill there until OL's own catalogue improves.

Cover art: confirmed via direct ISBN-based Covers API lookup (`?default=false`, checking for 404) that the 7 entries still missing `coverUrl` (book-004, 007, 008, 014, 017, 021, 022) have **no cover art indexed in Open Library under any key** — not a lookup-method gap, genuinely absent from OL's data. Nothing more to do there short of sourcing covers from elsewhere.

**Edition-level key discussion:** confirmed `type` (book/audiobook) was a custom field with no direct OL equivalent — OL tracks format at the edition level (`physical_format`), not as a Work-level flag. Decided to add both `editionKey` (real OL edition ID) and `format` (OL's own format vocabulary where available) to eventually let `type` be cross-checked against real OL data rather than staying a hand-set flag only.

**Subjects/genres** — OL Works expose a `subjects` list; still not captured. Left out of this pass — flagged as a future addition if tagging/filtering on the Bookshelf page becomes a priority.

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
- **`currentlyNow.json`'s "reference into other collections" pattern** may be the shape of a future top-level/common schema — worth revisiting once more collections have real reference-standard alignment.
- **No collection has a documented "why this schema" rationale except books.** As each is reviewed, capture the reasoning here, not just the shape.

---

## Data audit page

`/internal/data-audit/` — unlinked from any nav, not gated yet (deliberately deferred: this is about data quality first, publish/access controls later). Shows field-completeness counts per collection (missing vs present, not a raw dump) so gaps are visible without being overwhelming. Currently covers `bookCollection.json` only; other collections to be added as each gets the same review treatment as books above.

**Bug found and fixed while building it:** `selectattr('status', 'equalto', value)` silently does not filter in this project's Nunjucks setup — it was returning the full unfiltered array every time. This meant the Bookshelf page's new "Currently Reading" section (added earlier this session) was rendering **all 27 books**, not just ones with that status — caught before it shipped since there are no `currently-reading` entries yet to have flagged it visually. Replaced with two new custom filters in `eleventyConfig/filters.js`: `whereEquals(array, key, value)` and `whereMissing(array, key)`, both plain JS `.filter()` — use these instead of `selectattr`/`rejectattr` anywhere filtering-by-value is needed on these collections going forward.

## Change log

*Significant structural changes to a data collection, in date order — newest first. Cross-reference `docs/decision-log.md` for the reasoning behind ones with existing entries there.*

- **August 2026** — `musicCollection.json`: consolidated `genre` (free text, 154 distinct words) into `genres` (array, 23 fixed buckets), matching MusicBrainz's own field name/shape; dropped `catalogue_number_draft` and `verified` (no data value); promoted `barcode_draft` into `barcode` (17 entries) then dropped it. See "musicCollection.json — notes" above.
- **August 2026** — `musicCollection.json`: added `id` (array order, meaningful — shelf order), migrated covers off base64/string-key to `src/assets/img/music-covers/{id}.jpg`. `vinyl_covers.json`/`cd_covers.json` deleted (superseded). Corrected reference standard to MusicBrainz (not Discogs, despite similar field naming) — MusicBrainz is the actual open-data equivalent of Open Library for music. No data changed, just correctly labeled. ListenBrainz reserved as the standard for a future streaming-activity collection. See "musicCollection.json — notes" above.
- **August 2026** — Adopted a site-wide media caching policy (cache locally under `src/assets/img/`, don't hotlink or embed base64). Applied to `bookCollection.json`: 19 covers downloaded and cached, `coverUrl` now points locally. See "Media caching policy" above and `docs/decision-log.md`.
- **August 2026** — `bookCollection.json`: added `isbn`, `editionKey`, and `format` fields; backfilled all 27 entries via live Open Library API lookups (26/27 resolved). `dateFinished` kept despite being empty — will be filled going forward. See `docs/decision-log.md`.
- **August 2026** — `bookCollection.json`: added `status` field (`want-to-read` / `currently-reading` / `already-read`), adopting Open Library's Reading Log shelf convention. See `docs/decision-log.md`.
