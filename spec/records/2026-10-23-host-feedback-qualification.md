# Host feedback source qualification

The source implementation at 5a88a348 remains unchanged. This record completes
its static and public packed-consumer lanes; Desktop's native and consumer
matrix remain separate evidence.

- Full affected Agent matrix: `pnpm test:storybook packages/agent-ui/src
catalog/AgentScreens.stories.ts` passes 158 cases in each of four modes,
  632 interaction/accessibility cases total.
- Full check passes with zero errors/warnings and all 405 fingerprints.
- Full units pass 213 cases in 36 files. Both builds/publint and all three
  specification lanes pass.
- `NODE_OPTIONS=--max-old-space-size=3072 pnpm build-storybook` passes and audits
  62 foundation families, 366 variations and five specification chapters. All
  review stories remain visual-pending.
- Final packed consumption: `AGENT_UI_REVIEW_PNPMFILE=.local/migration/current-package-review.pnpmfile.cjs
pnpm test:package` passes strict types with zero errors/warnings, Vite
  production build and all 140 documented public-import examples.

The ordinary packed install first stopped at npm's 404 for the unpublished
`@lapismd/jj-history`. Using the complete Desktop hook then correctly rejected
its attempt to replace this test's primary package tarballs. A sibling-only hook
preserves those fresh primary archives. Long absolute sibling archive paths
then exceeded pnpm's filesystem filename limit. The final temporary review
setup copies the same checksum-verified sibling bytes to short `/tmp` paths;
no product, manifest, lockfile, dependency source or assertion is changed.

The current Design Core sibling archive is 69f48e54. The previously admitted
public JJ History archive has SHA256
`d4ee8ecbb4daee19427a0be0489925d3f013ee2e5a12e73f8016d25e76a115e5`.
The isolated validation setup is intentionally temporary. Ordinary registry
consumption and publication remain release gates, not claims of this migration.
Interrupted static/test attempts do not count as passes. No visual baseline,
installed application or default workspace was changed.
