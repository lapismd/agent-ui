export type RepositoryLogRevision = {
  eventId: string;
  changeId: string;
  parents: string[];
  message: string;
  reason: "checkpoint" | "merge";
  author: string;
  authorEmail?: string;
  host?: string;
  millis: number | bigint;
  tags: string[];
  conflicted?: boolean;
};
export type RepositoryLogDevice = { alias: string; revisionEventId: string };
