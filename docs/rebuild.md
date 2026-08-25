# Site Rebuild — Context & Working Notes

This doc captures context from a discovery session (Aug 2026) covering the source/planning
material for the rebuild, and how work here in the Eleventy repo relates to it. Not a spec —
a reference point so future sessions don't need to re-derive this.

## Source material lives outside this repo

Planning, drafts, and source content for the rebuild live in a Claude Desktop project at:

```
/Users/stevenpark/Library/CloudStorage/Dropbox/Resources/CareerHub
```

That folder is the origin of most of the site's content — some duplication between there and
this repo is expected and fine (this repo is the build target, CareerHub is the working/source
material). Key structure:

| Path | What it is |
|---|---|
| `00-career-relaunch-catalogue.md` | Top-level context: business framing, priority order (1. Website rebuild → 2. CV/LinkedIn → 3. Promotion → 4. Upskilling), five-year horizon notes |
| `01-site-rebuild/01-framing.md` | Content framing/structure for the rebuilt site (see below) |
| `01-site-rebuild/site-content/` | Actual site content/notes — mix of old, reworked, and WIP |
| `01-site-rebuild/assets/` | Mostly images, largely already present in this repo |
| `01-site-rebuild/client-input-form-templates/` | Not yet reviewed |
| `01-site-rebuild/tech-code-ref/` | Not yet reviewed |
| `02-cv-linkedin/` | CV/LinkedIn rework — out of scope for now, comes after the site |
| `03-promotion/` | Post-launch, business/promotion focused — ignore for now |
| `features/` | WIP Lifestream catalogue features (see below) — rough, not really "done" for any of them |
| `decision-log.md` | Record of significant decisions (date, reasoning, rejected alternatives). Currently one entry: professional title/positioning |
| `_inbox.md` | Running to-do/idea list across the whole relaunch project — see below |
| `_bin/` | Old content kept as an interim safety backup, likely to be deleted eventually |

**Working pattern going forward:** development happens in parallel across both — CareerHub
(Claude Desktop project) for planning/content, this repo (Claude Code) for implementation.
Expect in-flow requests here to build out an in-progress site as content/features are worked
out in CareerHub.

## Content framing (`01-framing.md`)

Site concept: intentionally stripped-back landing page with easter-egg-y discoverability — no
traditional nav menu, content is revealed as the user explores.

Rough structure being considered:
- **Homepage** — simple; possibly a console-module-style content teaser
- **The Pitch** — bold marketing mode, antithesis of the homepage; dramatic transition from
  simple → full visual assault; Five Ws + How copy structure
- **Lifestream** — journal-style personal content stream across hobbies/work/media, ideally
  automated rather than traditional blogging
- **Contact** — low-friction paths for good leads, high-friction (or self-filtering) for
  unsuitable ones (FAQs, pricing up front, question flows)

Ancillary/TBD pages:
- **About** — probably not a traditional About page; if it exists, a History/Milestones
  narrative rather than a work-history list
- **Case Studies/Portfolio** — current version dated, needs culling + new case studies (SE,
  Walksy, Zotefoams); undecided whether it's its own page or folded into Pitch/Lifestream
- **How I Built This** — incremental build log/tech breakdown, written as features ship (ref:
  Josh Comeau's "How I Built My Blog v2")
- **Uses / The Studio / My Setup** — hardware/software overview
- **Online CV** — live HTML CV with on-demand PDF generation (print CSS vs. headless TBD)
- **Social links** — Instagram, GitHub, LinkedIn, RSS
- **Supplementary/legal** (low priority): Payment terms, T&Cs, Privacy Policy, Accessibility
  Statement

## Feature ideas (`features/`, `_inbox.md`)

The `features/` folder is WIP Lifestream catalogue builds, all in early/rough states. They map
to inbox items:

- **Music collection catalogue** — CDs/vinyl, indexed/filterable/rateable, record-player-style
  playback UI
- **Coffee ratings**
- **Favourite Web Dev Articles**
- **Photography** — travel, food, making/DIY, Glasgow guide
- **Bookshelf** — reading list/notes
- **"Today I Learned…"** — bite-sized logged learnings, tagged, collated
- **Random thoughts** — micro-posts, no blog planned
- **Currently/Now** — a "happening now" surface pulling latest items from the above catalogues

Also noted, non-Lifestream feature ideas from the inbox:
- **Console Navigation Module** — terminal-styled primary nav, slash commands for tech users,
  chat-mode toggle for non-tech users; likely the site's signature interaction
- **Easter eggs** — keyboard-shortcut theme/mode switching (ref: dany.works)
- **Bug reporting widget**, **Buy me a coffee**, **affiliate links** (low priority)
- **404 page** — interactive hand-drawn squiggle concept
- **Book a chat** — calendar booking
- **Client area** subdomain — scope TBD

## Decisions made so far

See CareerHub's `decision-log.md` for the authoritative record. Currently:

- **Professional title/positioning** (Aug 2026) — layered: "Web Developer & Designer" as the
  headline everywhere, "Front-end Architect" as a secondary/technical-context title,
  "Consultant/Contractor" used situationally (CVs, specific pitches).

## Relationship to this repo's branch state

Per the earlier branch review: `master` is live but soft-offline (reduced nav/content) since
March 2026. `2026-update` (this branch) restores full content, upgrades deps to Node 22, adds
a11y fixes, and folds in HTML validation tooling from the now-merged `html-validation` branch.
`2026-update` is the integration branch this rebuild work continues from — `master` stays
stripped back for now, by design.
