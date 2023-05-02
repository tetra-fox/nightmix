<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  // dispatch('change', value);
  // dispatch('input', value);

  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value = 50;
  export let classes = "";
</script>

<div class="relative cursor-pointer overflow-hidden">
  <!-- thumb -->
  <div
    class="absolute h-full w-1/2 rounded-full transition-all duration-500 ease-in-out"
    style={`left: ${((value - min) / (max - min)) * 100}%`} />
  <!-- track -->
  <div class="absolute h-2 w-full bg-gray-300" />
</div>
