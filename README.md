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
`pnpm test:browser`, `pnpm build-storybook`, `pnpm test:package`, and
`pnpm spec:check`. `pnpm checks` runs the full sequence.
Visual review remains pending; no screenshot baselines are updated.

## Ownership

`@lapismd/agent-ui` owns agent presentation. `@lapismd/repository-ui` owns
repository/workspace presentation. Design Core owns the generic primitives.
Applications own native admission, credentials, domain execution and durability.

## Component documentation

Under **Agents**, Foundations and Chat building blocks precede the complete
screens. Each independent component family owns a kebab-case folder containing
its Svelte component, `*.stories.ts`, `*.mdx`, `*.example-sources.ts` and
`*.tokens.json`. Private compound parts have an explicit owning family in
`docs/agent-component-families.json`; adding an unowned component fails validation.

Documentation follows Design Core Chat: Usage, Anatomy, rendered Variations,
Behavior and accessibility, Styling variables, API and Composition. Examples use
public package imports and highlighted `tsx` source. The styling table renders
from the token contract, including defaults and ownership, and validation checks
those defaults against the owning CSS. `pnpm test:package` compiles every example
against clean package archives and rejects catalog files in those archives.

`pnpm spec:validate` runs both Design Core's published Storybook source checks
and this repository's `agentFoundations` plugin. Missing documentation structure,
variation previews, styling variables, source defaults or public examples fail
the normal check and CI lanes. `pnpm build-storybook` also audits the built index.

The brand dropdown selects Default/Lapis independently of the light/dark toggle.
Markdown supports GFM tables. Documentation shell previews are 40rem high with
no preview-wrapper padding; Canvas uses the full viewport. These rules size only
the catalog host and preserve the production components' own geometry.
