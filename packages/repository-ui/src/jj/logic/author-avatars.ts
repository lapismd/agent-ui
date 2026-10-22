import { getContext, setContext } from "svelte";
const key = Symbol.for("@lapismd/repository-ui/author-avatars");
/** Display-only URL lookup; the host owns email policy, enrichment and caching. */
export type RepositoryAuthorAvatarResolver = (
  normalizedEmail: string,
) => string | undefined;
/** Call during host component initialization; descendants react to the resolver's owned state. */
export function provideRepositoryAuthorAvatars(
  resolve: RepositoryAuthorAvatarResolver,
): void {
  setContext(key, resolve);
}
export function repositoryAuthorAvatars():
  RepositoryAuthorAvatarResolver | undefined {
  return getContext(key);
}
