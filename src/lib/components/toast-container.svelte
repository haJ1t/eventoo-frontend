<script lang="ts">
  import { toast, type Toast } from '$lib/stores/toast';
  import { fade, fly } from 'svelte/transition';
  import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-svelte';

  let toasts: Toast[] = [];

  toast.subscribe(value => {
    toasts = value;
  });

  function getIcon(type: string) {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  }

  function getStyles(type: string) {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }

  function getIconStyles(type: string) {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  }
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
  {#each toasts as t (t.id)}
    <div
      in:fly={{ x: 100, duration: 300 }}
      out:fade={{ duration: 200 }}
      class="flex items-start gap-3 p-4 rounded-lg border shadow-lg {getStyles(t.type)}"
    >
      <svelte:component this={getIcon(t.type)} class="h-5 w-5 shrink-0 {getIconStyles(t.type)}" />
      <p class="flex-1 text-sm font-medium">{t.message}</p>
      <button
        onclick={() => toast.remove(t.id)}
        class="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  {/each}
</div>
