<script lang="ts">
  import "../app.postcss";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";
  import Header from "$lib/components/Header.svelte";
  import GlobalPlayer from "$lib/components/GlobalPlayer.svelte";
</script>

<ProgressBar color="#a979f2" zIndex={1000} />

<Header />

<main>
  <slot />
  <GlobalPlayer />
</main>
