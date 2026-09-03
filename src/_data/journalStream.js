import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Merges tilCollection.json + randomThoughts.json + published projects
// (from projectsCollection.json) into one normalized, newest-first
// chronological stream for the Journal landing page. Broader than
// thoughtsStream.js (TIL + Thoughts only, feeds /journal/thoughts/) —
// this one also surfaces published work/personal projects, per the
// "work items when published will be exposed in the journal stream" model.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readJson = (name) =>
  JSON.parse(readFileSync(path.join(__dirname, name), "utf8"));

const tilCollection = readJson("tilCollection.json");
const randomThoughtsData = readJson("randomThoughts.json");
const projectsCollection = readJson("projectsCollection.json");

const til = tilCollection.map((entry) => ({
  type: "til",
  date: entry.datePublished,
  headline: entry.headline,
  body: entry.description,
  citation: entry.citation || null,
  url: null,
}));

const thoughts = randomThoughtsData.thoughts.map((entry) => ({
  type: "thought",
  date: entry.datePublished,
  headline: null,
  body: entry.articleBody,
  citation: null,
  url: null,
}));

const projects = projectsCollection
  .filter((p) => p.status === "published" && p.publishDate)
  .map((p) => ({
    type: "project",
    date: p.publishDate,
    headline: p.name,
    body: p.description,
    citation: null,
    url: `/journal/${p.type === "client" ? "work" : "projects"}/${p.id}/`,
    projectType: p.type,
    caseStudy: p.caseStudy,
  }));

const stream = [...til, ...thoughts, ...projects].sort((a, b) =>
  a.date < b.date ? 1 : -1
);

export default stream;
