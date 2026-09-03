import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Latest beer/coffee for the Journal landing page's "Currently Drinking"
// section. Beer's `recentCheckin` is real Untappd data, present on every
// entry. Coffee only has a date when it's been rated (`review.datePublished`)
// — unrated entries are skipped for "latest" purposes, there's no date to
// go on.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readJson = (name) =>
  JSON.parse(readFileSync(path.join(__dirname, name), "utf8"));

const beers = readJson("beerCollection.json").beers;
const coffees = readJson("coffeeCollection.json").records;

const latestBeer = beers.reduce((a, b) =>
  b.recentCheckin > (a?.recentCheckin || "") ? b : a
, null);

const ratedCoffees = coffees.filter((c) => c.review && c.review.datePublished);
const latestCoffee = ratedCoffees.reduce((a, c) =>
  c.review.datePublished > (a?.review.datePublished || "") ? c : a
, null);

export default { beer: latestBeer, coffee: latestCoffee };
