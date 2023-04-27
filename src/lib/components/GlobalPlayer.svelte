<script lang="ts">
  import { playerState } from "$lib/store";

  let audio: HTMLAudioElement;

  const play = () => {
    playerState.play();
  };

  const pause = () => {
    playerState.pause();
  };

  $: {
    if (audio) {
      if ($playerState.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }

  $: if ($playerState.currentTrack) {
    if (audio) {
      playerState.stop();
      audio.load();
      playerState.play();
      console.log($playerState);
    }
  }
</script>

<audio bind:this={audio} controls>
  {#if $playerState.currentTrack}
    <source src={$playerState.currentTrack.audio_url} />
  {/if}
</audio>

<div>
  {#if $playerState.isPlaying}
    <button on:click={pause}>Pause</button>
  {:else}
    <button on:click={play}>Play</button>
  {/if}
</div>
