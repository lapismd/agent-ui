# Native identifier adaptation — 2026-10-23

RUI-FOUND-001 exposes the existing graph change-ID encoder through the public
JJ entry point. First-consumer browser/stack models otherwise showed native hex
while the graph showed JJ reverse hex. This export lets hosts use the same
presentation conversion without private imports or copied algorithms.

Focused unit: 1 passed. The initial test incorrectly expected already encoded
input to pass through; the existing native-only contract rejects it with an
empty result. Corrected the test to that contract. Svelte check: 0 errors and
0 warnings. Spec: 9 validators, 5 chapters, 23 requirements. Repository UI
build/publint passed before archive intake.
This changes no renderer layout; the complete-screen consumer checks cover the
integrated models. Visual review and final broad matrix remain pending.
