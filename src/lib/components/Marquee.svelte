<script lang="ts">
  export let duration = 15;
  export let repeat = 2;
  export let paused = false;
  export let resetOnPause = false;
</script>

<div class="overflow-hidden">
  <div class="w-screen" class:paused class:reset={resetOnPause && paused}>
    {#each Array(repeat) as _}
      <div class="content float-left" style="animation-duration: {duration}s">
        <slot />
      </div>
    {/each}
  </div>
</div>

<style>
  .content {
    animation: marquee infinite linear;
  }
  .paused .content {
    animation-play-state: paused;
  }
  .paused.reset .content {
    animation: none;
  }
  @keyframes marquee {
    100% {
      transform: translateX(-100%);
    }
  }
</style>
