# Storybook catalog Pages

Requirement: AUI-GOV-001. The repository README links the npm-publish workflow,
the Pages workflow, the `@lapismd/agent-ui` npm badge, and the live catalog at
<https://lapismd.github.io/agent-ui/>.
`.github/workflows/publish-storybook-pages.yml` builds with `pnpm build-storybook`
on the native validation runtime and deploys `storybook-static` with GitHub
Actions Pages. Manifest version remains `0.1.0`. npm publication of
`@lapismd/agent-ui` and `@lapismd/repository-ui` stays a separate trusted-publish
decision. The Mira range stays `~0.1.0`. No version tag was created or pushed.

Validation: documentation and workflow slice. Product suites are not applicable.

- `pnpm exec prettier --write` on the changed files passed.
- `AGENT_UI_VALIDATION_RUNTIME=native pnpm check:workflow` passed (actionlint).
- `AGENT_UI_VALIDATION_RUNTIME=native pnpm spec:check` passed: 22 routing lanes
  with 0 findings, 69 catalog families with 0 findings, validate, mdBook, and
  spec-first.

No npm publish and no version tag.
