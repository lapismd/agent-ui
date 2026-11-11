# @lapismd/repository-ui

## 0.2.1

### Patch Changes

- 2adee1f: Require Design Core 0.12.4 in Repository UI so clean consumers retain viewport sizing and PR check lists cannot overlap merge controls. Advance the Agent UI cohort version for the shared release workflow.

## 0.2.0

### Minor Changes

- 2381e91: Share revision-aware grouped checks and the bordered, detachable forge panel between PRs, workflow runs and deployments. Preserve the owning theme in floating PRs, keep the title disclosure transparent and inert while detached, and fit initial window height to its content.

  Keep long check results inside the bounded viewport above the merge footer, use square group headings, collapse empty results initially, and provide horizontal ScrollArea access to wide PR descriptions.

## 0.1.3

### Patch Changes

- 3fbad6f: Refresh first-party Lapis dependencies to the published versions recorded in this pull request.

## 0.1.2

### Patch Changes

- 5c61865: Admit Design Core 0.8/0.9 alongside 0.7.4 for the shared Notes application cohort.

## 0.1.1

### Patch Changes

- 55bc7db: Require released Design Core 0.7.4 through the normal npm dependency range,
  including captured-JSON, Swipe teardown and popup corrections. Document the
  checksum-bound Bits UI 2.20.2 patch required in each consumer installation root;
  published dependency settings do not propagate that patch.
- a389e38: Use Design Core FileTypeIcon in attachment chips and suggestions, saved-file previews, local catalog skills and JJ filename titles, retaining the original sizes and host actions. Shared file lists, diffs and tool results inherit the same filename artwork through the public dependency.
