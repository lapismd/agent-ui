import type {
  WorkPort,
  WorkPage,
  WorkProject,
  WorkTask,
  WorkComment,
  WorkReview,
  WorkRequest,
  WorkOutcome,
} from "../../../packages/repository-ui/src/jj/projects/index.js";
const actor = {
  created_by: "alex",
  name: "Alex Morgan",
  updated_at_millis: 1792742400000,
  created_at_millis: 1792656000000,
};
export function projectsFixture(variant: string) {
  const homes = ["alpha", "beta"].map((id, i) => ({
    id,
    name: "Lapis",
    principal: "alex",
    summary: {
      description: "Keep recorded workspace context",
      contributor: actor,
      commits: 15,
      reviews: 4,
      tasks: 3,
      updatedAtMillis: actor.updated_at_millis,
      partial: true,
    },
    description: `Local checkout ${i + 1}`,
    repository: `portable-${id}`,
    available: variant !== "Disabled",
    writable: variant !== "Disabled",
  }));
  const data = new Map(
    homes.map((home) => [
      home.id,
      {
        version: 1,
        projects: Array.from(
          {
            length:
              variant === "Paged"
                ? 30
                : variant === "LayoutToggle"
                  ? 6
                  : variant === "Empty"
                    ? 0
                    : 1,
          },
          (_, i): WorkProject => ({
            id: `project-${i}`,
            title: i ? `Project ${i}` : "Repository toolkit",
            body: "Shared repository browsing and review.\n\n- Retain context\n- Reuse complete screens",
            version: 1,
            repositories: {
              "portable-alpha": true,
              "portable-beta": true,
              "unavailable-code": true,
              "retired-code": false,
            },
            actor,
            task_counts: { active: 1, done: 0 },
          }),
        ),
        tasks: [
          {
            id: "task-1",
            project: "project-0",
            title: "Preserve repository context",
            body: "Keep metadata ownership separate from the execution checkout.",
            version: 1,
            repository: "portable-beta",
            parent: null,
            state: "in_progress",
            actor,
            comment_count: 1,
          },
        ] as WorkTask[],
        comments: [
          {
            id: "comment-1",
            task: "task-1",
            reply_to: null,
            body: "Test duplicate names across metadata homes.",
            version: 1,
            actor,
          },
        ] as WorkComment[],
        reviews: [
          {
            id: "review-1",
            title: "Review repository context",
            body: "Check the linked code target before execution.",
            status: "open",
            actor,
            anchorLabel: "src/context.ts a3affd3",
            version: "1",
            comments: [
              {
                id: "review-comment-1",
                parent: null,
                body: "Looks ready for a second pass.",
              },
            ],
            commentsHasMore: false,
          },
        ] as WorkReview[],
      },
    ]),
  );
  if (variant === "LayoutToggle") {
    for (const state of data.values()) {
      state.tasks = Array.from({ length: 6 }, (_, i) => ({
        ...state.tasks[0],
        id: `task-${i + 1}`,
        title: i ? `Review responsive task ${i}` : state.tasks[0].title,
      }));
      state.reviews = Array.from({ length: 6 }, (_, i) => ({
        ...state.reviews[0],
        id: `review-${i + 1}`,
        title: i ? `Review responsive collection ${i}` : state.reviews[0].title,
      }));
    }
  }
  const drafts = new Map<string, Record<string, string>>(),
    requests = new Map<string, WorkRequest>(),
    receipts = new Map<string, WorkOutcome>();
  let fail = variant === "PartialFailure";
  const port: WorkPort = {
    homes: async (signal) => {
      if (variant === "Loading")
        await new Promise((_, reject) =>
          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          }),
        );
      return homes;
    },
    read: async (query, signal) => {
      signal.throwIfAborted();
      if (fail && query.home === "beta") {
        fail = false;
        throw Error("Local repository temporarily unavailable");
      }
      const state = data.get(query.home)!;
      const match = (r: { title: string; body: string }) =>
        `${r.title} ${r.body}`
          .toLowerCase()
          .includes((query.query ?? "").toLowerCase());
      const project = state.projects.find((p) => p.id === query.project),
        task = state.tasks.find((t) => t.id === query.task),
        review = state.reviews.find((r) => r.id === query.review);
      const result: WorkPage = {
        home: query.home,
        snapshot: String(state.version),
        projects: [],
        tasks: [],
        reviews: [],
        comments: state.comments.filter((c) => c.task === task?.id),
        activity: [],
        project,
        task,
        review,
      };
      const offset = Number(query.cursor?.split(":")[1] ?? 0);
      if (query.cursor && !query.cursor.startsWith(`${state.version}:`))
        throw Error("Snapshot changed");
      if (query.tab === "projects")
        result.projects = state.projects.filter(
          (p) =>
            match(p) && (!query.repository || p.repositories[query.repository]),
        );
      if (query.tab === "tasks")
        result.tasks = state.tasks.filter(
          (t) =>
            (!query.project || t.project === query.project) &&
            (query.state === "all" ||
              (!query.state || query.state === "active"
                ? t.state !== "done"
                : t.state === query.state)) &&
            (!query.repository || t.repository === query.repository) &&
            match(t),
        );
      if (query.tab === "reviews") result.reviews = state.reviews.filter(match);
      if (query.tab === "activity")
        result.activity = state.projects.map((p, i) => ({
          id: `activity-${p.id}`,
          repository: `portable-${query.home}`,
          operation: "a".repeat(128),
          revision: {
            eventId: String(i + 1).padStart(40, "a"),
            changeId: "ryspmnvsxq",
            message:
              "Keep recorded repository context\n\nPreserve the selected operation when switching project views.",
            author: "Alex Morgan",
            createdAt:
              actor.updated_at_millis / 1000 +
              (query.home === "beta" ? 600 : 0),
          },
        }));
      for (const key of ["projects", "tasks", "reviews", "activity"] as const) {
        if (result[key].length > offset + query.limit)
          result.next = `${state.version}:${offset + query.limit}`;
        result[key] = result[key].slice(offset, offset + query.limit) as never;
      }
      return structuredClone(result);
    },
    execute: async (request) => {
      const key = `${request.home}:${request.id}`;
      if (receipts.has(key)) return receipts.get(key)!;
      requests.set(key, structuredClone(request));
      const state = data.get(request.home)!,
        c = request.command;
      if (!state || !homes.find((h) => h.id === request.home)?.writable)
        return { state: "rejected", message: "Home unavailable" };
      const project = state.projects.find(
        (p) => p.id === ("project" in c ? c.project : ""),
      );
      if (c.kind === "create-project")
        state.projects.push({ ...c, version: 1, repositories: {}, actor });
      if (c.kind === "edit-project" && project)
        Object.assign(project, {
          title: c.title,
          body: c.body,
          version: Number(project.version) + 1,
        });
      if (c.kind === "link-repository" && project) {
        project.repositories[c.repository] = c.active;
        project.version = Number(project.version) + 1;
      }
      if (c.kind === "create-task")
        state.tasks.push({ ...c, version: 1, state: "open", actor });
      if (c.kind === "edit-task")
        Object.assign(
          state.tasks.find((t) => t.id === c.task)!,
          { ...c, version: Number(c.version) + 1 },
        );
      if (c.kind === "comment") {
        state.comments.push({
          id: c.id,
          task: c.task,
          reply_to: c.replyTo,
          body: c.body,
          version: 1,
          actor,
        });
        state.tasks.find((t) => t.id === c.task)!.version =
          Number(c.version) + 1;
      }
      if (c.kind === "edit-comment")
        Object.assign(
          state.comments.find((r) => r.id === c.id)!,
          { body: c.body, version: Number(c.version) + 1 },
        );
      if (c.kind === "create-review")
        state.reviews.push({
          id: request.id,
          title: c.body.split("\n")[0],
          body: c.body,
          status: "open",
          version: "1",
          comments: [],
          commentsHasMore: false,
        });
      if (c.kind === "review-reply")
        state.reviews
          .find((r) => r.id === c.review)!
          .comments.push({ id: request.id, body: c.body, parent: c.parent });
      if (c.kind === "review-state")
        state.reviews.find((r) => r.id === c.review)!.status = c.resolved
          ? "resolved"
          : "open";
      state.version++;
      receipts.set(key, { state: "committed" });
      if (variant === "Recovery") return { state: "unknown" };
      requests.delete(key);
      return { state: "committed" };
    },
    resolve: async (request) => {
      const key = `${request.home}:${request.id}`;
      const result = receipts.get(key) ?? { state: "unknown" as const };
      if (result.state === "committed") requests.delete(key);
      return result;
    },
    pending: async () => [...requests.values()],
    draft: async (home, key, value) => {
      const id = `${home}:${key}`;
      if (value) drafts.set(id, structuredClone(value));
      return drafts.get(id) ?? null;
    },
  };
  return { port, data };
}
