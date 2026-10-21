import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  root,
  plugins: [svelte()],
  resolve: { dedupe: ["svelte", "@lapismd/design-core"] },
  server: {
    host: "127.0.0.1",
    port: 7497,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../../../", import.meta.url))] },
  },
});
