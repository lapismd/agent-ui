# Send-capability catalog classification

The complete Docker browser lane exposes one failing audit case (including its
existing retry): Every Empty and Unavailable story uses shadcn Empty with an
icon. The new footer variation was named UnavailableQueueRetainsStop, so the
catalog's data-availability audit selected a populated action-capability case
and expected an unavailable-content Empty presentation.

The variation exercises an active conversation with a withheld send action.
Its composer, exact draft and Stop action must remain present. Rename that
variation and its MDX reference to SendCapabilityWithdrawn so the label describes
the public contract being tested. Preserve the complete Empty/Unavailable audit,
all selectors, counts, timeouts and production-footer assertions unchanged.

The exact unchanged audit passes once in a fresh bounded Docker worker after
the correction; all 23 Footer/Transcript stories also pass. The initial complete
Docker browser lane retains 150 passes and the one classification failure.
A native authoring attempt times out during server startup with zero tests;
it is not acceptance. Spec-first initially refuses the missing mapped governance
chapter, which is updated with the retained-audit evidence requirement.
The resulting spec check passes all three lanes, and full source checks pass
with zero type warnings, all 418 source fingerprints and clean formatting.
Complete browser and refreshed hosted checks remain required. The preceding
complete Storybook matrix passes 1,952 cases; this naming correction changes no
production code or public API.
