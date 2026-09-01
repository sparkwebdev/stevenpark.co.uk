# Decision Log

A record of significant decisions made during the career relaunch and site rebuild — what was decided and why, so future-you has context rather than just an outcome. Field-level data mapping detail lives in `docs/data-structures.md`, not here.

---

## Open (undecided)

*(none)*

---

## Decided

### Professional title / positioning
*Decided: August 2026*

Layered approach, not one size fits all:
- **Web Developer & Designer** — headline title everywhere (site, email signature, brief mentions). Legible to clients, developer-led.
- **Front-end Architect** — secondary, for technical/peer-facing contexts (skills sections, longer bios). Signals seniority without replacing the headline.
- **Consultant / Contractor** — situational, used where the engagement type calls for it (CVs, pitches). Not a headline.

**Ruled out as headlines:** *Freelance [X]* (implies availability-for-hire), *Creative Director* (too senior/agency), *Front-End Architect* alone (undersells design), *Digital Designer* (low code signal), *Creative Technologist* (less legible to non-tech clients), *[X] Consultant* (narrows specialism).

**Ref:** [zeroheight.com/blog/design-engineer](https://zeroheight.com/blog/design-engineer/)

### Testimonials curation
*Decided: August 2026*

Condensed the testimonials source list from 19 entries to 9 (10 names).

**Kept:** Rosy Naylor (Art Walk Projects), Aaron McIvor (Zotefoams), Scott Ferguson (e.fundamentals), Josi Mathar (e.fundamentals), Amy & Gerard McCusker (WeeBox/K-N Trading), Emily Reid (Eco Drama), Chris (Navigator Partnership), Avril Nicol (Forth Valley Art Beat), Nigel Brown (BestCities Global Alliance).

**Dropped:** David Ross (Digijuice), Annelie (Fountainwell), Kate (Tootsa MacGingty), David Neill (Clarke Cottage), Helen Pank (Small Green Spaces), Wayne Roberts (Community Growing Solutions), Jack Taylor (Piobaireachd Society), Claire (Midlands), Maria Quinn — several still have live sites, see `previous-clients.md` for outreach tracking.

### Data structure standards
*Decided: August 2026*

Adopted a documented, standards-first approach to the `src/_data/` collections. Prefer open, non-proprietary, well-supported formats over bespoke/scraped shapes when a data structure needs a third-party reference. Full tracking lives in `docs/data-structures.md`.

### Media caching policy (site-wide)
*Decided: August 2026*

Cache third-party media locally under `src/assets/img/{collection}/` rather than hotlinking or embedding base64, across all `src/_data/` collections. Avoids the risk of a third-party source going down/rate-limiting and quietly breaking images, at negligible storage cost. `vinyl_covers.json`/`cd_covers.json`'s base64 embedding is the one pattern that goes against this — not retroactively migrated, flagged as a future cleanup.

### Schema.org as the primary reference standard
*Decided: August 2026*

Revised approach to reference standards: an open database/API (Open Library, MusicBrainz, Untappd) is a data *source*, reflecting that organization's own app structure — not necessarily the right shape for a flat personal JSON file. **Schema.org** is now the primary reference standard for shape and vocabulary across nearly every collection: open, non-proprietary, purpose-built for a site describing its own content, with a real payoff (structured data / rich search results). Domain-specific standards (ISBN, ISRC, EXIF, SCA) stay layered underneath for identifiers/ratings schema.org doesn't define. Full literal conformance (object-wrapping author/brand/etc. fields, not just renaming) confirmed as standing policy. See `docs/data-structures.md` for the per-collection type mapping.

