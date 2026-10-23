import { describe, expect, it } from "vitest";
import { RepositoryProfileController } from "../packages/repository-ui/src/jj/settings/profile/controller.js";
import type {
  ProfilePort,
  ProfileRead,
  ProfileDraft,
  ProfileRequest,
} from "../packages/repository-ui/src/jj/settings/profile/model.js";
function fixture() {
  const profile = {
    principal: "existing-actor",
    revision: 2,
    details: {
      display_name: "Alex",
      description: "",
      avatar: null,
      email: null,
      gravatar: false,
    },
  };
  let draft: ProfileDraft | null = null,
    saves = 0;
  const requests: ProfileRequest[] = [];
  const port: ProfilePort = {
    async read() {
      return { profile, draft: draft ?? undefined };
    },
    async draft(value) {
      draft = structuredClone(value);
    },
    async save(request) {
      saves++;
      requests.push(structuredClone(request));
      return { state: "unknown" };
    },
    async inspect() {
      return { state: "not-known" };
    },
    async upload() {
      return { reference: "asset:photo", url: "data:image/png;base64,photo" };
    },
  };
  return { port, profile, requests, saved: () => saves };
}
describe("personal Profile controller", () => {
  it("restores edits and exact unknown requests without replay, retrying only after inspection", async () => {
    const f = fixture(),
      first = new RepositoryProfileController(f.port);
    await first.open();
    first.edit("display_name", "Edited");
    await first.save();
    expect(f.saved()).toBe(1);
    await first.close();
    const reopened = new RepositoryProfileController(f.port);
    await reopened.open();
    expect(reopened.state.draft?.display_name).toBe("Edited");
    expect(f.saved()).toBe(1);
    await reopened.retry();
    expect(f.saved()).toBe(1);
    await reopened.inspect();
    await reopened.retry();
    expect(f.saved()).toBe(2);
    expect(f.requests[1]).toEqual(f.requests[0]);
    await reopened.close();
  });
  it("retains a conflict draft and updates its version only after explicit reconciliation", async () => {
    const f = fixture();
    f.port.save = async () => ({
      state: "conflict",
      profile: { ...f.profile, revision: 3 },
    });
    const controller = new RepositoryProfileController(f.port);
    await controller.open();
    controller.edit("description", "Keep this");
    await controller.save();
    expect(controller.state.conflict).toBe(true);
    expect(controller.state.draft?.description).toBe("Keep this");
    controller.rebase();
    let request: ProfileRequest | undefined;
    f.port.save = async (value) => {
      request = value;
      return {
        state: "saved",
        profile: { ...f.profile, revision: 4, details: value.details },
      };
    };
    await controller.save();
    expect(request?.revision).toBe(3);
    expect(controller.state.profile?.principal).toBe("existing-actor");
    await controller.close();
  });
  it("rejects a late read after another profile read and disposal", async () => {
    const f = fixture();
    let resolve!: (read: ProfileRead) => void;
    const controller = new RepositoryProfileController({
      ...f.port,
      read: () =>
        new Promise((r) => {
          resolve = r;
        }),
    });
    const pending = controller.open();
    await controller.close();
    resolve({ profile: f.profile });
    await pending;
    expect(controller.state.profile).toBeUndefined();
  });
  it("releases a known rejected save while retaining the editable draft", async () => {
    const f = fixture();
    f.port.save = async () => ({
      state: "rejected",
      message: "Invalid avatar",
    });
    const controller = new RepositoryProfileController(f.port);
    await controller.open();
    controller.edit("avatar", "https:");
    await controller.save();
    expect(controller.state.pending).toBeUndefined();
    expect(controller.state.error).toContain("Invalid avatar");
    expect(controller.state.draft?.avatar).toBe("https:");
    controller.edit("avatar", null);
    expect(controller.state.draft?.avatar).toBeNull();
    await controller.close();
  });
  it("drains an owned image upload before closing", async () => {
    const f = fixture();
    let resolve!: (image: { reference: string; url: string }) => void;
    f.port.upload = () =>
      new Promise((r) => {
        resolve = r;
      });
    const controller = new RepositoryProfileController(f.port);
    await controller.open();
    const upload = controller.upload(
      new File(["raster"], "avatar.png"),
      new AbortController().signal,
    );
    let closed = false;
    const closing = controller.close().then(() => {
      closed = true;
    });
    await Promise.resolve();
    expect(closed).toBe(false);
    resolve({ reference: "asset:photo", url: "data:image/png;base64,photo" });
    expect(await upload).toBe("data:image/png;base64,photo");
    await closing;
    expect(closed).toBe(true);
  });
});
