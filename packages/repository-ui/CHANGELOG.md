# @lapismd/repository-ui

## 0.1.1

### Patch Changes

- 55bc7db: Require released Design Core 0.7.4 through the normal npm dependency range,
  including captured-JSON, Swipe teardown and popup corrections. Document the
  checksum-bound Bits UI 2.20.2 patch required in each consumer installation root;
  published dependency settings do not propagate that patch.
- a389e38: Use Design Core FileTypeIcon in attachment chips and suggestions, saved-file previews, local catalog skills and JJ filename titles, retaining the original sizes and host actions. Shared file lists, diffs and tool results inherit the same filename artwork through the public dependency.
