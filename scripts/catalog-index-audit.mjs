import { readFile } from "node:fs/promises";
const index = JSON.parse(
  await readFile(process.argv[2] ?? "storybook-static/index.json", "utf8"),
);
const inventories = await Promise.all(
  [
    ["agent-ui", "agent"],
    ["repository-ui", "jj"],
  ].map(async ([owner, name]) => ({
    owner,
    ...JSON.parse(
      await readFile(`docs/${name}-component-families.json`, "utf8"),
    ),
  })),
);
const families = inventories.flatMap((inventory) =>
  inventory.families.map((family) => ({ ...family, owner: inventory.owner })),
);
const entries = Object.values(index.entries);
let stories = 0;
for (const family of families) {
  const source = await readFile(
    `packages/${family.owner}/src/${family.primary}.stories.ts`,
    "utf8",
  );
  const title = /title:\s*["']([^"']+)["']/.exec(source)?.[1];
  if (!title) throw Error(`Missing title: ${family.primary}`);
  if (!entries.some((entry) => entry.title === title && entry.type === "docs"))
    throw Error(`Missing documentation in static index: ${title}`);
  const expected = [...source.matchAll(/export const (\w+):\s*Story\s*=/g)].map(
    (match) => match[1],
  );
  for (const name of expected) {
    const suffix = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const story = entries.find(
      (entry) =>
        entry.title === title &&
        entry.id.endsWith(`--${suffix}`) &&
        entry.type === "story",
    );
    if (!story || !story.tags?.includes("visual-pending"))
      throw Error(`Missing visual-pending static story: ${title}/${name}`);
    stories++;
  }
}
for (const entry of entries)
  if (
    entry.type === "story" &&
    (!/^(Agents|JJ)\//.test(entry.title) ||
      !entry.tags?.includes("visual-pending"))
  )
    throw Error(`Unexpected or ungoverned review story: ${entry.id}`);
for (const title of [
  "Introduction",
  "Agent",
  "Governance",
  "Repository",
  "Verification",
])
  if (
    !entries.some(
      (entry) =>
        entry.title === `Specification/${title}` && entry.type === "docs",
    )
  )
    throw Error(`Missing specification chapter: ${title}`);
console.log(
  `Static catalog: ${families.length} documented foundation families, ${stories} foundation variations, all review stories visual-pending, 5 specification chapters.`,
);
