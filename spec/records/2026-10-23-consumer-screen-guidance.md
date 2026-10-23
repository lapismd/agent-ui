# Complete-screen consumer guidance

Requirement: AUI-GOV-001. The first JJ Desktop consumer rebuilt a custom History
layout from primitives despite the completed public screens being available.
The tracked guide, root/package READMEs and consumer map now require those
screens as the default. The host owns native admission, transport, execution,
navigation and lifetime; the package owns screen layout and interaction flow.
Overview and Files share RepositoryBrowser, Stacks and Workspace share
RepositoryStackWorkspace. Legacy `/screens` scaffolds are distinguished from
the completed `/jj` views. The user has authorized the first consumer integration
and reusable appearance/settings work; publication remains separate.

Validation: documentation-only slice; focused Prettier and `pnpm spec:validate`.
Runtime suites are not applicable to this guidance-only change. Native/consumer
implementation and its qualification follow in separate verified slices.
