import { describe, expect, it } from "vitest";
import { navigationSections } from "../packages/repository-ui/src/jj/navigation/model.js";

describe("contextual repository navigation", () => {
  it("replaces repository tabs inside Stacks and omits workflow pages", () => {
    expect(navigationSections("stacks").map((item) => item.value)).toEqual([
      "branches",
      "workspace",
      "log",
      "oplog",
    ]);
    expect(navigationSections("repository").map((item) => item.value)).toEqual([
      "files",
      "stacks",
      "branches",
      "log",
      "oplog",
      "agents",
      "reviews",
      "projects",
    ]);
  });
  it("keeps global directory navigation distinct from a selected project", () => {
    expect(navigationSections("projects").map((item) => item.value)).toEqual([
      "activity",
      "projects",
      "tasks",
      "reviews",
      "agents",
      "repositories",
    ]);
    expect(navigationSections("project").map((item) => item.value)).toEqual([
      "activity",
      "tasks",
      "reviews",
      "agents",
      "repositories",
    ]);
  });
});
