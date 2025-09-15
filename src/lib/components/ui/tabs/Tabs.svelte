<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let value: string = '';
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';
  export let activationMode: 'automatic' | 'manual' = 'automatic';
  
  let className: string = '';
  export { className as class };

  const activeTab = writable(value);
  
  setContext('tabs', {
    activeTab,
    orientation,
    activationMode,
    setActiveTab: (newValue: string) => {
      activeTab.set(newValue);
      value = newValue;
    }
  });

  $: if (value !== $activeTab) {
    activeTab.set(value);
  }
</script>

<div class="tabs {className}" data-orientation={orientation}>
  <slot />
</div>
