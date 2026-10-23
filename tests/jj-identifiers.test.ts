import { describe, it, expect } from "vitest";
import { encodeJjChangeId } from "../packages/repository-ui/src/history/repository-log-graph.js";
describe("native change identifiers", () => {
  it("uses JJ reverse hex and rejects non-native input", () => {
    expect(encodeJjChangeId("0123456789abcdef")).toBe("zyxwvutsrqponmlk");
    expect(encodeJjChangeId("uuuuuuuu")).toBe("");
  });
});
