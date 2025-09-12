<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    goto('/home');
  });
</script>

<!-- Redirect to home page -->
<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p class="mt-2 text-gray-600">Loading...</p>
  </div>
</div>