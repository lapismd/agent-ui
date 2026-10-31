# @lapismd/agent-ui

## 0.2.0

### Minor Changes

- b2109c5: Add themed, controller-driven permission and question cards with captured resources and commands, explicit host scopes, single/multiple choices, optional letter/numeric labels and custom/secret answers. Retain exact request identities and drafts until host acknowledgement, with read-only expandable transcript outcomes and complete-screen Storybook examples.
- d808737: Present active permissions in a themed expandable panel pinned above chat actions in both views, hide the message editor until the request completes, and restore its retained draft without sending it. Add a request presentation and shared status API to AgentComposerDrawer.

  Add a far-right dismissal control scoped to the local session/request. Preserve
  unknown response recovery and reject stale response callbacks without implicitly
  approving, denying or replaying a host request.

- 3cb7b8a: Route all live chat errors and warnings through ChatMessageComposer.status and options.composer.status in both presentations. Attach unknown submission/request recovery feedback and errors below the input, remove fixed-footer banners, and reduce AgentSendHint to keyboard guidance. Legacy composer status aliases remain supported; AgentSendHint no longer accepts panel/error props.

### Patch Changes

- f9f34f1: Give question letter and number badges a solid semantic theme fill with documented label background and foreground variables. Place these labels before their radio buttons or checkboxes, including custom-answer rows. Match textareas and text/password answer inputs to the choice-row background.
- d31849d: Compose retained-draft MessageMetadata inside the shared red error footer, matching All Messages typography and attached Document composer framing.
- 3d2fb7e: Retain Stop and the authored draft when an active host does not advertise sending
  or queueing, and expose submission only while the controller can send.
- 78a03b6: Keep supported send actions enabled for host-owned composer drafts while
  preserving capability withdrawal, Stop and exact draft ownership.
- ee2573d: Show denied permission outcomes in readable red, use compact transcript disclosure spacing and qualify inline comment formatting toggles from Design Core.
- 55bc7db: Require released Design Core 0.7.4 through the normal npm dependency range,
  including captured-JSON, Swipe teardown and popup corrections. Document the
  checksum-bound Bits UI 2.20.2 patch required in each consumer installation root;
  published dependency settings do not propagate that patch.
- a389e38: Use Design Core FileTypeIcon in attachment chips and suggestions, saved-file previews, local catalog skills and JJ filename titles, retaining the original sizes and host actions. Shared file lists, diffs and tool results inherit the same filename artwork through the public dependency.
