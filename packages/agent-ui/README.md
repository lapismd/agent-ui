# @lapismd/agent-ui

Source-derived Svelte 5 screens for Chat, History, Catalog, Imports and Recorded
transcripts. Original Desktop AppShell boundaries and CSS are retained. Standalone
settings pages are excluded; inline chat controls remain available.

Hosts own `AgentUiController` and `ImportController`, supply typed ports, and close
them on teardown. Mounting a screen does not start a native service. Session frame,
header, thread and shell components are exported for workspace composition.

The root Storybook uses in-memory adapters. Source fingerprints and the review
record live in the repository’s `docs` and `spec/records` directories. Downstream
adoption and publication await explicit user review.
