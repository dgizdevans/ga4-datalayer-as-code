# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning for contract changes.

## [5.0.0] - 2026-07-20

Full restructure from a monolithic contract to composable per-event schemas, driven by production experience with the previous version.

### Added
- `schema/events/` — 48 event schemas, one file per event, reviewable in isolation
- `schema/shared/` — 7 composable definition schemas (`envelope`, `common_web_params`, `identity_params`, `item`, `items`, `single_item`, `money_dependency`) composed into events via `allOf` + `$ref`
- `schema/examples/` — 48 paired example payloads; every schema must have exactly one validating example
- `x-event-class` annotation on every event (`auto_collected` / `enhanced_measurement` / `ecommerce` / `recommended`)
- `x-pii` and `x-sensitivity` annotations on every field
- `scripts/validate-schemas.js` — compiles all schemas (Ajv, draft 2020-12), CI-ready
- `scripts/validate-examples.js` — validates schema/example pairing and every payload, CI-ready
- `scripts/generate-index.js` — generates `schema/index.json`
- `scripts/generate-docs.js` — generates `docs/EVENTS.md`

### Changed
- Strictness model: `unevaluatedProperties: false` replaces `additionalProperties: false`, because `additionalProperties` cannot see fields declared in `allOf`-referenced schemas — composition and strictness now coexist
- Custom parameters document values with `examples` instead of `enum`; closed lists on business-defined fields caused false validation failures in production (`purchase.customer_type` migrated)
- The human-readable event reference is now generated (`docs/EVENTS.md`) from the schemas instead of being maintained in parallel
- `money_dependency` (`value` ⇒ `currency`) is composed only on events where `value` is monetary; `earn_virtual_currency` and `spend_virtual_currency` intentionally omit it

### Removed
- `contract/ga4_web_tracking_contract.yaml` — the parallel human-readable contract; duplication with the JSON Schema caused drift, and the readable form is now a generated artifact
- `schemas/ga4_web_tracking_contract.schema.json` — the 3,500-line monolith, replaced by per-event files
- `validators/validate.js` and per-example npm scripts — replaced by the paired-example validator covering all events

## [Unreleased]

### Planned
- CI workflow for schema and example checks

## [4.0.0] - 2026-03-17

### Added
- Unified GA4 web tracking contract in YAML
- Coverage for auto-collected web events
- Coverage for enhanced measurement events
- Coverage for ecommerce events
- Coverage for other GA4 recommended events
- Shared `item_schema`, `items_array`, and `single_item_array`
- Envelope support for `event_id`, `user_id`, `user_properties`, and `debug_mode`
- Common web parameters baseline
- Identity/session parameter baseline
- Executable dependency rule for `currency` when `value` is present
- Strict event-level validation model
- Support for item-scoped custom parameters via `patternProperties`
- Explicit item custom parameter cap metadata

### Changed
- Reorganized contract structure to put baseline web events first, ecommerce second, and other recommended events after that
- Anchored `purchase` and `refund` under ecommerce
- Reframed the repository as a single source of truth for implementation, QA, monitoring, and AI-assisted analysis

### Fixed
- Removed permissive top-level contract behavior in favor of strict validation
- Added `user_properties` after gap was identified in earlier drafts
- Replaced non-executable dependency notes with schema-style validation keywords
- Removed broken YAML anchor usage from earlier draft structure
- Tightened item schema handling while preserving GA4 item-level extensibility

### Notes
- This version is the first repository baseline intended for Git-based review and future CI validation.
