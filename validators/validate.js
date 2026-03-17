const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const [, , schemaArg, dataArg] = process.argv;

if (!schemaArg || !dataArg) {
  console.error("Usage: node validators/validate.js <schema-path> <data-path>");
  process.exit(1);
}

const schemaPath = path.resolve(process.cwd(), schemaArg);
const dataPath = path.resolve(process.cwd(), dataArg);

let schema;
let data;

try {
  schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
} catch (err) {
  console.error(`Failed to read schema: ${schemaPath}`);
  console.error(err.message);
  process.exit(1);
}

try {
  data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (err) {
  console.error(`Failed to read data: ${dataPath}`);
  console.error(err.message);
  process.exit(1);
}

const ajv = new Ajv({
  allErrors: true,
  strict: false
});

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error("Validation failed.");
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}

console.log("Contract is valid.");
