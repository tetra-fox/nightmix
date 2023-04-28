<script lang="ts">
  import { onMount } from "svelte";
  import MaterialSymbolsSkipPreviousRounded from "~icons/material-symbols/skip-previous-rounded";
  import MaterialSymbolsSkipNextRounded from "~icons/material-symbols/skip-next-rounded";
  import MaterialSymbolsPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
  import MaterialSymbolsPauseRounded from "~icons/material-symbols/pause-rounded";
  import MaterialSymbolsVolumeUpRounded from "~icons/material-symbols/volume-up-rounded";

  import { playerState } from "$lib/store";
  export let playerStore: typeof playerState;

  let audio: HTMLAudioElement;
  let currentTrack: null = null;
  let showVolumeSlider = false;

  const btnClass = "w-6 text-xl flex justify-center items-center";

  $: {
    if (audio) {
      if ($playerStore.isPlaying) {
        audio.play().then(() => console.debug("player playing"));
      } else {
        audio.pause();
        console.debug("player paused");
      }
      audio.volume = $playerStore.volume;
    }
  }

  $: {
    if (audio && $playerStore.currentTrack !== currentTrack) {
      currentTrack = $playerStore.currentTrack;
      console.debug("new track, loading audio");
      audio.load();
    }
  }

  const updateCurrentTime = () => {
    if (!audio) return;
    playerState.seek(audio.currentTime);
  };
</script>

<audio
  bind:this={audio}
  on:timeupdate={updateCurrentTime}
  on:loadedmetadata={() => {
    playerStore.setDuration(audio.duration);
  }}
  controls
  preload="metadata"
  class="fixed bottom-16 left-4 z-50">
  {#if $playerStore.currentTrack}
    <source src={$playerStore.currentTrack.audio_url} />
  {/if}
</audio>

<div class="fixed bottom-0 left-0 z-50 h-14 w-screen border-t border-t-zinc-600 bg-zinc-800">
  <div class="mx-auto flex h-full max-w-screen-xl justify-between gap-4">
    <div class="flex items-center justify-center gap-2">
      <div
        class="h-11 w-11 rounded-sm border border-zinc-700 bg-cover bg-center"
        style="background-image: url({'/test.png' || ''})" />
      <div class="flex flex-col items-center justify-center">
        <p class="text-sm font-bold">{"" || "Title"}</p>
        <p class="text-xs text-gray-300">{"" || "Artist"}</p>
      </div>
    </div>

    <div class="flex gap-4">
      <button class={btnClass}>
        <MaterialSymbolsSkipPreviousRounded />
      </button>
      {#if $playerStore.isPlaying}
        <button class={btnClass} on:click={playerStore.pause}
          ><MaterialSymbolsPauseRounded /></button>
      {:else}
        <button class={btnClass} on:click={playerStore.play}
          ><MaterialSymbolsPlayArrowRounded /></button>
      {/if}
      <button class={btnClass}>
        <MaterialSymbolsSkipNextRounded />
      </button>
      <input
        type="range"
        min="0"
        max={$playerStore.duration}
        step="0.01"
        bind:value={$playerStore.currentTime}
        on:change={() => {
          audio.currentTime = $playerStore.currentTime;
        }}
        on:input={() => {
          audio.currentTime = $playerStore.currentTime;
        }} />
      <button
        class={btnClass + " rounded-md bg-white bg-opacity-10 p-4"}
        on:click={() => (showVolumeSlider = !showVolumeSlider)}
        ><MaterialSymbolsVolumeUpRounded /></button>
      {#if showVolumeSlider}
        <div class="max-w-2 fixed flex -translate-y-14 -rotate-90 bg-slate-700 p-2">
          <input
            type="range"
            name="volume"
            id="volume"
            min="0"
            max="100"
            bind:value={$playerStore.volume * 100}
            class="h-3 w-full appearance-none rounded-full bg-blue-500"
            on:input={(e) => playerStore.setVolume(e.target.value / 100)} />
        </div>
      {/if}
    </div>
  </div>
</div>
