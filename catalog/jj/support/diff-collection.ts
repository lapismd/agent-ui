import { denseChanges } from "./dense-diffs.js";
export const collectionVariants = ["AllInOne", "PagedFiles", "FileActions"];
export const collectionChanges = [
  ...denseChanges,
  ...Array.from({ length: 32 }, (_, index) => ({
    ...denseChanges[1],
    path: `src/generated/repository-${index + 1}.ts`,
  })),
];
