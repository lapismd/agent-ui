# Governance

Component-family documentation is enforced by the repository-owned
`agentFoundations` validator plugin, loaded by the published spec-validator.
The inventory explicitly assigns private compound parts to documented families;
a new independent component requires its own colocated contract.

The tracked AGENTS guide records the source-copy, per-family documentation,
token, controller and Storybook workflow for both packages; newly reviewed JJ
families MUST use the same fail-closed structure as Agent foundations.
The user has authorized a Desktop-derived JJ history review slice while Agent
visual review remains pending; jj-store workspace/provider/settings screens and
downstream migration remain outside that slice.

## AUI-GOV-001 — Source ownership

**Requirement.** Production packages MUST consume public Design Core primitives and injected host ports without application-private imports, credentials, native transports or catalog dependencies.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## AUI-GOV-002 — Complete review

**Requirement.** Storybook MUST demonstrate complete production screens with isolated in-memory adapters and MUST NOT require live services. Consumer migration and publication MUST wait for explicit user review approval.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## AUI-GOV-003 — Evidence

**Requirement.** Protected changes MUST update their owning contract and verification evidence. Functional and accessibility failures MUST remain explicit; visual baselines MUST NOT change without approval.

Specification validation MUST keep the Desktop transcript coverage inventory
complete, with existing production components and review stories for every mapped
renderer. It MUST reject missing mappings, components and catalog scenarios.
Source-package review archives MAY be used through an ignored, documented
validation overlay; published manifests and lockfiles MUST retain registry ranges.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.
