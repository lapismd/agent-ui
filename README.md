# LapisMD Agent and Repository UI

[![Publish npm packages](https://github.com/lapismd/agent-ui/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/lapismd/agent-ui/actions/workflows/npm-publish.yml)
[![Storybook Pages](https://github.com/lapismd/agent-ui/actions/workflows/publish-storybook-pages.yml/badge.svg)](https://github.com/lapismd/agent-ui/actions/workflows/publish-storybook-pages.yml)
[![npm version](https://img.shields.io/npm/v/@lapismd/agent-ui.svg)](https://www.npmjs.com/package/@lapismd/agent-ui)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785?logo=storybook&logoColor=white)](https://lapismd.github.io/agent-ui/)

Two Svelte 5 libraries compose public Design Core primitives into complete
controller-driven screens. Hosts supply execution and persistence through ports.

Live catalog: <https://lapismd.github.io/agent-ui/>.

Current release preparation requires the shared temporary Bits UI 2.20.2 patch
described in [patches/README.md](patches/README.md). Every installation root must
apply it explicitly; installing either UI package or Core does not propagate
pnpm patches. The actual fixed Core publication and final registry qualification
remain release gates.

## Applications consume complete screens

Mount the public complete screen for each application view. Hosts provide native
adapters, navigation, persistence and controller lifetime; they must not rebuild
the screen layout from graph, file-list and diff primitives. The complete-screen
Storybook families demonstrate the production components to use.

See [Consumer integration](docs/consumer-integration.md) for the screen/export
map, native host responsibilities and styling contract.

## Review delivery

Run `pnpm install`, `pnpm build`, then `pnpm storybook` (port 7490).
Complete Agent screens include Chat, History, Catalog, Imports and Recorded.
Complete repository screens under `/jj` include JJ Log, Op Log, Overview/Files,
Branches and Stacks/Workspace. Older scaffold exports under `/screens` are not
the implementation path for these views. JJ Desktop is the first authorized
consumer; other downstream adoption remains subject to review.
Storybook uses in-memory adapters; simulated actions do not touch repositories,
accounts or services. Visual review remains separate from functional acceptance.

## Validation

`pnpm check`, `pnpm test`, `pnpm build`, `pnpm test:storybook`,
`pnpm test:browser`, `pnpm build-storybook`, `pnpm test:package`, and
`pnpm spec:check`. `pnpm checks` runs the full sequence in one bounded Docker worker. See
[Local validation](docs/local-validation.md) for explicit native execution,
archive qualification, resource limits and retained reports.
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
