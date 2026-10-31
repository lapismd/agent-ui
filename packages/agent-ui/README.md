# @lapismd/agent-ui

Source-derived Svelte 5 screens for Chat, History, Catalog, Imports and Recorded
transcripts. Original Desktop AppShell boundaries and CSS are retained. Standalone
settings pages are excluded; inline chat controls remain available.

Hosts own `AgentUiController` and `ImportController`, supply typed ports, and close
them on teardown. Mounting a screen does not start a native service. Session frame,
header, thread and shell components are exported for workspace composition.

The root Storybook uses in-memory adapters. Source fingerprints and the review
record live in the repository’s `docs` and `spec/records` directories. Native
host adoption and visual approval retain their separate qualification gates.

## Required dependency setup

Configure the shared temporary Bits UI 2.20.2 lifecycle/focus repair in each
application's pnpm installation root. Copy `patches/bits-ui@2.20.2.patch` from
[the released Core package](https://github.com/lapismd/design-core/releases/tag/design-core%400.7.4) into the application's `patches/`
directory and verify SHA-256
`debd3bc7d43917f0967f0cc1e212fc5c7721c751d3b92bf8f31030d1c96289ad`.

```json
{
  "pnpm": {
    "overrides": {
      "bits-ui": "2.20.2"
    },
    "patchedDependencies": {
      "bits-ui@2.20.2": "patches/bits-ui@2.20.2.patch"
    }
  }
}
```

Regenerate and commit that root's lockfile, then use frozen installs. The
published dependency's pnpm settings do not configure the application root.
Core's packaged `patches/manifest.json` and `patches/README.md` retain the exact
registry/file identities, all three owner fixes and removal requirements. Remove
the patch only after the resolved released dependency contains all three repairs
and the source, package and consumer acceptance passes without it.
