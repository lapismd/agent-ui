import {
  defineConfig,
  headingRequirements,
  singleIdVerification,
} from "@lapismd/spec-validator";
export default defineConfig(headingRequirements(), {
  name: "agent-ui",
  idPattern: /^(?:AUI|RUI)-[A-Z]+-\d{3}$/,
  ruleIds: {
    governance: "AUI-GOV-003",
    fileLimits: "AUI-GOV-003",
    summary: "AUI-GOV-003",
    verification: "AUI-GOV-003",
    book: "AUI-GOV-003",
    bookIgnore: "AUI-GOV-003",
    specFirst: "AUI-GOV-003",
    internal: "AUI-GOV-003",
  },
  validators: {
    summary: true,
    governance: { extras: ["AGENTS.md", "README.md"] },
    fileLimits: { maxLines: 400, maxBytes: 32768 },
    verification: singleIdVerification(),
    book: true,
    specFirst: {
      mode: "mapped",
      canonicalPattern: "^spec/src/(?:agent|repository|governance)\\.md$",
      protected: [
        "^(?:packages/|catalog/|scripts/|\\.storybook/|.*\\.(?:json|mjs|ts|yaml)$|AGENTS\\.md$|README\\.md$|PLAN\\.md$)",
      ],
      ignore: ["(^|/)(?:node_modules|dist|storybook-static)/", "^spec/book/"],
      rules: [
        { pattern: "^packages/agent-ui/", chapters: ["spec/src/agent.md"] },
        {
          pattern: "^packages/repository-ui/",
          chapters: ["spec/src/repository.md"],
        },
        { pattern: ".*", chapters: ["spec/src/governance.md"] },
      ],
    },
  },
  check: { build: true, first: true },
});
