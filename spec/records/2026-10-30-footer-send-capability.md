# Footer send capability

Desktop's Missing Declaration native queue story exposes Queue while the host
correctly omits send capability. Its exact focused case fails once. The owning
footer regression also fails once before repair with the same unsupported Queue
button; it retains the real controller, composer, draft and Stop action.

AgentUiController now supplies the existing optional transcript send callback
only while its host capability permits sending. The shared footer uses the
transcript's existing canSend state for its content/action decision. No public
prop, method or type is added. Unsupported busy drafts retain Stop and do not
issue queued mutations; a later host capability refresh can restore sending.

An initial camel-case story selector skipped all cases; it is not acceptance.
An intermediate repair called a method absent from the structural presentation
controller and failed once; the final repair uses the existing transcript API.
The exact production-footer case passes after repair and retains the draft while
asserting one explicit Stop request. The focused Footer/Transcript families pass
all 23 stories. Full source checks pass with zero type warnings and 418 source
fingerprints; all 235 unit cases, both package builds/publint, three spec lanes
and clean packed acceptance of 149 public examples also pass. The complete
Docker Storybook matrix passes 488 cases in each of four modes, 1,952 total.
Browser/static, hosted source and original Desktop acceptance remain pending.
Stories remain visual-pending; no publication or baseline update occurs.
