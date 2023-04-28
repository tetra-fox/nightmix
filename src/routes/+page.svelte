<script lang="ts">
  import { page } from "$app/stores";
  import GlobalPlayer from "$lib/components/GlobalPlayer.svelte";
  import SongCard from "$lib/components/SongCard.svelte";
</script>

<div class="mx-auto max-w-screen-xl">
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each $page.data.mixes as mix}
      <SongCard metadata={mix} />
    {/each}
  </div>
</div>
