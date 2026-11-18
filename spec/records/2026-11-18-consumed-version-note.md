# Consumed managed Changeset in a genuine version candidate

AUI-GOV-005/007 retain the [captured Git/JJ runtime guard](2026-11-18-generated-runtime-intake-git-range.md),
three-owner policy, immutable registry facts and separate protected npm publisher.
This repair changes no package/dependency/version, publishing workflow or audit.

## Actual failure and source repair

The dependency App merges genuine PR42 head
`168370edae6fed3002a86e00b57d271fe130912b` to
`e2a5a2c1b0b04292c66802b05b4c6f04b31ac0d8`; source main verification,
Pages and version preparation pass. Normal Changesets preparation creates PR44
head `132253140123edd0bc4649dac6616e9b5b0d98d2` for actual
Agent UI0.2.9/Repository UI0.2.7. Its exact six-file diff changes only the two
versions/changelogs and consumes the earlier empty note and real runtime note.

Both Governance and Quality fail in run44236546742 because the source wrapper
attempts to read `.changeset/lapis-dependencies-6882649476db.md` after it has
been legitimately consumed. Unit/package/static jobs pass; these do not waive
the owning source failures or qualify publication.

The wrapper now distinguishes an absent current entry with `lstat` before its
unchanged regular-file read. It retains every captured changed path. Existing
notes still require source-contained regular files; directories, live/external
and dangling symlinks fail. During actual runtime intake, a missing managed note
still fails the required release-map check. Version-only note consumption with
unchanged dependency facts does not become a dependency rewrite or release bypass.
Only the source reader test port is injectable; production invokes the same
captured immutable default reader with no override.

## Regression and delivery boundary

The fixture retains exact public bytes from the actual immutable PR44 pair and
unmodified real Git diff. Tests use the public SDK diff parser and existing
Git/JJ transport ports; no Git write, new checkout, installed JJ dependency or
fabricated version/note is needed. Two actual-version transports reproduce
ENOENT. A third assertion initially sees the loader error rather than the
required runtime-note refusal. After the repair all eight tests pass, including
the original genuine runtime candidate and four nonregular-path controls.
The first fixture setup lacked the reader test port and is not counted as a
product failure. No acceptance assertion or byte/map/identity scope is loosened.

Fresh source checks, exact source/main CI, normal regeneration of bot-owned PR44,
protected version review, immutable tag publication and original-artifact/npm
provenance acceptance remain separate gates. Do not patch the bot branch or
create predicted package tags before its reviewed version main qualifies.

## Source verification and actual automation evidence

All eight focused cases pass. The default bounded Docker runtime passes root
`pnpm check` (zero Svelte errors/warnings), `pnpm test` (92 Node controls,
12 runtime controls and239 UI units), both package builds/publint and
`pnpm spec:check` (three canonical lanes/eight version-auth tests). Frozen source
installation, formatting, doctor and semantic QMD also pass. The first check
correctly rejects two multi-sentence acceptance bullets; single-sentence contracts
restore atomic validation without increasing the existing400-line chapter bound.
No product, Storybook, native or visual assertion/baseline changes occur.

Native coordinator run44235559549 logs PR42 automerged at04:19:15Z. GitHub records
merge at04:19:14Z by `lapismd-dependency-bot[bot]` (ID351186875), matching
`e2a5a2c1`. Its original first-party-inventory artifact14397492019 ZIP verifies
SHA256 `ece661eadc29e4cf4031be74bde77b187f880f29454119afca797206e0a57f71`.
Operation `6143321b209e49def1a945c4d1bdf89ccad898af83557bcbcd29fa2696bb5305`
binds run44235559549, source605a94c6, qualified source acceptance, bot ownership
and three actual Core0.13.5 targets. The inventory still observes candidate CI
running; the native writer later merges after its actual current-head checks pass.
This proves the real native flow, not a manual merge or a future-publication claim.
