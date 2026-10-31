import {
  mkdtemp,
  writeFile,
  readFile,
  rm,
  readdir,
  mkdir,
  copyFile,
  realpath,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { documentedExamples } from "./consumer-examples.mjs";
const root = process.cwd(),
  temporary = await mkdtemp(path.join(tmpdir(), "agent-ui-package-"));
function run(command, args, cwd = temporary) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")} failed (${result.status})`);
}
try {
  const rootManifest = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  );
  const patchPath = "patches/bits-ui@2.20.2.patch";
  const patchHash =
    "debd3bc7d43917f0967f0cc1e212fc5c7721c751d3b92bf8f31030d1c96289ad";
  const patchBytes = await readFile(path.join(root, patchPath));
  if (createHash("sha256").update(patchBytes).digest("hex") !== patchHash)
    throw Error("Shared dependency patch differs");
  await mkdir(path.join(temporary, "patches"));
  await copyFile(path.join(root, patchPath), path.join(temporary, patchPath));
  for (const name of ["agent-ui", "repository-ui"])
    run(
      "pnpm",
      ["pack", "--pack-destination", temporary],
      path.join(root, "packages", name),
    );
  const archives = (await readdir(temporary)).filter((p) => p.endsWith(".tgz"));
  for (const file of archives) {
    const contents = execFileSync("tar", ["-tzf", path.join(temporary, file)], {
      encoding: "utf8",
    });
    if (
      /(?:\.stories\.|\.example-sources\.|\.tokens\.json|\.mdx|catalog\/agents|tsconfig\.json)/.test(
        contents,
      )
    )
      throw new Error(`Catalog material leaked into ${file}`);
  }
  const examples = documentedExamples();
  await mkdir(path.join(temporary, "examples"));
  for (const [index, example] of examples.entries())
    await writeFile(
      path.join(temporary, "examples", `Example${index}.svelte`),
      example.code,
    );
  const dependencies = Object.fromEntries(
    archives.map((file) => [
      "@lapismd/" +
        (file.includes("repository-ui") ? "repository-ui" : "agent-ui"),
      "file:" + path.join(temporary, file),
    ]),
  );
  await writeFile(
    path.join(temporary, "package.json"),
    JSON.stringify({
      name: "agent-ui-package-acceptance",
      private: true,
      type: "module",
      packageManager: rootManifest.packageManager,
      pnpm: rootManifest.pnpm,
      dependencies: {
        ...dependencies,
        svelte: "5.57.2",
        "@lucide/svelte": "^1.57.0",
        "@lapismd/design-core":
          rootManifest.devDependencies["@lapismd/design-core"],
        "@lapismd/jj-history": "^0.1.0",
      },
      devDependencies: {
        vite: "8.3.5",
        "@sveltejs/vite-plugin-svelte": "7.3.1",
        "svelte-check": "^4.3.1",
        typescript: "~5.9.3",
      },
    }),
  );
  await writeFile(
    path.join(temporary, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        skipLibCheck: true,
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        allowJs: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
      },
      include: ["**/*.svelte", "main.ts"],
    }),
  );
  await writeFile(
    path.join(temporary, "App.svelte"),
    `<script lang="ts">import {untrack,onDestroy} from 'svelte';import {AgentWorkbench,AgentUiController,type AgentPort} from '@lapismd/agent-ui';import {RepositoryWorkbench,RepositoryController,type RepositoryPort} from '@lapismd/repository-ui';import {StackWorkspaceController} from '@lapismd/repository-ui/stacks';import {AgentChatScreen} from '@lapismd/agent-ui/chat';let {agent,repository}:{agent:AgentPort;repository:RepositoryPort}=$props();const a=untrack(()=>new AgentUiController(agent));const r=untrack(()=>new RepositoryController(repository));onDestroy(()=>{void a.close();void r.close();});void StackWorkspaceController;void AgentChatScreen;</script><AgentWorkbench controller={a}/><RepositoryWorkbench controller={r}/>`,
  );
  await writeFile(
    path.join(temporary, "main.ts"),
    `import App from './App.svelte';import '@lapismd/agent-ui/styles.css';import '@lapismd/repository-ui/styles.css';export {App};\n${examples.map((_, index) => `export {default as Example${index}} from './examples/Example${index}.svelte';`).join("\n")}`,
  );
  await writeFile(
    path.join(temporary, "vite.config.js"),
    `import {defineConfig} from 'vite';import {svelte} from '@sveltejs/vite-plugin-svelte';export default defineConfig({plugins:[svelte()],build:{lib:{entry:'main.ts',formats:['es']},rollupOptions:{external:['svelte']}}});`,
  );
  // An explicit review overlay may resolve unpublished siblings from packed
  // public exports; portable manifests and ordinary registry installs stay intact.
  const reviewPnpmfile = process.env.AGENT_UI_REVIEW_PNPMFILE;
  run("pnpm", [
    ...(reviewPnpmfile
      ? [`--config.pnpmfile=${path.resolve(root, reviewPnpmfile)}`]
      : []),
    "install",
    "--ignore-scripts",
    "--no-frozen-lockfile",
  ]);
  const coreRoot = path.join(temporary, "node_modules/@lapismd/design-core");
  const corePatch = JSON.parse(
    await readFile(path.join(coreRoot, "patches/manifest.json"), "utf8"),
  );
  if (corePatch.patchSha256 !== patchHash || corePatch.version !== "2.20.2")
    throw Error("Installed Core patch contract differs");
  if (!Array.isArray(corePatch.files) || corePatch.files.length !== 3)
    throw Error("Installed Core patch must retain all three runtime fixes");
  const consumerRequire = createRequire(
    await realpath(path.join(coreRoot, "package.json")),
  );
  const bitsRoot = path.dirname(
    path.dirname(consumerRequire.resolve("bits-ui")),
  );
  const bits = JSON.parse(
    await readFile(path.join(bitsRoot, "package.json"), "utf8"),
  );
  if (bits.version !== "2.20.2")
    throw Error("Packed consumer Bits version differs");
  for (const file of corePatch.files) {
    const actual = createHash("sha256")
      .update(await readFile(path.join(bitsRoot, file.path)))
      .digest("hex");
    if (actual !== file.afterSha256)
      throw Error(`Packed consumer dependency patch differs: ${file.path}`);
  }
  run("pnpm", [
    "exec",
    "svelte-check",
    "--tsconfig",
    "tsconfig.json",
    "--fail-on-warnings",
  ]);
  run("pnpm", ["exec", "vite", "build"]);
  console.log(
    `Clean packed-package type and Vite consumption passed; ${examples.length} documented examples compiled`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
