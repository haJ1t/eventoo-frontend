<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    goto("/profile");
  });
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="text-sm text-gray-500">Redirecting…</div>
</div>
