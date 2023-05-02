<script lang="ts">
  import "../app.postcss";
  import "@fontsource/figtree/variable.css";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";
  import { browser } from "$app/environment";

  import { onMount } from "svelte";

  import Header from "$lib/components/Header.svelte";
  import GlobalPlayer from "$lib/components/GlobalPlayer.svelte";
  import { playerState, userSettings } from "$lib/stores";

  onMount(() => {
    const settings = localStorage.getItem("user_settings");

    userSettings.subscribe((value) => {
      localStorage.setItem("user_settings", JSON.stringify(value));
    });

    if (settings) {
      userSettings.set(JSON.parse(settings));
      console.log("loaded user settings");
    }
  });

  // settings changes
  $: if (browser) {
    document.documentElement.classList.toggle("dark", $userSettings.darkMode);
  }
</script>

<ProgressBar color="#a979f2" zIndex={1000} />

<Header />

<main
  class="mx-auto max-w-screen-xl bg-zinc-100 p-5 pb-20 pt-6 dark:bg-zinc-900 ">
  <slot />
  <GlobalPlayer playerStore={playerState} />
</main>

<style>
  :global(body) {
    font-family: "Figtree", sans-serif;
  }
  /* TODO: need better colors :( */
  :global(.svooltip) {
    z-index: 1000;
    @apply bg-stone-800;
  }
  :global(.svooltip-arrow) {
    @apply bg-stone-800;
  }
  blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre {
    @apply text-zinc-900 dark:text-zinc-100;
  }

</style>
