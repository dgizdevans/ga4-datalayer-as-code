// Compiles every shared and event schema with Ajv (draft 2020-12).
// Fails the build if any schema does not compile.
const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");

const root = path.resolve(__dirname, "..");
const sharedDir = path.join(root, "schema", "shared");
const eventsDir = path.join(root, "schema", "events");

const ajv = new Ajv2020({ allErrors: true, strict: false });

for (const f of fs.readdirSync(sharedDir).filter((f) => f.endsWith(".json"))) {
  ajv.addSchema(JSON.parse(fs.readFileSync(path.join(sharedDir, f), "utf8")));
}

let failed = 0;
const eventFiles = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".json")).sort();
for (const f of eventFiles) {
  const schema = JSON.parse(fs.readFileSync(path.join(eventsDir, f), "utf8"));
  try {
    ajv.compile(schema);
    console.log(`OK   ${f}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${f}: ${err.message}`);
  }
}

console.log(`\n${eventFiles.length - failed}/${eventFiles.length} schemas compiled`);
if (failed > 0) process.exit(1);
