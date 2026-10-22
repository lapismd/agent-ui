import { auditFoundations } from "./agent-foundation-audit.mjs";
export const jjOptions = {
  sourceRoot: "packages/repository-ui/src",
  manifestPath: "docs/jj-component-families.json",
  rule: "RUI-FOUND-001",
  namespace: "RUI",
  titlePrefix: "JJ",
  packageName: "@lapismd/repository-ui",
  tokenPrefix: "--ui-repository-",
};
export default {
  name: "jjFoundations",
  validate: (context) => auditFoundations(context.model.repoRoot, jjOptions),
};
