import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
export default defineConfig({
  envPrefix: ["VITE_", "CATALOG_"],
  plugins: [svelte()],
  resolve: { dedupe: ["svelte", "@lapismd/design-core"] },
});
