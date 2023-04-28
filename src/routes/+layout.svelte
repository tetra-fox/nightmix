<script lang="ts">
  import "../app.postcss";
  import "@fontsource/figtree/variable.css";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";
  import Header from "$lib/components/Header.svelte";
  import GlobalPlayer from "$lib/components/GlobalPlayer.svelte";
  import { playerState } from "$lib/store";
</script>

<ProgressBar color="#a979f2" zIndex={1000} />

<Header />

<main
  class="inset-2 mx-auto max-w-screen-xl bg-zinc-100 pb-20 pt-6 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
  <slot />
  <GlobalPlayer playerStore={playerState} />
</main>

<style>
  :global(body) {
    font-family: "Figtree", sans-serif;
  }
</style>
