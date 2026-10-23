# Registered Threads inbox

AUI-THREAD-001 adapts JJ Store's CommunityInbox, grouped conversation rows,
compact source geometry and bounded pointer/keyboard resize. The source ledger
records revision `42ae3473081a50b5acfbd2a763421af18d4608d0`, exact file hashes,
Apache-2.0 provenance and explicit adaptations. No source application changed.

`ThreadsController` reads registered homes in batches of twenty with four
concurrent reads. Each home's pagination binds its snapshot and home; duplicate
rows, foreign homes and repeated cursors fail independently. Late scope reads
cannot replace a newer view. The read-only port cannot activate code or mutate.

`ThreadsScreen` composes the source inbox with an existing complete
AgentChatScreen supplied by the host. Conversation controllers and drafts use
home plus thread identity. Navigation composes in the chat header, with no
duplicate toolbar. The optional attached panel uses the public AppShell.

Before: `pnpm exec vitest run --project unit tests/threads-directory.test.ts`
failed one suite because the new controller did not exist. After implementation,
all six directory boundary tests pass. The first Storybook run had nine failed
and two passed cases: visible row text was absent from the accessible name, and
panel closure did not restore focus. Rows now use their native accessible text;
the panel's effect no longer tracks its own shell state and restores the opener.
The unchanged target passes all eleven cases in light/dark and desktop/narrow:
44 interaction/accessibility cases, zero failures.

Cold browser acceptance initially had two failed draft cases and one passed
resize case because the test selected both the read-only message reader and
editable composer. Its locator now names the owning Message composer group.
The follow-up exposes a real narrow-window navigation bug: an implicit body
toggle resolves the nested chat shell instead of its owning inbox. The source's
explicit shell callback and public PanelToggleIcon fix that ownership boundary.
Further empty-document assertions correctly use disabled Send and absence of
the other home's draft, since CodeMirror renders placeholder text in its DOM.
Three browser attempts report two failures/one pass each during this work; one
additional cold startup times out under concurrent catalog builds. The exact
unchanged browser command then passes all three cases from a fresh server,
without changing deadlines. Both viewport cases retain the original home's
draft after visiting the other home and verify that it never leaks there.

Final source verification:

- `pnpm check`: spec, architecture, source fingerprints, types and formatting pass.
- `pnpm test`: 211 tests pass, zero failures.
- `pnpm test:storybook packages/agent-ui/src/threads/screen/ThreadsScreen.stories.ts`:
  44 interaction/accessibility cases pass after the ownership fix.
- `pnpm test:browser threads-inbox.pw.ts`: three cold browser cases pass.
- `pnpm build-storybook`: both packages/publint, static catalog and audit pass.
- Clean package acceptance requires the documented ignored review pnpmfile:
  ordinary registry resolution cannot find unpublished siblings. With the review
  overlay, type checking and Vite consumption pass for all 142 documented public
  examples. No catalog material leaks into the packed packages.

Review stories: `agents-complete-screens-threads--layout`, `--conversation`,
`--search`, `--empty`, `--loading`, `--disabled`, `--unavailable`, `--partial`,
`--pagination` and `--details`. Visual review remains pending; baselines unchanged.

This is the inbox and composition boundary. Native adoption, replies, reactions,
conversation settings and cross-home execution remain unfinished. The fixture's
contributors exercise the host slot rather than claim a complete native panel.
The existing nine wider Design Core pointer failures remain separately open;
this slice does not waive them or declare the larger integration plan complete.

Native adoption exposed a further nested-width handoff: the inherited 1024px
breakpoint treated the application's available body as a small screen, and host
creation bypassed the row callback that reveals the conversation. The inbox now
uses its source list/conversation geometry's 704px boundary and reacts to an
explicit host selection without tracking its own stage changes. The Create Thread
story exercises that path in both modes and widths. Browser assertions additionally
wait for the exact home's selection marker, including in the inactive mobile
panel, so review screenshots cannot capture a previous selection's paint.
Follow-up `pnpm check` and `pnpm spec:check` pass. The exact story target passes
48 interaction/accessibility cases; all three cold browser cases pass with the
new selection assertions. The owning public package build/publint passes.
Native first-consumer acceptance and broader final qualification remain open.
