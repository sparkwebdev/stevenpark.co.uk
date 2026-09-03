import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Merges tilCollection.json + randomThoughts.json into one normalized,
// newest-first chronological stream for /lifestream/thoughts/. Keeps
// keywords out of the normalized shape entirely — tag output is
// suppressed for now, see docs/decision-log.md.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tilCollection = JSON.parse(
  readFileSync(path.join(__dirname, "tilCollection.json"), "utf8")
);
const randomThoughtsData = JSON.parse(
  readFileSync(path.join(__dirname, "randomThoughts.json"), "utf8")
);

const til = tilCollection.map((entry) => ({
  type: "til",
  date: entry.datePublished,
  headline: entry.headline,
  body: entry.description,
  citation: entry.citation || null,
}));

const thoughts = randomThoughtsData.thoughts.map((entry) => ({
  type: "thought",
  date: entry.datePublished,
  headline: null,
  body: entry.articleBody,
  citation: null,
}));

const stream = [...til, ...thoughts].sort((a, b) => (a.date < b.date ? 1 : -1));

export default stream;
