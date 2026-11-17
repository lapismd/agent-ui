// Source policy supports only the existing stable 0.x exact/caret/tilde family.
const version = (value) => {
  const match = /^0\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u.exec(value ?? "");
  if (!match) return null;
  const parts = [Number(match[1]), Number(match[2])];
  return parts.every(Number.isSafeInteger) ? parts : null;
};
const range = (value) =>
  typeof value === "string" ? version(value.replace(/^[~^]/u, "")) : null;
const compare = (a, b) => a[0] - b[0] || a[1] - b[1];
export default {
  valid: (value) => Boolean(version(value)),
  validRange: (value) => Boolean(range(value)),
  prerelease: (value) => String(value).includes("-"),
  satisfies: (value, declared) => {
    const a = version(value),
      b = range(declared);
    return Boolean(
      a &&
      b &&
      a[0] === b[0] &&
      (declared[0] === "~" || (declared[0] === "^" && b[0] > 0)
        ? a[1] >= b[1]
        : a[1] === b[1]),
    );
  },
  lt: (a, b) => compare(version(a), version(b)) < 0,
  diff: (a, b) =>
    a === b ? null : version(a)[0] === version(b)[0] ? "patch" : "minor",
  subset: (next, previous) => {
    const a = range(next),
      b = range(previous);
    return Boolean(
      a &&
      b &&
      a[0] === b[0] &&
      a[1] >= b[1] &&
      (previous[0] === "~" ||
        (previous[0] === "^" && b[0] > 0) ||
        (a[1] === b[1] &&
          (next === previous ||
            next === "0." + a.join(".") ||
            (next[0] === "^" && a[0] === 0)))),
    );
  },
};
