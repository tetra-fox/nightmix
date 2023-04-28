import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    nodeLoaderPlugin(),
    sveltekit(),
    Icons({
      compiler: "svelte",
    }),
  ],
});

// icons https://icones.js.org/
