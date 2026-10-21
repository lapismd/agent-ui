# LapisMD Agent and Repository UI

Two Svelte 5 libraries compose public Design Core primitives into complete
controller-driven screens. Hosts supply execution and persistence through ports.

## Review delivery

Run `pnpm install`, `pnpm build`, then `pnpm storybook` (port 7490).
The current review slice contains Chat, History, Catalog, Imports and Recorded.
Standalone settings screens are excluded; Repository/Combined remain deferred.
Storybook uses in-memory adapters; simulated actions do not touch repositories,
accounts or services. Stop for explicit review before downstream adoption.

## Validation

`pnpm check`, `pnpm test`, `pnpm build`, `pnpm test:storybook`,
`pnpm build-storybook`, `pnpm test:package`, and `pnpm spec:check`.
Visual review remains pending; no screenshot baselines are updated.

## Ownership

`@lapismd/agent-ui` owns agent presentation. `@lapismd/repository-ui` owns
repository/workspace presentation. Design Core owns the generic primitives.
Applications own native admission, credentials, domain execution and durability.
