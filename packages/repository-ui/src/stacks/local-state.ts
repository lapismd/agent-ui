/** UI outcome presentation only. Execution and native command mapping remain host-owned. */
export function outcomeText(status: "committed" | "refreshed") {
  return status === "committed"
    ? "Command completed"
    : "Current state refreshed. The command outcome was not confirmed; inspect history before trying again.";
}
export function blocksRetry(
  adapter: { readonly retryPending?: boolean },
  pending: unknown,
) {
  return !!pending && adapter.retryPending === false;
}
