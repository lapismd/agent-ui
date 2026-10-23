# Captured send feedback

Desktop's shared-screen matrix exposed two simultaneous alerts for a refused
send: the host's new captured error notice and the controller's attached
composer feedback. Both described the same outcome.

The shared controller now records the ID of a new exact error notice published
by that send in the current session. Composer feedback is suppressed only while
that notice remains present with the same source. Historical matching wording,
other sessions and removed or changed notices retain ordinary feedback. Unknown
outcomes keep their existing recovery identity and cannot replay.

- Exact regression: `pnpm exec vitest run --project unit
tests/draft-send-feedback.test.ts -t 'captured send notices'`: one failure,
  one pass and four skipped before the fix.
- After: the complete owning file passes all six cases, including historical
  notice protection and feedback restoration when a notice is removed.
- The production Transcript has a new Captured refusal feedback variation for
  both views, retaining the draft and proving one alert and one dispatch.

`pnpm check` passes with zero errors/warnings, formatting, architecture and all
405 source fingerprints. Initial architecture checks caught the controller's
300-line budget; the pure notice helper and its state type now have their own
owning file without changing the limit. `pnpm test` passes all 213 cases in 36
files. Both package builds/publint checks pass, and `pnpm spec:check` passes all
three lanes.

The exact new story passes in all four viewport/theme modes after scoping its
composer query independently from captured readers. The wider Agent surface
matrix has passed 156 scenarios each in desktop/light and narrow/light; its two
dark modes and Desktop's original duplicate-feedback targets remain pending.
Visual review, final static acceptance and publication remain separate.
