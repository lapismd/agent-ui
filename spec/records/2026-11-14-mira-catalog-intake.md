# Mira development-catalog intake

PR #29 admits released Mira `~0.2.0` in the development catalog only. Production
packages retain the Core `^0.13.1` dependency floor landed in #28. No production
component, public API, patch payload or baseline changes.

Before this documentation repair, the full PR range against main failed
`spec-validator first` with one missing governance chapter. The repair updates
the owning canonical dependency paragraph and retains historical qualification
records. Complete functional CI on source
`6f67817771cdc141c36e353970539410f3e0ca6d` passed all eight checks in
[run 43540044643](https://github.com/lapismd/agent-ui/actions/runs/43540044643),
including package, interaction/accessibility and browser acceptance. The
follow-up changes documentation only; fresh required CI still gates merge.
Publication and downstream acceptance remain distinct.
