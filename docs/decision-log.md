# Decision Log

A record of significant decisions made during the career relaunch and site rebuild. Each entry captures what was decided, why, and what the alternatives were — so future-you has context rather than just an outcome.

**How to use:** When a decision is made, add an entry below with the date, the decision, the reasoning, and the options that were considered and rejected. Decisions pending are listed as open items.

---

## Open (undecided)

*(none)*

---

## Decided

### Professional title / positioning
*Decided: August 2026*

Use different titles depending on context — not one size fits all, but a deliberate layered approach:

- **Web Developer & Designer** — headline title everywhere. Website front page, email signature, any brief or prominent mention of what I do. Legible to clients, developer-led, accurate.
- **Front-end Architect** — secondary, used in more technical or detailed contexts: skills sections, peer-facing copy, longer bios, contractor profiles. Signals seniority and decision-making without replacing the headline.
- **Consultant / Contractor** — situational. Brought in where it fits the engagement type: CVs, longer-form descriptions, specific pitches. Not a headline.

**Ruled out as headlines:**
- *Freelance [X]* — implies availability-for-hire, too restrictive as a descriptor
- *Creative Director* — too senior/agency
- *Front-End Architect* as headline — systems-skewed, undersells design
- *Digital Designer* — design-first, low code signal
- *Creative Technologist* — interesting but less legible to non-tech clients
- *[X] Consultant* as headline — narrows specialism

**Ref:** [zeroheight.com/blog/design-engineer](https://zeroheight.com/blog/design-engineer/)

### Testimonials curation
*Decided: August 2026*

Condensed the testimonials source list from 19 entries down to 9 entries (10 names) for site use.

**Kept:** Rosy Naylor (Art Walk Projects), Aaron McIvor (Zotefoams), Scott Ferguson (e.fundamentals), Josi Mathar (e.fundamentals), Amy McCusker & Gerard McCusker (WeeBox/K-N Trading), Emily Reid (Eco Drama), Chris (Navigator Partnership), Avril Nicol (Forth Valley Art Beat), Nigel Brown (BestCities Global Alliance).

**Dropped:** David Ross (Digijuice), Annelie (Fountainwell), Kate (Tootsa MacGingty), David Neill (Clarke Cottage), Helen Pank (Small Green Spaces), Wayne Roberts (Community Growing Solutions), Jack Taylor (Piobaireachd Society), Claire (Midlands), Maria Quinn. Several of these clients still have live websites — see `previous-clients.md` for outreach tracking.

### Data structure standards
*Decided: August 2026*

Adopted a documented, standards-first approach to the `src/_data/` collections (music, books, beer, coffee, TIL, thoughts, articles, photography, testimonials). Full tracking lives in `docs/data-structures.md`: field definitions, required/optional status, reference standard per collection, conformance gaps, third-party alternatives considered, and progress toward a common structure across collections (especially media handling — currently inconsistent: hotlinked URLs, self-hosted paths, and embedded base64 all in use).

When a data structure needs to reference a third-party standard, prefer open, non-proprietary, well-supported/catalogued formats with reliable data integrity over bespoke or scraped shapes (e.g. Open Library's Reading Log shelf convention adopted for `bookCollection.json`'s `status` field, rather than inventing our own).

### Bookshelf data enrichment
*Decided: August 2026*

Added `isbn`, `editionKey`, and `format` fields to `bookCollection.json` and backfilled all 27 entries via live Open Library API lookups, rather than leaving fields empty as placeholders. 26/27 resolved to real OL edition data; one entry (Alan Partridge: Big Beacon) has no edition indexed in OL at all.

**Policy on empty fields going forward:** fine to add fields ahead of having complete data, as long as the gap is documented (see `docs/data-structures.md`) — `dateFinished` is being kept in this spirit, currently empty on all entries, to be filled in as books are finished rather than backfilled retroactively.

**On `format`:** where Open Library had no `physical_format` recorded for an edition, defaulted to an assumed value (`Paperback` for books, `Audible Audio` for audiobooks) rather than leaving null — flagged in the data doc as an assumption, not verified OL data.

### Media caching policy (site-wide)
*Decided: August 2026*

Cache third-party media locally under `src/assets/img/{collection}/` rather than hotlinking external URLs or embedding base64 data in the JSON, across **all** `src/_data/` collections — not just books. Given the scale of these collections (tens to low hundreds of items each), the total storage footprint stays small, so there's no real cost to owning the files, and it avoids the risk of a third-party source going down/rate-limiting/reorganizing and quietly breaking images on the site.

**Pattern:** mirrors the existing `coffeeCollection.json` → `assets/img/coffee-logos/` convention. Download once, store as a real file, reference by local path in the JSON.

**Ruled out:** embedding base64 directly in the data file — `vinyl_covers.json`/`cd_covers.json` already do this and it's the one existing pattern that goes against this policy (bloats the JSON, can't be cached/served efficiently, hard to diff). Not migrating those retroactively right now, but flagged as a future cleanup.

Applied immediately to `bookCollection.json`: 19 cover images downloaded from Open Library and cached under `src/assets/img/book-covers/`.

### Schema.org as the primary reference standard (turning point)
*Decided: August 2026*

Revised approach to reference standards across `src/_data/` collections. Earlier decisions (Open Library for books, MusicBrainz for music) picked a different "best in class" open **database/API** per collection. That conflated two different things: an open *data source* (a specific organization's app, whose schema reflects their own needs — nested, relational, sometimes awkward for a flat personal JSON file) versus an open *cataloguing standard* (deliberately designed for interoperable description of content, independent of any one app).

**New approach:** `schema.org` (maintained by Google/Microsoft/Yahoo/Yandex — open, free, non-proprietary, extremely well-documented and adopted) is the primary reference standard for *shape and vocabulary* across nearly every collection, since it's purpose-built for exactly this — a website describing its own catalogued content — and comes with a concrete practical payoff (structured data / rich search results) that Open Library/MusicBrainz alone don't offer.

Domain-specific standards remain layered underneath schema.org, not replaced by it — they cover identifiers and ratings schema.org doesn't define:
- Books: ISBN (ISO 2108) — already adopted
- Music: ISRC/ISWC (recording/work identifiers), Open Library-equivalent role now played by MusicBrainz only as a *data source*, not the schema
- Beer: BJCP Style Guidelines (style classification)
- Coffee: SCA Cupping Protocol / Q Grading (rating methodology)
- Photography (not yet built): EXIF (ISO, embedded capture metadata), IPTC Photo Metadata (captions/keywords/copyright)

**Schema.org type per collection:**

| Collection | Schema.org type |
|---|---|
| `bookCollection.json` | `Book` |
| `musicCollection.json` | `MusicRelease` |
| `beerCollection.json` / `coffeeCollection.json` | `Product` |
| `randomThoughts.json` | `SocialMediaPosting` |
| `tilCollection.json` / `webDevArticles.json` | `Article` |
| `testimonials.json` | `Review` |
| `photographyCatalogue.json` (not yet built) | `Photograph` / `ImageObject` |

**Audit findings before any data changes were made** (see `docs/data-structures.md` for full detail): no data loss identified anywhere. The one structural cost that recurs across nearly every collection is that schema.org expects "who made this" fields (`author`, `byArtist`, `brand`, `recordLabel`) as Person/Organization **objects**, while ours are flat strings — a wrap, not a deletion, but touches most records if pursued for full literal conformance. `musicCollection.json`'s `catalogNumber` and array-valued `genre` already match schema.org's `MusicRelease` exactly with zero changes needed. Fields with no schema.org equivalent (personal ratings, reading/workflow status, `abv`/`ibu`) stay as custom fields alongside the schema.org-aligned ones, not replaced.

**Not yet implemented** — this is the audited plan, pending decision on how far to take literal conformance (rename-only vs. full object-shape reconformance) before any collection is actually migrated.

**Update:** full literal conformance was subsequently confirmed as the standing policy (not just documented mapping) — see "Rating/review fields remodeled to schema.org Review/Rating" below for the first collections actually migrated under this policy.

### Rating/review fields remodeled to schema.org Review/Rating
*Decided: August 2026*

Following the schema.org turning-point decision above, migrated `bookCollection.json`, `coffeeCollection.json`, and `beerCollection.json`'s personal rating fields into nested schema.org `Review`/`Rating` objects (`review.reviewRating`, `review.reviewBody`) rather than flat numeric fields with an implied, undocumented scale (books/coffee were 0–10, beer was 0–5 — nowhere previously stated). `review` is explicit `null` for unrated items, matching this repo's existing null convention.

**Coffee's `tasting_notes`→`description` split:** initially assumed to be Steven's own review text and slotted into `review.reviewBody`. Checked the live source (`ClaudeHub/lists-and-tastes/coffee-ratings.md`) and found it's a roaster-published product descriptor column, sitting alongside Origin/Roast/Process/URL — not personal review text. Corrected to map to `description` instead, independent of whether a rating exists. Worth recording since it corrected a wrong initial assumption during design — a reminder to check provenance before assuming a text field is personal commentary.

**Coffee's `list` (precovid/new) dropped**, replaced by `review.datePublished` — the correct schema.org home for "when," matching the same shape used for books/coffee ratings elsewhere.

**Beer's `globalRating` dropped entirely, not migrated to `AggregateRating`** — this was Untappd's third-party community-average rating, not Steven's own opinion. Schema.org has a distinct, correct type for exactly this case (`AggregateRating`, for multi-rater averages, vs. `Review` for a single opinion), but the decision was to exclude it from this site's data altogether rather than store it under the "correct" type — not our data, not wanted here. No `AggregateRating` appears anywhere in this site's schema as a result; this is deliberate, not an oversight to fix later.

`musicCollection.json` has no rating field (N/A, nothing to migrate). `testimonials.json` explicitly out of scope — it's a review *of* Steven (client is author, Steven is subject), the opposite direction from these personal media-rating collections; `Review` fits both conceptually but the authorship direction is different, so treated as a separate future task, not folded into this one.

No data loss confirmed for what was kept: pre/post migration counts of non-null rating/notes/description values match exactly across all three collections.
