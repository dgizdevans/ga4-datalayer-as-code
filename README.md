# GA4 Data Layer as Code

Strict GA4 web data layer contract in YAML and JSON Schema.

This repository defines a machine-readable baseline for GA4 data collection through `dataLayer.push(...)`. It is intended to serve as a single source of truth for implementation, QA validation, monitoring, and AI-assisted analysis.

## Why this exists

GA4 tracking often degrades over time because event names, parameter names, and ecommerce item structures are implemented inconsistently across teams and releases.

This repository makes the tracking layer explicit, versioned, reviewable, and testable.

It helps with:

- preventing event and parameter naming drift
- catching schema violations before release
- standardizing ecommerce tracking
- documenting auto-collected and manual events in one place
- giving developers, analysts, validators, and AI systems the same baseline

## Scope

The contract includes:

- auto-collected web events
- enhanced measurement events
- ecommerce events
- other GA4 recommended events
- shared `items` schema
- envelope fields such as `user_id`, `user_properties`, and `event_id`

## Repository structure

```text
ga4-datalayer-as-code/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── contract/
│   └── ga4_web_tracking_contract.yaml
├── schemas/
│   └── ga4_web_tracking_contract.schema.json
├── examples/
│   ├── page_view.json
│   ├── generate_lead.json
│   ├── add_to_cart.json
│   ├── begin_checkout.json
│   └── purchase.json
└── validators/
    └── validate.js
```

## Design principles

- strict top-level validation
- strict event payload validation
- flat dataLayer.push({ event: "...", ...params }) shape
- explicit handling of ecommerce items
- executable validation rules where possible
- one unified contract for implementation and governance

## Human-readable and machine-readable artifacts

The repository keeps the contract in two forms:

- contract/ga4_web_tracking_contract.yaml as the readable source for humans
- schemas/ga4_web_tracking_contract.schema.json as the validation artifact for machines

This makes the contract usable both in implementation discussions and in automated checks.

## Example payload

```
dataLayer.push({
  event: "purchase",
  user_id: "crm_12345",
  user_properties: {
    account_type: "b2b",
    user_tier: "pro"
  },
  transaction_id: "ORD-2026-0001",
  currency: "EUR",
  value: 129.99,
  shipping: 4.99,
  tax: 21.49,
  items: [
    {
      item_id: "sku_1",
      item_name: "Pro Plan",
      price: 129.99,
      quantity: 1
    }
  ]
});
```

## Usage scenarios
### Design-time

Developers and analytics engineers use the contract and the examples/ directory as a reference when implementing tracking.

Typical use cases:

- checking the correct event name and parameter names
- understanding required vs optional fields
- reusing valid ecommerce item structure
- aligning frontend and analytics before release

### Run-time / QA

In test environments, payloads can be validated against ga4_web_tracking_contract.schema.json before or during release checks.

Typical use cases:

- validating example payloads in CI
- validating generated payloads in automated tests
- intercepting dataLayer.push(...) in QA environments and checking schema compliance
- failing builds when undeclared fields or invalid payloads are introduced

### Validation
A minimal validator can be implemented with Ajv.

Example:

```
const Ajv = require("ajv");
const schema = require("../schemas/ga4_web_tracking_contract.schema.json");
const data = require("../examples/purchase.json");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error(validate.errors);
  process.exit(1);
}

console.log("Contract is valid.");
```

## Why examples matter

Developers usually consume examples faster than schemas.

The examples/ directory exists to:

- show valid payload shape
- speed up implementation
- support onboarding
- provide fixtures for validation tests

Examples should always pass validation against the JSON Schema.

## Who this is for

- analytics engineers
- GTM / GA4 implementers
- frontend developers
- QA engineers
- data governance owners
- AI systems that need a stable tracking baseline

## What this is not

This repository is not:

- a GTM container
- a tagging tutorial
- a reporting layer
- a dashboard definition

It is a tracking contract.

## Recommended workflow

Use this repository to:

1. define or update tracking in YAML
2. generate or maintain the JSON Schema artifact
3. validate example payloads
4. validate implementation payloads in CI or QA
3. review contract changes in Git like application code

## Versioning

Changes to any of the following should be versioned and reviewed:

- event names
- required parameters
- validation rules
- ecommerce item structure
- envelope fields
