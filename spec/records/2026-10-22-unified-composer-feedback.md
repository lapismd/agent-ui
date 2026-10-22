# Shared composer feedback and inline comment actions

Live chat errors and warnings now use `ChatMessageComposer.status`, forwarded by
`options.composer.status` in complete transcripts. Controller feedback outranks
advisory warnings. Failed sends keep their exact editable draft; unknown sends
and request responses keep their original recovery identity without replay.
Permission/question refusals use the same attached red metadata. Document and
Classic share this input/footer treatment. Fixed footer actions and keyboard
hints no longer emit another banner. Existing status aliases remain supported;
AgentSendHint now accepts no panel/error props and only shows keyboard guidance.
Canonical docs, examples, variations and the architecture guard cover the API.

The initial complete-screen regression command selected Refused Submission,
Unknown Submission, Request Refused and Request Unknown: 4 failed before repair,
4 passed afterward, each checking both views. A later collision regression found
that an older send refusal with identical wording could suppress a current
request error: 1 failed before, 1 passed after the request-identity correction.
`tests/draft-send-feedback.test.ts` and `tests/agent-requests.test.ts` pass all 15
unit cases. The refreshed focused consumer lane covers 10 directly affected
families, including all 28 complete-screen stories: 97 light-theme and 97
dark-theme stories pass.
Root types have zero errors/warnings. Spec validation, architecture, all 193
source fingerprints, spec-first from `ee2573dd`, package build and publint pass.
The initial consumer story run was cancelled when the user requested the
hover-action correction, before any result; it is not counted as passing.

The T remains last at the right edge. Hover navigation/removal/reply actions now
occupy the same first row through Design Core's native CommentComposer actions
slot, with no hidden action width. The expanded strip includes the shared emoji
picker and aligns its first glyph with the text. Design Core source commits:
`11de5adf` (formatting/emoji) and `e80b252d` (inline action-row correction).
The correction passes all 60 focused source interaction/accessibility stories,
root and strict consumer types, canonical/spec-first and native CSS audits.
Agent UI's complete inline-comment story also checks the shared row geometry.

The ignored review hook consumes the source-inclusive archive
`lapismd-design-core-0.6.0-agent-requests-inline-actions-review.tgz`, SHA-256
`fbd723037593a44a7ed1f8e1af2db73241e054bd4be5985af7f6ff3e9bbf13a6`.
Manifests and the portable registry lockfile remain unchanged. Source package
CSS audits 267 styles with zero remaining utilities. Storybook was restarted
on this workspace's port 7590 after the dependency refresh. CUA visual review
confirms the actions inside the comment before the T and the emoji strip below.
Review screenshot: `.local/inline-comment-formatting-review.png`.

Fresh-browser acceptance starts an isolated Storybook on 7498 and passes all
5 selected cases: native inline hover/focus geometry, retained-source row gap,
Document failed-send ownership, trailing document buffer and Classic attached
feedback. The existing 7590 review instance remains running. Exact commands:

```sh
pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts -t '^(Refused Submission|Unknown Submission|Request Refused|Request Unknown)$'
pnpm exec vitest run --project unit tests/draft-send-feedback.test.ts tests/agent-requests.test.ts
pnpm exec playwright test --config tests/catalog-browser.config.ts tests/transcript-review.pw.ts -g 'Inline comment hover|Document failed send|Classic failed send|Document composer keeps|Retained unavailable comments'
```

Publication, dependency minimum/registry adoption, Desktop/JJ Store/downstream
changes, broad qualification and visual baselines remain deferred for review.
