<script lang="ts">
  import MaterialSymbolsFormatPaintRounded from "~icons/material-symbols/format-paint-rounded";
  import MaterialSymbolsPersonRounded from "~icons/material-symbols/person-rounded";
  import { userSettings } from "$lib/stores";
</script>

<div class="flex gap-6 items-center">
  <!-- sidebar -->
  <div class="sidebar flex w-36 flex-col gap-4">
    <a href="#appearance"><MaterialSymbolsFormatPaintRounded /> Appearance</a>
    <a href="#account"><MaterialSymbolsPersonRounded /> Account</a>
  </div>

  <!-- main content -->
  <div class="flex-grow">
    <slot />
    <h1>Settings</h1>
    <h3><MaterialSymbolsFormatPaintRounded /> Appearance</h3>
    <input type="checkbox" id="darkmode" bind:checked={$userSettings.darkMode} />
    <label for="darkmode">Dark theme</label>
  </div>
</div>

<style>
  h1,
  h3 {
    @apply flex items-center gap-1;
  }

  h1 {
    @apply text-2xl font-bold mb-4;
  }

  h3 {
    @apply text-lg;
  }

  .sidebar > a {
    @apply rounded-md bg-zinc-950 bg-opacity-30 p-2 text-sm flex items-center gap-1 justify-end;
  }
</style>
