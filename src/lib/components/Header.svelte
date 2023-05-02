<script lang="ts">
  import MaterialSymbolsUploadRounded from "~icons/material-symbols/upload-rounded";
  import MaterialSymbolsLoginRounded from "~icons/material-symbols/login-rounded";
  import MaterialSymbolsSettingsOutlineRounded from "~icons/material-symbols/settings-outline-rounded";
  let linkClass = "hover:text-zinc-300 active:text-zinc-500 flex justify-center items-center gap-1";
</script>

<!-- container -->
<header class="bg-zinc-800 px-4 py-3 text-white">
  <div class="mx-auto flex max-w-screen-xl items-center justify-between">
    <!-- title -->
    <a class="text-lg font-bold" href="/">yea</a>
    <!-- right-aligned links -->
    <nav class="flex gap-6">
      <a class={linkClass} href="/upload"><MaterialSymbolsUploadRounded />Upload</a>
      <a class={linkClass} href="/settings"><MaterialSymbolsSettingsOutlineRounded />Settings</a>
      <a class={linkClass} href="/login"><MaterialSymbolsLoginRounded />Login</a>
    </nav>
  </div>
</header>
