import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// "Currently working on" for the Lifestream landing page — a project
// (client or personal, published or in-flight, doesn't matter) counts as
// currently being worked on if EITHER:
//   (a) it has an update within the last 30 days, or
//   (b) it was recently finished/published (publishDate within 30 days).
// Deliberately independent of `status` — a published project can still be
// actively worked on ("a website could be published/live but also have
// ongoing work attached to it, so is still a project"). (b) is a no-op
// against today's data (everything's backfilled to 2024-12-31) but the
// mechanism needs to exist for when real publish dates land.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projects = JSON.parse(
  readFileSync(path.join(__dirname, "projectsCollection.json"), "utf8")
);

const WINDOW_DAYS = 30;
const now = new Date();
const cutoff = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
const isRecent = (dateStr) => dateStr && new Date(dateStr) >= cutoff;

const workingOn = projects
  .map((p) => {
    const latestUpdate =
      p.updates && p.updates.length
        ? p.updates.reduce((a, b) => (a.date > b.date ? a : b))
        : null;

    const updateIsRecent = latestUpdate && isRecent(latestUpdate.date);
    const publishIsRecent = isRecent(p.publishDate);

    if (!updateIsRecent && !publishIsRecent) return null;

    // Prefer whichever signal is more recent when both are present.
    const reason =
      updateIsRecent &&
      (!publishIsRecent || latestUpdate.date >= p.publishDate)
        ? "updated"
        : "published";
    const date = reason === "updated" ? latestUpdate.date : p.publishDate;

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      url: `/lifestream/${p.type === "client" ? "work" : "projects"}/${p.id}/`,
      reason,
      date,
    };
  })
  .filter(Boolean)
  // Client work takes precedence over personal projects; most-recent-first within each.
  .sort((a, b) => {
    if (a.type !== b.type) return a.type === "client" ? -1 : 1;
    return a.date < b.date ? 1 : -1;
  });

export default workingOn;
