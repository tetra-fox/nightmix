import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
// import { nodeLoaderPlugin } from "@vavite/node-loader/plugin";
import Icons from "unplugin-icons/vite";

import "dotenv/config";

export default defineConfig({
  plugins: [
    // nodeLoaderPlugin(),
    sveltekit(),
    Icons({
      compiler: "svelte",
    }),
  ],

  define: {
    "import.meta.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    "import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    // danger uwu should not need this
    // "import.meta.env.SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(process.env.SUPABASE_SERVICE_ROLE_KEY),
  },
});

// icons https://icones.js.org/
