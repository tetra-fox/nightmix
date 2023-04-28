<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { dev } from "$app/environment";
  import { tooltip } from "svooltip";
  import "svooltip/styles.css";
  import { formatMilliseconds, getTimestampByMs } from "$lib/utils";
  import MaterialSymbolsSkipPreviousRounded from "~icons/material-symbols/skip-previous-rounded";
  import MaterialSymbolsSkipNextRounded from "~icons/material-symbols/skip-next-rounded";
  import MaterialSymbolsPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
  import MaterialSymbolsPauseRounded from "~icons/material-symbols/pause-rounded";
  import MaterialSymbolsVolumeUpRounded from "~icons/material-symbols/volume-up-rounded";

  import type { playerState } from "$lib/store";
  export let playerStore: typeof playerState;

  let audio: HTMLAudioElement;
  let currentTrack: null = null;
  let shouldDismissVolumePopup = false;
  let showVolumeSlider = false;
  let currentTimestamp = null;

  const btnClass = "w-6 text-xl flex justify-center items-center";

  $: {
    if (audio) {
      if ($playerStore.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
      audio.volume = $playerStore.volume;
    }
  }

  $: {
    if (audio && $playerStore.currentTrack !== currentTrack) {
      currentTrack = $playerStore.currentTrack;
      if (dev) console.debug("loading track", $playerStore.currentTrack);
      audio.load();
    }
  }

  const updateCurrentTime = () => {
    if (!audio) return;
    playerStore.seek(audio.currentTime);
    currentTimestamp = getTimestampByMs(
      $playerStore.currentTrack.timestamps,
      $playerStore.currentTime * 1000
    );
  };

  onMount(() => {
    const savedState = localStorage.getItem("playerState");
    if (savedState) {
      playerStore.set(JSON.parse(savedState));
      playerStore.seek($playerStore.currentTime);
    }
  });

  // save the store to local storage before the page is unloaded
  const handleBeforeUnload = () => {
    playerStore.pause();
    localStorage.setItem("playerState", JSON.stringify($playerStore));
  };

  const handleKeydown = ({
    key,
    ctrlKey,
    repeat,
  }: {
    key: string;
    ctrlKey: any;
    repeat: boolean;
  }) => {
    if (repeat) return;

    switch (key) {
      case " ":
        playerStore.toggleTransport();
        break;
      case "ArrowLeft":
        playerStore.seek($playerStore.currentTime - 5);
        audio.currentTime = $playerStore.currentTime;
        break;
      case "ArrowRight":
        playerStore.seek($playerStore.currentTime + 5);
        audio.currentTime = $playerStore.currentTime;
        break;
    }
  };

  let rangeClass = "";
</script>

<svelte:window on:beforeunload={handleBeforeUnload} on:keydown={handleKeydown} />

<audio
  bind:this={audio}
  on:timeupdate={updateCurrentTime}
  on:loadedmetadata={() => {
    playerStore.setDuration(audio.duration);
  }}
  controls
  class="fixed bottom-16 left-2">
  {#if $playerStore.currentTrack}
    <source src={$playerStore.currentTrack.audio_url} />
  {/if}
</audio>

<div class="fixed bottom-0 left-0 z-50 h-14 w-screen border-t border-t-zinc-600 bg-zinc-800">
  <div class="mx-auto flex h-full max-w-screen-xl justify-between gap-4">
    <div class="flex items-center justify-center gap-2">
      <a href={$playerStore.currentTrack
        ? `/${$playerStore.currentTrack.artists.username}/${$playerStore.currentTrack.slug}`
        : ""}>
      <div
        class="h-11 w-11 rounded-sm border border-zinc-700 bg-cover bg-center"
        style="background-image: url({$playerStore.currentTrack
          ? $playerStore.currentTrack.artwork_url
          : ''})" />
          </a>
      <div class="flex flex-col justify-center">
        <a
          href={$playerStore.currentTrack
            ? `/${$playerStore.currentTrack.artists.username}/${$playerStore.currentTrack.slug}`
            : ""}
          ><p class="text-sm font-bold">
            {$playerStore.currentTrack ? $playerStore.currentTrack.title : ""}
          </p></a>
        <a href={$playerStore.currentTrack ? `/${$playerStore.currentTrack.artists.username}` : ""}
          ><p class="text-xs text-gray-300">
            {$playerStore.currentTrack ? $playerStore.currentTrack.artists.name : ""}
          </p></a>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4">
      <button
        class={btnClass}
        >
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

      <div class="flex flex-col items-center">
        {#if currentTimestamp}
          <div class="text-[0.65rem]">
            <span>{currentTimestamp.artist} - {currentTimestamp.title}</span>
          </div>
        {/if}
        <div class="flex gap-4 items-center justify-center">
          <p class="text-[0.65rem] select-none">
            {$playerStore.currentTime
              ? formatMilliseconds($playerStore.currentTime * 1000)
              : "0:00"}
          </p>
          <input
            type="range"
            min="0"
            max={$playerStore.duration}
            step="0.01"
            class="range w-96"
            bind:value={$playerStore.currentTime}
            on:change={() => {
              audio.currentTime = $playerStore.currentTime;
            }}
            on:input={() => {
              audio.currentTime = $playerStore.currentTime;
            }} />
          <p class="text-[0.65rem] select-none">
            {$playerStore.duration ? formatMilliseconds($playerStore.duration * 1000) : "0:00"}
          </p>
        </div>
      </div>

      <button
        class={btnClass + " rounded-md bg-white bg-opacity-10"}
        on:click={() => (showVolumeSlider = !showVolumeSlider)}
        ><MaterialSymbolsVolumeUpRounded /></button>

      <div
        class="max-w-2 fixed flex origin-left -translate-y-10 translate-x-80 -rotate-90 border border-t-zinc-600 bg-zinc-800 p-4 opacity-0 transition-opacity duration-75"
        class:opacity-100={showVolumeSlider}
        class:pointer-events-none={!showVolumeSlider}
        on:blur
        on:mouseout={() => {
          if (shouldDismissVolumePopup) {
            showVolumeSlider = false;
            shouldDismissVolumePopup = false;
          }
        }}>
        <input
          type="range"
          name="volume"
          id="volume"
          min="0"
          max="1"
          step="0.01"
          bind:value={$playerStore.volume}
          on:change={() => {
            audio.volume = $playerStore.volume;
          }}
          on:input={() => {
            audio.volume = $playerStore.volume;
            shouldDismissVolumePopup = true;
          }}
          class="range" />
      </div>
    </div>
  </div>
</div>

<style>
  .range {
    appearance: none;
    height: 2px;
    background-color: var(--color-zinc-500);
    cursor: pointer;
  }

  /* Webkit styles */
  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    border: 4px solid inside var(--color-zinc-300);
    background-color: var(--color-zinc-600);
  }

  .range::-webkit-slider-runnable-track {
    height: 2px;
    background-color: var(--color-purple-500);
  }

  /* Firefox styles */
  .range::-moz-range-thumb {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    border: 4px solid var(--color-zinc-300);
    background-color: var(--color-zinc-600);
  }

  .range::-moz-range-progress {
    height: 2px;
    background-color: var(--color-purple-500);
  }
</style>
