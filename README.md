# GA4 Data Layer as Code

Strict GA4 web dataLayer contract as composable JSON Schema files.

This repository defines a machine-readable baseline for GA4 data collection through `dataLayer.push(...)`. It serves as a single source of truth for implementation, QA validation, monitoring, and AI-assisted analysis.

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

The contract covers 48 GA4 web events:

- auto-collected events (`first_visit`, `session_start`, `user_engagement`)
- enhanced measurement events (`page_view`, `scroll`, `click`, file, form, and video events)
- all GA4 ecommerce events, including the lead lifecycle
- other GA4 recommended web events

App-only events (`screen_view`, `ad_impression`) and Measurement-Protocol-only events (`campaign_details`) are intentionally out of scope.

## Repository structure

```text
ga4-datalayer-as-code/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── schema/
│   ├── shared/          # 7 composable definition schemas
│   │   ├── envelope.json
│   │   ├── common_web_params.json
│   │   ├── identity_params.json
│   │   ├── item.json
│   │   ├── items.json
│   │   ├── single_item.json
│   │   └── money_dependency.json
│   ├── events/          # 48 event schemas, one file per event
│   ├── examples/        # 48 paired example payloads
│   └── index.json       # generated event index
├── scripts/
│   ├── validate-schemas.js
│   ├── validate-examples.js
│   ├── generate-index.js
│   └── generate-docs.js
└── docs/
    └── EVENTS.md        # generated event reference
```

## Design principles

- one schema file per event, reviewable in isolation
- shared definitions composed via `allOf` + `$ref` — every field is defined once
- strict payloads: `unevaluatedProperties: false` across the whole composition
- flat `dataLayer.push({ event: "...", ...params })` shape
- `examples` on business-defined parameters, `enum` only for genuinely closed lists
- governance metadata on every event and field: `x-event-class`, `x-pii`, `x-sensitivity`
- every schema has exactly one validating example; the validator enforces the pairing
- human-readable artifacts (`docs/EVENTS.md`, `schema/index.json`) are generated from the schemas, never maintained in parallel

## Anatomy of an event schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "add_to_cart",
  "type": "object",
  "x-event-class": "ecommerce",
  "allOf": [
    { "$ref": "../shared/envelope.json" },
    { "$ref": "../shared/common_web_params.json" },
    { "$ref": "../shared/money_dependency.json" }
  ],
  "required": ["event", "items"],
  "properties": {
    "event": { "const": "add_to_cart" },
    "currency": { "type": "string", "pattern": "^[A-Z]{3}$" },
    "value": { "type": "number" },
    "items": { "$ref": "../shared/items.json" }
  },
  "unevaluatedProperties": false
}
```

Shared sets compose via `allOf`. Event-specific fields are declared inline with `description`, `examples`, `x-pii`, `x-sensitivity`. The `money_dependency` rule (`value` ⇒ `currency`) is composed only on events where the value is monetary; virtual-currency events intentionally omit it.

## Example payload

```js
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

## Usage

```bash
npm install
npm run validate            # compile all schemas + validate all examples
npm run validate:schemas
npm run validate:examples
npm run generate            # regenerate schema/index.json and docs/EVENTS.md
```

## Usage scenarios

### Design-time

Developers and analytics engineers use the event schemas and `schema/examples/` as a reference when implementing tracking:

- checking the correct event name and parameter names
- understanding required vs optional fields
- reusing valid ecommerce item structure
- aligning frontend and analytics before release

### Run-time / QA

In test environments, payloads can be validated against the event schemas before or during release checks:

- validating example payloads in CI
- validating generated payloads in automated tests
- intercepting `dataLayer.push(...)` in QA environments and checking schema compliance
- failing builds when undeclared fields or invalid payloads are introduced

## Why examples matter

Developers usually consume examples faster than schemas.

The `schema/examples/` directory exists to:

- show valid payload shape
- speed up implementation
- support onboarding
- provide fixtures for validation tests

Every event schema has exactly one paired example, and `npm run validate:examples` fails on a schema without an example, an orphan example, or an example that does not validate.

## Workflow

1. Add or change an event: edit exactly one schema file and its paired example.
2. Run `npm run validate`.
3. Run `npm run generate` to refresh the index and docs.
4. Open a PR. The diff is the contract change.

## Versioning

Changes to any of the following are versioned and reviewed:

- event names
- required parameters
- validation rules
- ecommerce item structure
- envelope fields
- shared definitions

See [CHANGELOG.md](CHANGELOG.md) for the history, including the 5.0.0 restructure from a monolithic contract to composable per-event schemas.

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
