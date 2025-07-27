<script>
	import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";

	let { events = [], selectedTags = [], onTagChange } = $props();

	// Tüm unique tag'ları topla
	$: allTags = [...new Set(events.flatMap(event => event.tags || []))];

	function handleValueChange(value) {
		selectedTags = value || [];
		onTagChange?.(selectedTags);
	}

	function clearAllTags() {
		selectedTags = [];
		onTagChange?.([]);
	}
</script>

<div class="mb-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold">Filter by Tags</h3>
		{#if selectedTags.length > 0}
			<button 
				onclick={clearAllTags}
				class="text-sm text-gray-500 hover:text-gray-700 underline"
			>
				Clear All ({selectedTags.length})
			</button>
		{/if}
	</div>
	
	<ToggleGroup 
		type="multiple" 
		value={selectedTags}
		onValueChange={handleValueChange}
		class="flex flex-wrap gap-2 justify-start"
	>
		{#each allTags as tag}
			<ToggleGroupItem 
				value={tag} 
				class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-gray-100"
			>
				{tag}
			</ToggleGroupItem>
		{/each}
	</ToggleGroup>
	
	{#if selectedTags.length > 0}
		<div class="mt-3 text-sm text-gray-600">
			Showing events with: 
			<span class="font-medium">{selectedTags.join(', ')}</span>
		</div>
	{/if}
</div>
