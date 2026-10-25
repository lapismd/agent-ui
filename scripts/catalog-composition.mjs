import ts from "typescript";
import {
  bindings,
  renderedGraph,
  resolver,
  typescript,
  unwrap,
} from "./catalog-component-graph.mjs";
export function auditComposition({ files, read, contracts = {} }) {
  const findings = [],
    component = resolver(read);
  for (const file of Object.keys(contracts))
    if (!files.includes(file))
      findings.push(`${file}: stale complete-screen composition contract`);
  for (const file of files.filter((path) => path.endsWith(".stories.ts"))) {
    try {
      const source = read(file),
        ast = typescript(source, file),
        imports = bindings(ast),
        variables = new Map();
      for (const node of ast.statements)
        if (ts.isVariableStatement(node))
          for (const item of node.declarationList.declarations)
            if (ts.isIdentifier(item.name))
              variables.set(item.name.text, unwrap(item.initializer));
      const object = (node) => {
        node = unwrap(node);
        return node && ts.isIdentifier(node) ? variables.get(node.text) : node;
      };
      const property = (node, name) =>
        object(node)?.properties?.find(
          (item) => item.name?.getText(ast).replaceAll(/["']/g, "") === name,
        );
      const meta = ast.statements.find(ts.isExportAssignment);
      const subject = property(meta?.expression, "component")?.initializer;
      if (!subject || !ts.isIdentifier(subject))
        throw Error("missing resolvable metadata component");
      const expected = component(file, imports.get(subject.text));
      const roots = [];
      for (const node of ast.statements)
        if (
          ts.isVariableStatement(node) &&
          node.modifiers?.some(
            (mod) => mod.kind === ts.SyntaxKind.ExportKeyword,
          )
        )
          for (const item of node.declarationList.declarations) {
            const render = property(item.initializer, "render");
            if (!render) {
              roots.push(expected);
              continue;
            }
            let expression = unwrap(
              render.initializer ??
                (ts.isShorthandPropertyAssignment(render)
                  ? render.name
                  : undefined),
            );
            if (expression && ts.isIdentifier(expression))
              expression = variables.get(expression.text);
            if (
              expression &&
              ts.isCallExpression(expression) &&
              ts.isIdentifier(expression.expression)
            ) {
              const factory = variables.get(expression.expression.text);
              if (factory && ts.isArrowFunction(factory))
                expression = unwrap(factory.body);
            }
            if (!expression || !ts.isArrowFunction(expression))
              throw Error("unresolved story render callback");
            let returned = unwrap(expression.body);
            if (ts.isBlock(returned))
              returned = unwrap(
                returned.statements.find(ts.isReturnStatement)?.expression,
              );
            const root = property(returned, "Component")?.initializer;
            if (!root || !ts.isIdentifier(root))
              throw Error("story render must name a resolvable component");
            roots.push(component(file, imports.get(root.text)));
          }
      if (!roots.length) throw Error("story family has no registered cases");
      for (const root of new Set(roots)) {
        const reached = renderedGraph(
          root,
          read,
          file.startsWith("packages/") ? expected : undefined,
        );
        if (file.startsWith("packages/") && !reached.has(expected))
          throw Error(
            `actual render graph misses metadata subject ${expected}`,
          );
        if (
          file.startsWith("catalog/") &&
          (!contracts[file]?.length ||
            !contracts[file].some((subject) => reached.has(subject)))
        )
          throw Error(
            "actual render graph misses its complete production screen contract",
          );
        if (
          ![...reached].some((path) =>
            /^packages\/(?:agent-ui|repository-ui)\/src\/.+\.svelte$/.test(
              path,
            ),
          )
        )
          throw Error("actual render graph misses production presentation");
      }
    } catch (error) {
      findings.push(`${file}: ${error.message}`);
    }
  }
  return findings;
}
