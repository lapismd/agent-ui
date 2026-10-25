export function assertSelectedStories(report) {
  const selected = report.numPassedTests + report.numFailedTests;
  if (!Number.isInteger(selected) || selected <= 0)
    throw Error(
      "Storybook selected no executable cases; check the file/name filter",
    );
  return selected;
}

export function storybookMatrix(args) {
  const shards = args.length ? 1 : 4;
  return ["light", "dark"].flatMap((mode) =>
    ["desktop", "narrow"].flatMap((viewport) =>
      Array.from({ length: shards }, (_, index) => ({
        mode,
        viewport,
        args: [
          ...args,
          ...(shards > 1 ? [`--shard=${index + 1}/${shards}`] : []),
        ],
        report: `.local/validation/storybook/${mode}-${viewport}-${index + 1}.json`,
      })),
    ),
  );
}

export function assertMatrixCoverage(results) {
  const modes = new Map();
  let total = 0;
  for (const { mode, viewport, report } of results) {
    const selected = assertSelectedStories(report);
    const key = `${mode}/${viewport}`;
    const cases = modes.get(key) ?? new Set();
    let counted = 0;
    for (const file of report.testResults)
      for (const test of file.assertionResults) {
        if (!["passed", "failed"].includes(test.status)) continue;
        const identity = `${file.name}\0${test.fullName}`;
        if (cases.has(identity))
          throw Error(`Duplicate Storybook case: ${identity}`);
        cases.add(identity);
        counted++;
      }
    if (counted !== selected)
      throw Error("Storybook case count does not match report");
    modes.set(key, cases);
    total += selected;
  }
  if (modes.size !== 4)
    throw Error("Incomplete Storybook theme/viewport matrix");
  const identities = [...modes.values()].map((cases) => [...cases].sort());
  if (
    identities.some(
      (cases) => JSON.stringify(cases) !== JSON.stringify(identities[0]),
    )
  )
    throw Error("Storybook themes/viewports selected different cases");
  return { casesPerMode: identities[0].length, total };
}
