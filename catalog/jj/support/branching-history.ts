/** Add one topic lane per row, then join the outermost lane first to narrow in steps. */
export function branchingParents(
  ids: readonly string[],
  index: number,
): string[] {
  const parents =
    index >= 1 && index < 16
      ? [index + 1, 32 - index]
      : index >= 33 && index < 40
        ? [index + 1, 80 - index]
        : [index + 1];
  return parents.flatMap((parent) => (ids[parent] ? [ids[parent]] : []));
}
