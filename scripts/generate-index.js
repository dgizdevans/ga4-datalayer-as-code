// Regenerates schema/index.json from the event schema files.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const eventsDir = path.join(root, "schema", "events");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const entries = fs
  .readdirSync(eventsDir)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => {
    const s = JSON.parse(fs.readFileSync(path.join(eventsDir, f), "utf8"));
    return {
      event: s.title,
      class: s["x-event-class"],
      description: s.description,
      schema: `schema/events/${f}`,
      example: `schema/examples/${s.title}.example.json`,
    };
  });

const index = {
  name: pkg.name,
  version: pkg.version,
  generated_by: "scripts/generate-index.js",
  event_count: entries.length,
  events: entries,
};

fs.writeFileSync(path.join(root, "schema", "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`schema/index.json written (${entries.length} events)`);
