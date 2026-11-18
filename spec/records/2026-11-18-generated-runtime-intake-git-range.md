# Generated runtime intake: Git source range

Actual bot PR42 at `4a6e1801529aa87f1f2e84d051c68518a14763de` over
`92778247fe369da6455a00909039b818503fab3e` raises Design Core0.13.4 to0.13.5
in root development tooling and both public runtime packages. Its generated
`.changeset/lapis-dependencies-6882649476db.md` correctly requests patch releases
for Agent UI and Repository UI. The actual portable lock, three managed owner
chapters and public runtime intent remain valid; no producer change is needed.

## Original failure and ownership

Run44224244985 fails Governance134533383312 and Quality134533382963, followed
by the aggregate verify failure. Both owning jobs throw `Runtime dependency
patch requires its Changeset`. All five product unit/package/static/interaction/
browser jobs on that exact candidate pass, which does not waive this guard.

One exact source-boundary failure is reproduced before editing the adapter.
The immutable candidate is inspected without changing its bot commit: real Git
`HEAD` is4a6 and `HEAD^1` is927, `git diff HEAD` returns no changed paths, while
`git diff HEAD^1 HEAD` includes all eight actual paths and the generated note.
The source baseline already uses Git `HEAD^1`; its wrapper instead called
`changesFromVcs({})`, whose clean-Git default inspects the working tree against
HEAD. Thus no changed-file note was loaded and the computed nonempty runtime
release map failed. Jujutsu's default parent comparison and the earlier explicit
fixture paths concealed this Git-only transport mismatch.

This defect belongs to Agent UI's independent VCS/filesystem adapter. The public
SDK supports explicit base/head selection and the shared preparer emitted the
correct real note, canonical bytes and release map. No coordinator change or
manual repair of the bot's source, metadata or ownership is made.

## Source repair and exact evidence

The source reader now returns changed paths through the same captured immutable
parent it uses for prior facts: explicit parent to Git HEAD or Jujutsu @. The
CLI wrapper consumes that selection before loading managed note bytes. Existing
source-policy/bootstrap, registry, immutable-package, canonical outside-text,
release-map and path-scope guards remain binding; ancestry errors have no
fallback. No release intent is erased and no empty/no-op note is substituted.

The committed compressed fixture contains unmodified public before/after bytes
and unified Git diff from actual42, with baseline/candidate identities. Its
SHA256 is `2f7bfd383dc4252e998fccb1a8f7d9d588669a71e9642cd04dbb02664cd8cdac`.
Seven focused cases accept the actual runtime note in Git and Jujutsu modes and
reject omitted notes, weakened release maps, unrelated tracked implementation,
null intent and missing ancestry. All45 independent intake cases pass. The
marker-only Jujutsu unit fixture is not a source checkout or a VCS repository.

A separate read-only real-Git immutable-ref replay of the same bot commit passes
after the repair, observing all eight paths and the unchanged two-owner runtime
map. HEAD/HEAD^1 are explicitly bound to that immutable candidate for the replay;
it is not reported as a new hosted checkout or actual hosted pass. The normal
current-main source CLI also passes. The exact ongoing regression command is:

```sh
node --test scripts/dependency-automation/source-intake-reader.test.mjs
```

## Delivery boundary

The fix is proposed from current main. Bot42 remains unchanged and failed until
the owning source fix merges and normal bot regeneration/rebase acquires it.
Fresh exact-head CI, actual runtime version intent, tagged publication and
ordinary live reconciliation/repeat remain separate required gates. Public
versions, runtime package declarations, source bootstrap hashes, policy and
lockfile are unchanged by this source repair. No Storybook/app lifecycle,
visual baseline, audit exception, protection or workflow permission changes.

## Complete impacted source qualification

Frozen registry installation passes without a local pnpm hook. Root `pnpm check`
passes architecture/source-layout/catalog/routing checks, the independent guard,
zero Svelte errors/warnings and formatting. Root `pnpm test` passes84 Node source/
validation controls,12 runtime/composition checks and239 UI unit cases in41 files.
Both public package builds and publint pass. Complete specification validation,
mdBook, source-first and eight source version/authentication checks pass.

The exact actual runtime candidate replay and45 intake controls are the changed
boundary's acceptance. No product source, controller, Storybook lifecycle or
browser helper changes, so unrelated Storybook/browser/packed-example suites
are not rerun locally; their exact4a6 hosted passes remain historical and the
regenerated bot's fresh required matrix remains mandatory. Visual review stays
separate and no baseline is updated. The initial authoring check rejected a
multi-sentence acceptance bullet; the final atomic statement keeps governance
at its original400-line cap without relaxing either limit.
