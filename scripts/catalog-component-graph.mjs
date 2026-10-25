import { parse } from "svelte/compiler";
import ts from "typescript";
import { posix } from "node:path";
const unwrap = (node) => {
  while (
    node &&
    (ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isParenthesizedExpression(node))
  )
    node = node.expression;
  return node;
};
export function typescript(source, path) {
  return ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
}
export function bindings(ast) {
  const result = new Map();
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node) || node.importClause?.isTypeOnly)
      continue;
    const clause = node.importClause,
      source = node.moduleSpecifier.text;
    if (clause?.name) result.set(clause.name.text, { source, name: "default" });
    for (const spec of clause?.namedBindings?.elements ?? [])
      if (!spec.isTypeOnly)
        result.set(spec.name.text, {
          source,
          name: spec.propertyName?.text ?? spec.name.text,
        });
  }
  return result;
}
export function resolver(read) {
  const resolve = (owner, source) => {
    const raw = posix.normalize(posix.join(posix.dirname(owner), source));
    for (const path of [raw, raw.replace(/\.js$/, ".ts"), raw + "/index.ts"])
      if (read(path) !== null) return path;
    throw Error(`${owner}: missing rendered module ${source}`);
  };
  const exported = (path, name, seen = new Set()) => {
    if (path.endsWith(".svelte")) return path;
    const key = path + "#" + name;
    if (seen.has(key)) return null;
    seen.add(key);
    const ast = typescript(read(path), path),
      imports = bindings(ast);
    for (const node of ast.statements) {
      if (!ts.isExportDeclaration(node) || !node.moduleSpecifier) continue;
      if (!node.moduleSpecifier.text.startsWith(".")) continue;
      const next = resolve(path, node.moduleSpecifier.text);
      if (node.exportClause) {
        for (const spec of node.exportClause.elements ?? [])
          if (spec.name.text === name)
            return exported(next, spec.propertyName?.text ?? name, seen);
      } else {
        const value = exported(next, name, seen);
        if (value) return value;
      }
    }
    if (name === "default")
      for (const node of ast.statements)
        if (ts.isExportAssignment(node) && ts.isIdentifier(node.expression)) {
          const binding = imports.get(node.expression.text);
          if (binding)
            return exported(resolve(path, binding.source), binding.name, seen);
        }
    return null;
  };
  function component(owner, binding) {
    if (!binding) throw Error(`${owner}: unresolved rendered binding`);
    if (!binding.source.startsWith("."))
      return `${binding.source}#${binding.name}`;
    const path = exported(resolve(owner, binding.source), binding.name);
    if (!path)
      throw Error(
        `${owner}: unresolved rendered export ${binding.source}#${binding.name}`,
      );
    return path;
  }
  return component;
}
const parsed = new Map();
export function renderedGraph(root, read, expected) {
  const reached = new Set(),
    seen = new Set(),
    component = resolver(read);
  function inspect(path) {
    if (seen.has(path)) return;
    seen.add(path);
    if (!path.endsWith(".svelte")) {
      reached.add(path);
      return;
    }
    const text = read(path);
    if (text === null) throw Error(`missing rendered source ${path}`);
    if (
      /(?:from|import)\s*["']@lapismd\/(?:design-core|mira|agent-ui|repository-ui)\/(?:src|dist|internal)\//.test(
        text,
      ) ||
      /globalThis\.app/.test(text)
    )
      throw Error(`${path}: private package or ambient application import`);
    const production =
      /^packages\/(?:agent-ui|repository-ui)\/src\//.test(path) &&
      !/\.stories\.|\.demo\.|\.fixture\./.test(path);
    if (
      /^packages\/(?:agent-ui|repository-ui)\/src\//.test(path) &&
      !/\.stories\.|\.demo\.|\.fixture\./.test(path)
    ) {
      reached.add(path);
      if (!expected || path === expected) return;
    }
    const cacheKey = path + "\0" + text;
    if (!parsed.has(cacheKey))
      parsed.set(cacheKey, parse(text, { modern: true }));
    const ast = parsed.get(cacheKey),
      imports = new Map();
    for (const script of [ast.module, ast.instance])
      for (const node of script?.content.body ?? [])
        if (node.type === "ImportDeclaration" && node.importKind !== "type")
          for (const spec of node.specifiers)
            if (spec.importKind !== "type")
              imports.set(spec.local.name, {
                source: node.source.value,
                name:
                  spec.type === "ImportDefaultSpecifier"
                    ? "default"
                    : (spec.imported?.name ?? "*"),
              });
    function visit(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(visit);
      if (node.type === "SvelteComponent" && !production)
        throw Error(`${path}: unresolved dynamic component`);
      if (node.type === "Component") {
        const [name, ...members] = node.name.split("."),
          binding = imports.get(name);
        if (!binding && production) return;
        if (!binding)
          throw Error(`${path}: unresolved rendered component ${node.name}`);
        const child = component(path, binding);
        inspect(members.length ? child + "." + members.join(".") : child);
      }
      for (const key of [
        "nodes",
        "fragment",
        "consequent",
        "alternate",
        "body",
        "fallback",
      ])
        visit(node[key]);
    }
    visit(ast.fragment);
  }
  inspect(root);
  return reached;
}
export { unwrap };
