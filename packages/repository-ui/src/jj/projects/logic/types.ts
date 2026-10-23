/** Public metadata presentation models. Home registration and portable code IDs differ. */
export type WorkVersion = number | bigint;
export type WorkTab =
  "activity" | "projects" | "tasks" | "reviews" | "agents" | "repositories";
export type WorkTaskState = "open" | "in_progress" | "blocked" | "done";
export interface WorkActor {
  created_by: string;
  updated_at_millis: number;
  created_at_millis: number;
  name?: string;
  avatarUrl?: string;
}
export interface WorkProject {
  id: string;
  title: string;
  body: string;
  version: WorkVersion;
  repositories: Record<string, boolean>;
  actor: WorkActor;
  task_counts?: { active: number; done: number };
  excerpt?: string;
}
export interface WorkTask {
  id: string;
  project: string;
  title: string;
  body: string;
  version: WorkVersion;
  repository: string | null;
  parent: string | null;
  state: WorkTaskState;
  actor: WorkActor;
  project_title?: string;
  parent_title?: string;
  comment_count?: number;
}
export interface WorkComment {
  id: string;
  task: string;
  reply_to: string | null;
  body: string | null;
  version: WorkVersion;
  actor: WorkActor;
}
export interface WorkReview {
  actor?: WorkActor;
  anchorLabel?: string;
  commentCount?: number;
  id: string;
  title: string;
  body: string;
  status: "open" | "resolved";
  version: string;
  comments: { id: string; body: string | null; parent: string | null }[];
  commentsHasMore: boolean;
}
/** Recorded commit activity; repository/operation are exact host-issued pins. */
export interface WorkActivity {
  id: string;
  repository: string;
  operation: string;
  revision: {
    eventId: string;
    changeId?: string;
    message: string;
    author: string;
    authorEmail?: string;
    createdAt: number;
  };
}
export interface WorkHome {
  id: string;
  name: string;
  description?: string;
  repository?: string;
  available: boolean;
  writable: boolean;
  /** Actor identity used for Mine/Other grouping and own-comment editing. */
  principal?: string;
  summary?: {
    description: string;
    contributor?: WorkActor;
    commits: number;
    reviews: number;
    tasks: number;
    updatedAtMillis?: number;
    partial?: boolean;
  };
}
export interface WorkRoute {
  tab: WorkTab;
  home?: string;
  project?: string;
  task?: string;
  review?: string;
  query?: string;
  /** Portable linked code repository filter; independent of the metadata home. */
  repository?: string;
  /** Omitted means active; all is an explicit unfiltered request. */
  state?: WorkTaskState | "active" | "all";
}
export interface WorkRead extends WorkRoute {
  home: string;
  cursor?: string;
  limit: number;
}
export interface WorkPage {
  home: string;
  snapshot: string;
  next?: string;
  projects: WorkProject[];
  tasks: WorkTask[];
  comments: WorkComment[];
  reviews: WorkReview[];
  activity: WorkActivity[];
  project?: WorkProject;
  task?: WorkTask;
  review?: WorkReview;
  bounded?: boolean;
}
export type WorkCommand =
  | { kind: "create-project"; id: string; title: string; body: string }
  | {
      kind: "edit-project";
      project: string;
      version: WorkVersion;
      title: string;
      body: string;
    }
  | {
      kind: "link-repository";
      project: string;
      version: WorkVersion;
      repository: string;
      active: boolean;
    }
  | {
      kind: "create-task";
      id: string;
      project: string;
      version: WorkVersion;
      title: string;
      body: string;
      repository: string | null;
      parent: string | null;
    }
  | {
      kind: "edit-task";
      task: string;
      project: string;
      version: WorkVersion;
      projectVersion: WorkVersion;
      title: string;
      body: string;
      repository: string | null;
      parent: string | null;
      state: WorkTaskState;
    }
  | {
      kind: "comment";
      id: string;
      task: string;
      version: WorkVersion;
      body: string;
      replyTo: string | null;
    }
  | {
      kind: "edit-comment";
      id: string;
      version: WorkVersion;
      body: string | null;
    }
  | { kind: "create-review"; body: string }
  | {
      kind: "review-reply";
      review: string;
      version: string;
      body: string;
      parent: string | null;
    }
  | {
      kind: "review-state";
      review: string;
      version: string;
      resolved: boolean;
    };
export interface WorkRequest {
  id: string;
  home: string;
  command: WorkCommand;
}
export type WorkOutcome =
  | { state: "committed" }
  | { state: "rejected"; message: string }
  | { state: "unknown" };
export interface WorkPort {
  homes(signal: AbortSignal): Promise<WorkHome[]>;
  read(query: WorkRead, signal: AbortSignal): Promise<WorkPage>;
  execute(request: WorkRequest): Promise<WorkOutcome>;
  /** Inspect a retained request; never re-dispatch on mount or refresh. */
  resolve(request: WorkRequest): Promise<WorkOutcome>;
  pending?(): Promise<WorkRequest[]>;
  draft(
    home: string,
    key: string,
    value?: Record<string, string>,
  ): Promise<Record<string, string> | null>;
  subscribe?(changed: (home: string) => void): () => void;
}
export interface WorkHomeState {
  home: WorkHome;
  page?: WorkPage;
  loading: boolean;
  error?: string;
}
export interface ProjectsState {
  directory: WorkHome[];
  route: WorkRoute;
  homes: WorkHomeState[];
  remaining: number;
  loading: boolean;
  pending: WorkRequest[];
  writing: Set<string>;
  error?: string;
}
export interface WorkContext {
  home: string;
  repository?: string;
  project?: string;
  task?: string;
  review?: string;
}
