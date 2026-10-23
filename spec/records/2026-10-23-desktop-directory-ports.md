# Desktop directory presentation ports

AUI-SCREEN-001 and AUI-LIFE-001 expose structural presentation inputs on the
complete History, Catalog and Imports screens. Desktop retains App-owned search,
workspace scope events, registry admission, native progressive source validation,
raw capture saving and disposal. Package-owned markup/styles remain the sole
screen representation. Existing controller-based consumers retain their defaults.
Import options are read-only transcript presentation hooks.

- Before: Desktop could not mount these complete screens while retaining its
  App-owned orchestration; the public types required package controller classes.
- `pnpm check`: passes, including 0 Svelte errors/warnings, architecture,
  405 source fingerprints, specification validation and formatting.
- `pnpm test:storybook catalog/AgentScreens.stories.ts`: 128 passes (32 stories
  in light/dark and desktop/narrow), including History, Catalog and Imports.
- `pnpm spec:check`: 3 lanes passed.
- `pnpm build`: both public packages and publint passed.
- Native consumer and visual qualification remain separate. No baseline updated.
