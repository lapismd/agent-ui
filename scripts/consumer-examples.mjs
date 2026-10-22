import { readFileSync } from "node:fs";
import ts from "typescript";
import { walk } from "./agent-foundation-audit.mjs";
export function documentedExamples() {
  return walk("packages/agent-ui/src")
    .filter((file) => file.endsWith(".example-sources.ts"))
    .flatMap((file) => {
      const source = ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      );
      const examples = [];
      for (const statement of source.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          const value = declaration.initializer;
          if (
            !value ||
            !(
              ts.isStringLiteral(value) ||
              ts.isNoSubstitutionTemplateLiteral(value)
            )
          )
            throw new Error(
              `Consumer example must be a complete literal: ${file}`,
            );
          examples.push({
            file,
            name: declaration.name.getText(source),
            code: value.text,
          });
        }
      }
      return examples;
    });
}
