/** Several overlapping topic branches repeatedly merge back into the main lane. */
export function branchingParents(
  ids: readonly string[],
  index: number,
): string[] {
  const parents =
    index === 1
      ? Array.from({ length: 16 }, (_, i) => i + 2)
      : index >= 2 && index < 18
        ? [index + 16]
        : index >= 18 && index < 34
          ? [34]
          : index === 35
            ? Array.from({ length: 8 }, (_, i) => i + 36)
            : index >= 36 && index < 44
              ? [index + 8]
              : index >= 44 && index < 52
                ? [52]
                : [index + 1];
  return parents.flatMap((parent) => (ids[parent] ? [ids[parent]] : []));
}
