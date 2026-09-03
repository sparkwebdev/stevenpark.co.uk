import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Filtered view of projectsCollection.json — client (Work) projects only.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projects = JSON.parse(
  readFileSync(path.join(__dirname, "projectsCollection.json"), "utf8")
);

export default projects.filter((p) => p.type === "client");
