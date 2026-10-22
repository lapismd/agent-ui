# Pinned permission request panel

Active permissions now replace the message editor with a themed expandable
request panel outside transcript scrolling, above the fixed chat actions in
Document and Classic. The original draft remains in its controller and returns
when the request completes or is dismissed. Questions retain their existing
presentation. A bounded keyboard-scrollable details region keeps long requests
usable on narrow viewports while streamed history remains independently scrollable.

The far-right X dismisses only the matching local session/request presentation.
It never grants, denies, dispatches or replays a host response. Refresh preserves
dismissal, stale callbacks are rejected, and a different request appears normally.
Dismissal clears that request's refusal feedback, preserving independent send
errors. An unknown submitted response keeps its original pending identity,
warning and Check original response recovery action after dismissal.

Before/after evidence: Permission Dock failed once before fixed placement;
Permission Dismissed failed once before the close control; the dismissal unit
regression failed once before the scoped API. Repaired exact permission stories
pass 4/4. Focused request/send-feedback units pass 17/17. All 10 directly affected
Agent story families pass 102/102 in light and 102/102 in dark, including their
interaction/accessibility assertions. Root types have zero errors/warnings.
Architecture, 193 source-layout fingerprints, canonical specification validation
(9 validators, 5 chapters, 22 requirements), package build and publint pass.

A fresh isolated Storybook on 7498 passes 4/4 browser cases: pinned panel through
streaming/scrolling/view switching at 420px, local dismissal with retained draft
and no dispatch, refused-request dismissal, and Document/Classic failed-send
feedback ownership. The existing review instance remains on 7590. CUA review confirms the pinned
panel and right-aligned X; screenshot: `.local/pinned-permission-review.png`.

```sh
pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts -t '^(Permission Dock|Permission Restores Draft|Permission Dismissed|Permission Dismissed Unknown)$'
pnpm exec vitest run --project unit tests/draft-send-feedback.test.ts tests/agent-requests.test.ts
pnpm exec playwright test --config tests/catalog-browser.config.ts tests/permission-dock.pw.ts tests/transcript-review.pw.ts -g 'Permission panel|Dismissed refused|Document failed send|Classic failed send'
pnpm --filter @lapismd/agent-ui build
pnpm check:architecture
pnpm check:source-layout
pnpm spec:check
pnpm spec:first --base 3cb7b8a8 --head @
```

The copied drawer/footer ledger records explicitly authorized layout adaptations
against 3cb7b8a8. New variables, public usage and standalone collapsed/expanded
examples are documented. Publication, downstream adoption, broad qualification
and visual baselines remain deferred for user review; all stories stay visual-pending.
