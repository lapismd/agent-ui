# Footer capability and independently owned drafts

Desktop's full final-cohort catalog exposes a regression in the preceding footer
repair: shard 1 passes 113 and fails 15 cases; shard 2 passes 123 and fails nine.
Each failure attempts to use a disabled Send message action. The exact Sending
Error case also fails once in a fresh native process before this correction.

TranscriptController.canSend includes the controller's own message content.
Desktop's host owns its composer draft independently, so that complete-send
predicate cannot serve as the footer's action-capability check. The first source
fixture bound the composer directly to transcript.message and missed this
integration boundary.

The new production-footer case owns its draft separately, keeps the transcript
message and pending comments empty, and verifies the exact host callback text,
single dispatch and retained draft. It fails once before correction. The footer
now reads the existing public optional props().onSend callback for capability
while its existing host composer state continues to supply content. No public
type, method or prop is added, and no host draft is copied into comment state.

Both the new Host Owned Draft case and the existing Send Capability Withdrawn
case pass afterward. The complete Footer/Transcript family passes 24 cases in
each of four modes (96 total). Native authoring checks pass with zero type
diagnostics, 418 source fingerprints, 235 unit cases, both builds/publint, three
spec lanes and clean packed acceptance of 149 documented examples. The first
type check caught the fixture's incompatible story type; the concrete fixture
type corrects it without a cast. The following formatting failure is corrected
with Prettier. An initial family selector matched only Footer (24 total), so
the corrected complete family run supplies the 96-case result above.

The first complete Docker run stops on 34 token-source audit findings: the
prepared runtime archive omits source files explicitly required by that audit.
The existing Design Core packer's retainSource option produces a separate
validation archive with exactly identical hashes for all 2,750 dist files.
Its SHA256 is
`18d9c275d1daf930edb6d7498eba292583a830ba1a863bb4e3b45fe91b41589d`.
Runtime exports still target dist, and audit rules are unchanged. Complete
Docker checks against that source-bearing artifact are pending, separately
from Desktop's runtime-only archive and original Sending Error acceptance.
Stories remain visual-pending; publication and baseline updates remain separate.
