<script lang="ts">
  import { formatMilliseconds } from "$lib/utils";

  import { page } from "$app/stores";
</script>

<div>
  <div
    class="inset-0 h-64 w-64 bg-cover bg-center"
    style="background-image: url({$page.data.mix.artwork_url});" />
  <h1>{$page.data.mix.title}</h1>
  <h2>{$page.data.mix.artists.name}</h2>
  <ol>
    {#each $page.data.mix.timestamps as track}
      <li>
        <h3>{track.artist} - {track.title} @ {formatMilliseconds(track.timestamp_ms)}</h3>
      </li>
    {/each}
  </ol>
</div>
