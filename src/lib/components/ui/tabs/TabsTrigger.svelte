<script lang="ts">
  import { getContext } from 'svelte';

  export let value: string;
  
  let className: string = '';
  export { className as class };
  
  // Type tanımlaması ekle
  interface TabsContext {
    activeTab: any;
    setActiveTab: (value: string) => void;
    orientation?: string;
    activationMode?: string;
  }
  
  const context = getContext<TabsContext>('tabs');
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { activeTab, setActiveTab } = context;
  
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setActiveTab(value);
  }
  
  $: isActive = $activeTab === value;
</script>

<button
  type="button"
  role="tab"
  aria-selected={isActive}
  class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50'} {className}"
  on:click={handleClick}
>
  <slot />
</button>
