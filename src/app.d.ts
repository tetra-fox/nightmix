import type { Database } from "$lib/supabase/types";

/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      mixes?: Database["public"]["Tables"]["mixes"]["Row"][];
      mix?: Database["public"]["Tables"]["mixes"]["Row"];
    }
    // interface Platform {}
  }
}

// export {};
