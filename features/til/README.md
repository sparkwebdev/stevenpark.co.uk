# Today I Learned (TiL) Feature

A curated knowledge base of surprising, verifiable facts in the style of Tom Whitwell's "52 Things I Learned."

## Feature Status

**Status:** 🔨 In progress

**Goal:** Build a browseable, filterable gallery of ~60 carefully curated facts—terse, specific, with striking numbers or institutional absurdity. Each fact has a "learned" date, category, source URL, and confidence rating.

## Source Files

**keep.json** — 143 curated facts ready for publication
- Fully vetted and sourced (17% acceptance rate from 852 total candidates)
- Ready to integrate into site as the live data

**reject.json** — 709 rejected facts (reference only)
- Facts that didn't meet curation standards
- Kept to avoid repeating similar ideas
- Not published, but useful for context and to learn what "doesn't work"

**portable-research-prompt.md** — Curation rubric and research guide
- Detailed style guide (terse, striking numbers, agent-focused)
- Curation philosophy (what makes a fact keep-worthy)
- Geographic balance rules (Scotland/UK boost)
- Personal interests to prioritize
- Passive patterns to avoid
- Already-covered facts list (~60 to avoid repeating)
- Research format for new candidates

## Current Tasks

### Immediate
- [ ] Copy keep.json to `src/_data/tilCollection.json`
- [ ] Create `src/pages/journal/til/index.html` template
- [ ] Choose presentation style (feed list, card grid, timeline?)
- [ ] Implement filtering (by category, type, confidence)

### Design Decisions
- Presentation format: TBD (recommend: chronological feed with category/type filters)
- Display fields: title, body, source link, category tag, type badge, confidence badge?, learned date
- Sorting: by date (newest first), by category, by type

### Next Phase
- [ ] Setup continuous curation workflow (new candidates → review HTML via generate_preview.py → merge kept IDs into keep.json)
- [ ] Consider monthly cadence or event-driven (when X new candidates collected)

## Curation Workflow

The `portable-research-prompt.md` is a detailed rubric for researching and vetting new TiL candidates. Key principles:

**Keep:** Facts where a specific agent (person, company, institution) does something absurd, extreme, or numerically striking
- Production-history war stories (film/album oddities)
- Institutional mischief or loopholes
- Engineering/web-dev absurdist humor
- Counterintuitive science delivered vividly
- Vivid historical or literary scenes
- Accessibility features that quietly work

**Avoid:** Passive announcements ("a thing exists," "a species was found") without human agency or stakes

**Boost:** Geographic representation of Scotland/UK/Ireland, plus personal interest domains (IDM music history, CSS trivia, accessibility, design, coffee science)

## Related Script

**generate_preview.py** (in `/Resources/CareerHub/features/TiL/scripts/`)
- Takes a candidates.json file
- Generates interactive HTML review page with checkboxes
- Filters by type (web-dev/general)
- Outputs JSON array of kept IDs (can be pasted back into chat to merge)
- Useful workflow for ongoing curation
