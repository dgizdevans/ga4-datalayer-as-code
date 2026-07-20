// Validates every example against its paired event schema.
// Fails on: an event schema without an example, an example without a schema,
// or an example that does not validate.
const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");

const root = path.resolve(__dirname, "..");
const sharedDir = path.join(root, "schema", "shared");
const eventsDir = path.join(root, "schema", "events");
const examplesDir = path.join(root, "schema", "examples");

const ajv = new Ajv2020({ allErrors: true, strict: false });
for (const f of fs.readdirSync(sharedDir).filter((f) => f.endsWith(".json"))) {
  ajv.addSchema(JSON.parse(fs.readFileSync(path.join(sharedDir, f), "utf8")));
}

const events = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
const examples = fs.readdirSync(examplesDir).filter((f) => f.endsWith(".example.json")).map((f) => f.replace(/\.example\.json$/, ""));

let failed = 0;

for (const e of events) {
  if (!examples.includes(e)) {
    console.error(`FAIL ${e}: schema has no paired example`);
    failed += 1;
  }
}
for (const e of examples) {
  if (!events.includes(e)) {
    console.error(`FAIL ${e}: example has no paired schema (orphan)`);
    failed += 1;
  }
}

for (const e of events.filter((e) => examples.includes(e)).sort()) {
  const schema = JSON.parse(fs.readFileSync(path.join(eventsDir, `${e}.json`), "utf8"));
  const data = JSON.parse(fs.readFileSync(path.join(examplesDir, `${e}.example.json`), "utf8"));
  const validate = ajv.compile(schema);
  if (validate(data)) {
    console.log(`OK   ${e}`);
  } else {
    failed += 1;
    console.error(`FAIL ${e}:`);
    console.error(JSON.stringify(validate.errors, null, 2));
  }
}

console.log(`\n${events.length - failed >= 0 ? events.length : 0} events checked, ${failed} failure(s)`);
if (failed > 0) process.exit(1);
