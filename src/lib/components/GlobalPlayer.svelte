<script lang="ts">
  import MaterialSymbolsSkipPreviousRounded from "~icons/material-symbols/skip-previous-rounded";
  import MaterialSymbolsSkipNextRounded from "~icons/material-symbols/skip-next-rounded";
  import MaterialSymbolsPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
  import MaterialSymbolsPauseRounded from "~icons/material-symbols/pause-rounded";
  import MaterialSymbolsVolumeUpRounded from "~icons/material-symbols/volume-up-rounded";

  import type { playerState } from "$lib/store";
  export let playerStore: typeof playerState;

  let audio: HTMLAudioElement;
  let showVolumeSlider = false;

  const play = () => {
    playerStore.play();
  };

  const pause = () => {
    playerStore.pause();
  };

  $: if (audio) {
    if ($playerStore.isPlaying || !audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    audio.volume = $playerStore.volume / 100; // set the volume of the audio element
    audio.currentTime = $playerStore.currentTime;
  }

  $: if ($playerStore.currentTrack) {
    if (audio) {
      playerStore.stop();
      audio.load();
      playerStore.play();
      console.log($playerStore);
    }
  }
  const btnClass = "w-6 h-12 text-xl flex justify-center items-center";
</script>

<audio
  bind:this={audio}
  bind:currentTime={$playerStore.currentTime}
  controls
  class="fixed bottom-16 left-4 z-50">
  {#if $playerStore.currentTrack}
    <source src={$playerStore.currentTrack.audio_url} />
  {/if}
</audio>

<div class="fixed bottom-0 left-0 z-50 h-12 w-screen border-t border-t-zinc-600 bg-zinc-800">
  <div class="mx-auto flex h-full max-w-screen-xl gap-4">
    <div class="flex items-center justify-center gap-2">
      <div
        class="h-10 w-10 bg-cover bg-center border rounded-sm border-zinc-700"
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
        <button class={btnClass} on:click={pause}><MaterialSymbolsPauseRounded /></button>
      {:else}
        <button class={btnClass} on:click={play}><MaterialSymbolsPlayArrowRounded /></button>
      {/if}
      <button class={btnClass}>
        <MaterialSymbolsSkipNextRounded />
      </button>
      <input type="range" name="seekbar" id="seekbar" value="0" />
      <button
        class={btnClass + " border-x-2"}
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
            class="h-3 w-full appearance-none rounded-full bg-blue-500"
            on:input={(e) => ($playerStore.volume = e.target.value)} />
        </div>
      {/if}
    </div>
  </div>
</div>
