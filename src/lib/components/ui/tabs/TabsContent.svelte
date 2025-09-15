<script lang="ts">
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  export let value: string;
  
  let className: string = '';
  export { className as class };
  
  const context = getContext('tabs') as { activeTab: any };
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  
  $: isActive = $activeTab === value;
</script>

{#if isActive}
  <div 
    role="tabpanel"
    tabindex="0"
    class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 {className}"
    transition:fade={{ duration: 150 }}
  >
    <slot />
  </div>
{/if}
