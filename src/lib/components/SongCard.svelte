<script lang="ts">
  import type { Database } from "$lib/supabase/types";
  import MaterialSymbolsPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
  import MaterialSymbolsPauseRounded from "~icons/material-symbols/pause-rounded";
  import Marquee from "./Marquee.svelte";
  import { onMount } from "svelte";
  import { playerState } from "$lib/store";

  export let metadata: Database["public"]["Tables"]["mixes"]["Row"];

  let paused = true;
  let titleEl: HTMLElement;
  let shouldMarquee = false;

  // TODO: reimplement this by checking the width of the elements
  onMount(() => (shouldMarquee = titleEl.innerText.length >= 19));

  const handlePlayPause = (): void => {
    if ($playerState.currentTrack && $playerState.currentTrack.id === metadata.id) {
      if (paused) {
        playerState.play();
      } else {
        playerState.pause();
      }
    } else {
      playerState.stop(); // Stop current playback
      playerState.setTrack(metadata);
      playerState.play();
    }
  };
</script>

<div
  class="relative h-64 w-64"
  on:mouseenter={() => (paused = false)}
  on:mouseleave={() => (paused = true)}>
  <div
    class="absolute inset-0 bg-cover bg-center"
    style="background-image: url({metadata.artwork_url});" />
  <div class="absolute inset-0 bg-black opacity-25" />
  <div class="absolute bottom-0 left-0 max-w-full p-4 text-left">
    <div
      class="overflow-hidden whitespace-nowrap"
      style="mask-image: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);">
      {#if shouldMarquee}
        <!-- calculate the duration better later -->
        <Marquee {paused} resetOnPause duration={metadata.title.length / Math.max(metadata.title.length / 10, 1)}>
          <h3 id="title" class="mb-1 mr-4 text-xl font-bold text-white">
            {metadata.title}
          </h3>
        </Marquee>
      {:else}
        <div bind:this={titleEl} class="mb-1 mr-4 text-xl font-bold text-white">
          <h3 id="title">{metadata.title}</h3>
        </div>
      {/if}
      <p class="mt-0 text-sm text-white">{metadata.artists.name}</p>
    </div>
  </div>
  <div
    class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-75 hover:opacity-100">
    <button
      style="z-index: 1;"
      class="rounded-full bg-violet-600 p-3 text-white shadow-lg transition-colors duration-75 active:bg-violet-800 active:shadow-xl"
      on:click={handlePlayPause}>
      {#if $playerState.isPlaying && $playerState.currentTrack?.id === metadata.id}
        <MaterialSymbolsPauseRounded class="h-6 w-6" />
      {:else}
        <MaterialSymbolsPlayArrowRounded class="h-6 w-6" />
      {/if}
    </button>
    <a class="absolute inset-0" href="/{metadata.artists.username}/{metadata.slug}" />
  </div>
</div>
