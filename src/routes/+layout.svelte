<script>
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
</script>

<div class="flex h-screen overflow-hidden">
  <!-- Sidebar scrollable içinde kendi içeriğine göre -->
  <Sidebar />

  <!-- Main content -->
  <main class="flex-1 flex flex-col overflow-hidden">
    <Header />
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </main>
</div>
