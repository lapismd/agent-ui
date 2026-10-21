# Delivery and review gate

| Milestone                         | Status                    | Gate                                                               |
| --------------------------------- | ------------------------- | ------------------------------------------------------------------ |
| Foundation and source inventory   | Ready for Agent review    | Portable packages, canonical contracts and source ledger           |
| Repository screens                | Deferred for Agent review | Browsing/history/workspace/forge/settings with in-memory adapters  |
| Agent screens                     | Awaiting visual review    | Five source-derived Agent screens with in-memory adapters          |
| Integrated Storybook and archives | Verified for Agent review | Functional, accessibility, type, spec and clean package acceptance |
| User review                       | Pending                   | Explicit approval required before any downstream change            |
| Consumer migration                | Deferred                  | Only after user review approval                                    |

No downstream application/service, native contract, publication or deployment
belongs to the pre-review delivery. Native execution is not qualified by fixtures.

Current delivery is the Agent section only. Complete faithful source extraction and
interactive review stories for Chat, History, Catalog, Imports and Recorded,
then stop for user review. Standalone settings screens are excluded.
Repository/Combined screens are outside this slice.

Validation and before/after counts are recorded in
`spec/records/2026-10-21-agent-review.md`. The catalog shows only the Agent review
slice. Do not continue Repository or downstream work until the user reviews it.
