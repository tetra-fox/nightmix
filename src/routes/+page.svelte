<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { page } from "$app/stores";
  import GlobalPlayer from "$lib/components/GlobalPlayer.svelte";
  import SongCard from "$lib/components/SongCard.svelte";
</script>

<div
  class="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#each $page.data.mixes as mix}
    <SongCard metadata={mix} />
  {/each}
</div>
