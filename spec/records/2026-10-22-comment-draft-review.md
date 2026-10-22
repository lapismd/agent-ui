# Expanded quote surfaces and empty comment drafts

Design Core owns both fixes in source commit fe4a6a3a. Expanded transcript quotes
inherit their enclosing surface through Mira's public preview-background token;
prose and captured code no longer add a tint. The editor handles plain Backspace
only when its document was already empty, invoking existing host removal or
dismissal callbacks. Removing the final character leaves the inline editor open;
modified/repeated keys, IME and blocked editors cannot remove it.

Source evidence is in Design Core's
`spec/records/2026-10-22-empty-comment-drafts.md`: 3 original regressions fail,
15 focused cases pass, 71 affected interaction/accessibility cases pass, 28 unit
cases pass, all public/root types and canonical/native CSS checks pass. The
source-inclusive prepared archive audits 267 styles without remaining utilities.

The ignored review hook now consumes
`lapismd-design-core-0.6.0-agent-requests-empty-comments-review.tgz`, SHA-256
`5e49e62953d1aacfb026b7fc35e4166dd5a92e495451d95dc6b3703cd3b7e740`.
The portable manifests and registry lockfile are unchanged. This is a documented
local validation overlay, not package publication or downstream adoption.
Storybook on 7590 was restarted after installation.

Consumer qualification: four directly affected families (complete screens,
Transcript, tool inspector and session frame) pass 51/51 in light and 51/51 in
dark. Root types have zero errors/warnings. Architecture, all 193 copied-source
fingerprints, canonical validation/mdbook and spec-first pass. Registering the
new browser family initially lacked its governance-chapter update; adding the
owning requirement repaired that check without changing its guard.

The initial browser attempt had three failures: two input assertions followed
unsupported direct contenteditable fill instead of CodeMirror keyboard input;
the third preview did not render during that run. The final isolated cold
Storybook run drives real keyboard events and passes all three cases. It proves
last-character deletion retains the editor, the next Backspace removes only that
draft in both views, the saved sibling comment/source survive, and expanded
quotes share their parent surface in light and dark. No readiness assertion or
product expectation was relaxed.

```sh
pnpm exec playwright test --config tests/catalog-browser.config.ts tests/comment-drafts.pw.ts
pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts packages/agent-ui/src/chat/transcript/AgentTranscript.stories.ts packages/agent-ui/src/chat/transcript-tool-inspector/AiTranscriptToolInspector.stories.ts packages/agent-ui/src/sessions/session-frame/AiSessionFrame.stories.ts
CATALOG_THEME=dark pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts packages/agent-ui/src/chat/transcript/AgentTranscript.stories.ts packages/agent-ui/src/chat/transcript-tool-inspector/AiTranscriptToolInspector.stories.ts packages/agent-ui/src/sessions/session-frame/AiSessionFrame.stories.ts
pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings
pnpm check:architecture
pnpm check:source-layout
pnpm spec:check
pnpm spec:first --base d8087372 --head @
```

CUA review confirms the quote blending into the expanded context. Screenshot:
`.local/comment-quote-background-review.png`. The earlier pinned permission panel
and far-right X remain committed at d8087372, with their own focused evidence.
Stories remain visual-pending. Broad suites, publication, visual baselines and
Desktop/JJ Store/downstream adoption remain deferred for review.
