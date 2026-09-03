#!/usr/bin/env node
// Runs `parcel watch` via the JS API instead of the CLI, so we can force
// the Watchman backend for file watching instead of native FSEvents.
//
// Why: `@parcel/watcher`'s FSEvents backend reliably crashes with
// "Events were dropped by the FSEvents client. File system must be
// re-scanned." inside Dropbox-synced folders (this whole repo lives under
// Dropbox), taking down the dev server. `parcel watch`'s CLI has no flag
// for choosing the watcher backend — it's only settable via Parcel's JS
// API (`watchBackend`, see node_modules/@parcel/core/src/types.js). This
// script replicates what `parcel watch <entry> --dist-dir <dir>` does,
// plus that one option. See docs/data-structures.md decision log.
//
// Usage: node scripts/parcel-watch-watchman.mjs <entry> <distDir>
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import parcelCore from "@parcel/core";
const Parcel = parcelCore.default;

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const [, , entry, distDir] = process.argv;
if (!entry || !distDir) {
  console.error("Usage: node scripts/parcel-watch-watchman.mjs <entry> <distDir>");
  process.exit(1);
}

const parcel = new Parcel({
  entries: [path.resolve(projectRoot, entry)],
  defaultConfig: require.resolve("@parcel/config-default", {
    paths: [projectRoot, __dirname],
  }),
  shouldPatchConsole: false,
  mode: "development",
  watchBackend: "watchman",
  defaultTargetOptions: {
    distDir: path.resolve(projectRoot, distDir),
    shouldOptimize: false,
    sourceMaps: true,
  },
});

const { unsubscribe } = await parcel.watch((err, event) => {
  if (err) {
    throw err;
  }
  if (event?.type === "buildFailure") {
    console.error(event.diagnostics);
  } else {
    console.log(`Watching (watchman backend): ${entry} -> ${distDir}`);
  }
});

process.on("SIGINT", async () => {
  await unsubscribe();
  process.exit(0);
});
