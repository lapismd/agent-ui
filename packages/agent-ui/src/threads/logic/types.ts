/** Metadata home and thread identity; neither grants execution authority. */
export type ThreadIdentity = { home: string; id: string };
export type ThreadRow = ThreadIdentity & {
  title: string;
  status: string;
  author: { id: string; name: string; avatar?: string };
  excerpt?: string;
  /** Recorded milliseconds since epoch. Omit when not known. */
  updatedAt?: number;
};
export type ThreadHome = { id: string; name: string; available?: boolean };
export type ThreadPage = {
  home: string;
  snapshot: string;
  rows: ThreadRow[];
  next?: string;
};
export type ThreadScope = { home?: string };
/** Read-only directory: creating, editing and sending use host-owned conversation ports. */
export interface ThreadsPort {
  homes(signal: AbortSignal): Promise<ThreadHome[]>;
  read(
    query: { home: string; cursor?: string; limit: number },
    signal: AbortSignal,
  ): Promise<ThreadPage>;
  subscribe?(changed: (home?: string) => void): () => void;
}
export type ThreadHomeState = ThreadHome & {
  loading: boolean;
  error?: string;
  page?: ThreadPage;
};
export type ThreadsState = {
  scope: ThreadScope;
  homes: ThreadHomeState[];
  loading: boolean;
  remaining: number;
  error?: string;
};
export const threadKey = ({ home, id }: ThreadIdentity) =>
  JSON.stringify([home, id]);
