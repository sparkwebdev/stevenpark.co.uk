# Web Dev Articles Feature

A curated "best of" web development articles gallery.

## Feature Status

**Status:** ⚠️ Not production ready

**Goal:** Maintain a hand-picked directory of technically durable, historically significant web dev articles—pieces where the resonance lives on despite age, or that serve as historical waypoints.

## Data Structure

**Keep pile:** 16 curated, verified articles
- All have working URLs
- All have author/source metadata
- Display as link preview cards with cached metadata

**Maybe pile:** 16 candidate articles under review
- Some have incomplete URLs (marked "pending")
- Confidence varies (some notes explain hesitation)
- Awaiting curator decision before promotion to Keep

## Current Tasks

### Immediate
- [ ] Resolve 3 pending URLs:
  - "The tangled webs we weave" (Dave Rupert) — need specific article link
  - "Blue People Illustrations..." (Aleksandr Hovhannisyan) — need specific article link
  - 3 entries with no URLs at all — research sources

### Next Phase
- [ ] Review Maybe pile and decide which candidates to promote
- [ ] Add notes on why each candidate is hesitant (too niche? dated? principle-based?)
- [ ] Potentially expand Keep pile as new gold-standard articles surface

## Curation Philosophy

Prioritize:
1. **Technical durability** — does it still apply today? (e.g., CSS Logical Properties was "not ready" then, may be different now)
2. **Principle-based** — does the core message hold even if the tech changed?
3. **Historical significance** — useful as a waypoint in the tech journey, even if obsolete now?

Deprioritize:
- Trend pieces (moment-in-time commentary)
- Tool-specific tutorials (narrow scope, likely dated)
- Clickbait or lightweight pieces (unless principle-based)

## Source Files

- `articles.md` — Original curation from CareerHub (source of truth for decisions)
- `src/_data/webDevArticles.json` — Live data (generated from curation)
- `src/pages/journal/web-dev-articles.html` — Template with link previews
