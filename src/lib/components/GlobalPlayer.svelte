<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { dev } from "$app/environment";
  import { tooltip } from "svooltip";
  import "svooltip/styles.css";
  import Slider from "$lib/components/Slider.svelte";
  import { formatMilliseconds, getTimestampByMs } from "$lib/utils";
  import MaterialSymbolsSkipPreviousRounded from "~icons/material-symbols/skip-previous-rounded";
  import MaterialSymbolsSkipNextRounded from "~icons/material-symbols/skip-next-rounded";
  import MaterialSymbolsPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
  import MaterialSymbolsPauseRounded from "~icons/material-symbols/pause-rounded";
  import MaterialSymbolsVolumeUpRounded from "~icons/material-symbols/volume-up-rounded";
  import MaterialSymbolsRepeatRounded from "~icons/material-symbols/repeat-rounded";
  import MaterialSymbolsRepeatOneRounded from "~icons/material-symbols/repeat-one-rounded";
  import MaterialSymbolsKeyboardArrowUpRounded from "~icons/material-symbols/keyboard-arrow-up-rounded";

  import type { PlayerStore } from "$lib/stores";
  export let playerStore: PlayerStore;
  import { RepeatMode } from "$lib/enums/repeatmode";

  let audio: HTMLAudioElement;
  let currentTrack: any = null;
  let shouldDismissVolumePopup = false;
  let showVolumeSlider = false;
  let currentTimestamp: any = null;

  onMount(() => {
    const savedState = localStorage.getItem("player_state");
    if (savedState) {
      playerStore.set(JSON.parse(savedState));
      playerStore.seek($playerStore.currentTime);
    }
    playerStore.subscribe((value) => {
      localStorage.setItem("player_state", JSON.stringify(value));
    });
  });

  const updateCurrentTime = () => {
    if (!audio) return;
    playerStore.seek(audio.currentTime);
    currentTimestamp = getTimestampByMs(
      $playerStore.currentTrack.timestamps,
      $playerStore.currentTime * 1000
    );
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

  $: {
    if (audio && $playerStore.currentTrack) {
      // play/pause
      if ($playerStore.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
      // repeat mode
      switch ($playerStore.currentTrack.repeat) {
        case RepeatMode.None:
          audio.loop = false;
          break;
        case RepeatMode.One:
          audio.loop = true;
          break;
        case RepeatMode.All:
          audio.loop = false;
          // TODO: implement. We need the queue working first
          break;
      }
      // volume change
      audio.volume = $playerStore.volume;
      // track change
      if ($playerStore.currentTrack !== currentTrack) {
        currentTrack = $playerStore.currentTrack;
        if (dev) console.debug("loading track", $playerStore.currentTrack);
        audio.load();
      }
    }
  }

  $: {
    if (audio && $playerStore.currentTrack) {
      // set audio time to store time (usually after refresh)
      if ($playerStore.currentTime !== audio.currentTime && $playerStore.isPlaying) {
        console.log("weed");
        audio.currentTime = $playerStore.currentTime;
      }
    }
  }
</script>

<svelte:window
  on:beforeunload={() => {
    playerStore.pause();
  }}
  on:keydown|preventDefault={handleKeydown} />

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

<!-- root container -->
<div class="fixed bottom-0 left-0 z-50 h-14 w-screen border-t border-t-zinc-600 bg-zinc-800">
  <!-- flex metadata/controls -->
  <div class="mx-auto flex h-full max-w-screen-xl justify-between gap-4">
    <!-- metadata -->
    <div class="flex items-center justify-center gap-2">
      <!-- artwork -->
      <a
        href={$playerStore.currentTrack
          ? `/${$playerStore.currentTrack.artists.username}/${$playerStore.currentTrack.slug}`
          : ""}>
        <div
          class="h-11 w-11 rounded-sm border border-zinc-700 bg-cover bg-center"
          style="background-image: url({$playerStore.currentTrack
            ? $playerStore.currentTrack.artwork_url
            : ''})" />
      </a>
      <!-- metadata flex -->
      <div class="flex flex-col justify-center">
        <!-- metadata title -->
        <a
          href={$playerStore.currentTrack
            ? `/${$playerStore.currentTrack.artists.username}/${$playerStore.currentTrack.slug}`
            : ""}
          ><p class="text-sm font-bold text-zinc-100">
            {$playerStore.currentTrack ? $playerStore.currentTrack.title : ""}
          </p></a>
        <!-- metadata artist -->
        <a href={$playerStore.currentTrack ? `/${$playerStore.currentTrack.artists.username}` : ""}
          ><p class="text-xs text-zinc-300">
            {$playerStore.currentTrack ? $playerStore.currentTrack.artists.name : ""}
          </p></a>
      </div>
    </div>

    <!-- controls -->
    <div class="flex items-center justify-center gap-2">
      <!-- previous -->
      <button
        class="button force-dark"
        use:tooltip={{
          content: "Previous",
          delay: [250, 0],
        }}>
        <MaterialSymbolsSkipPreviousRounded />
      </button>
      <!-- play/pause -->

      <button
        class="button force-dark"
        on:click={playerStore.toggleTransport}
        use:tooltip={{
          content: `${$playerStore.isPlaying ? "Pause" : "Play"}`,
          delay: [250, 0],
        }}
        >{#if $playerStore.isPlaying}
          <MaterialSymbolsPauseRounded />
        {:else}
          <MaterialSymbolsPlayArrowRounded />
        {/if}
      </button>

      <!-- next -->
      <button
        class="button force-dark"
        use:tooltip={{
          content: "Next",
          delay: [250, 0],
        }}>
        <MaterialSymbolsSkipNextRounded />
      </button>

      <!-- seekbar/current song container -->

      <div class="flex flex-col items-center">
        <!-- current song -->
        {#if currentTimestamp}
          <div class="text-[0.65rem]">
            <span>{currentTimestamp.artist} - {currentTimestamp.title}</span>
          </div>
        {/if}
        <!-- track time -->
        <div class="flex items-center justify-center gap-4">
          <p class="select-none text-[0.65rem] text-zinc-100">
            {$playerStore.currentTime
              ? formatMilliseconds($playerStore.currentTime * 1000)
              : "0:00"}
          </p>
          <!-- seekbar -->
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
          <!-- <Slider classes="w-96" /> -->
          <!-- <Slider
            min={0}
            max={$playerStore.duration}
            step={0.01}
            bind:value={$playerStore.currentTime}
            on:change={() => {
              audio.currentTime = $playerStore.currentTime;
            }}
            on:input={() => {
              audio.currentTime = $playerStore.currentTime;
            }} /> -->
          <!-- track duration -->
          <p class="select-none text-[0.65rem] text-zinc-100">
            {$playerStore.duration ? formatMilliseconds($playerStore.duration * 1000) : "0:00"}
          </p>
        </div>
      </div>

      <!-- repeat button -->
      <button
        class="button force-dark"
        on:click={() => {
          playerStore.cycleRepeatMode();
        }}>
        {#if $playerStore.repeat == RepeatMode.None}
          <MaterialSymbolsPauseRounded />
        {:else if $playerStore.repeat == RepeatMode.One}
          <MaterialSymbolsRepeatRounded />
        {:else if $playerStore.repeat == RepeatMode.All}
          <MaterialSymbolsRepeatOneRounded />
        {/if}
      </button>

      <!-- volume toggle -->
      <button class="button bg" on:click={() => (showVolumeSlider = !showVolumeSlider)}
        ><MaterialSymbolsVolumeUpRounded /></button>

      <!-- volume slider container -->
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
        <!-- volume slider -->
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

  .button {
    @apply flex h-8 w-8 items-center justify-center text-xl text-zinc-100;
  }

  .button.bg {
    @apply rounded-md bg-white bg-opacity-10;
  }
</style>
