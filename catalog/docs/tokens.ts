export type StylingContract = {
  component: string;
  variables: {
    name: string;
    default: string;
    description: string;
    owner: string;
    source: string;
  }[];
};
export function tokenMarkdown(contract: StylingContract): string {
  return [
    "| Variable | Default | Purpose | Owner |",
    "| --- | --- | --- | --- |",
    ...contract.variables.map(
      (token) =>
        `| \`${token.name}\` | \`${token.default}\` | ${token.description} | ${token.owner} |`,
    ),
  ].join("\n");
}
