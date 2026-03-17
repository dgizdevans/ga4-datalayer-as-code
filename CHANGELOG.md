# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning for contract changes.

## [Unreleased]

### Planned
- JSON Schema export aligned 1:1 with the YAML contract
- Ajv-based validator CLI
- Validated example payloads
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
