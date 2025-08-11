<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { X, Plus, Search } from 'lucide-svelte';
  
	// Props
	interface Props {
	  selectedTags?: string[];
	  availableTags?: string[];
	  placeholder?: string;
	  maxTags?: number;
	  allowCustomTags?: boolean;
	}
  
	let {
	  selectedTags = $bindable([]),
	  availableTags = [],
	  placeholder = 'Search tags...',
	  maxTags = 10,
	  allowCustomTags = true
	}: Props = $props();
  
	// State
	let searchTerm = $state('');
	let showDropdown = $state(false);
	let inputRef: any = $state();
  
	// Event dispatcher
	const dispatch = createEventDispatcher<{
	  tagsChange: { tags: string[] };
	  tagAdd: { tag: string };
	  tagRemove: { tag: string };
	}>();
  
	// Derived states - Svelte 5 runes syntax
	let filteredTags = $derived(
	  availableTags.filter(tag => 
		tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
		!selectedTags.includes(tag)
	  )
	);
  
	let canAddMoreTags = $derived(selectedTags.length < maxTags);
  
	let customTagExists = $derived(
	  searchTerm.trim() !== '' && 
	  !availableTags.some(tag => tag.toLowerCase() === searchTerm.toLowerCase()) &&
	  !selectedTags.some(tag => tag.toLowerCase() === searchTerm.toLowerCase())
	);
  
	// Functions
	function addTag(tag: string) {
	  if (!selectedTags.includes(tag) && canAddMoreTags) {
		selectedTags = [...selectedTags, tag];
		dispatch('tagAdd', { tag });
		dispatch('tagsChange', { tags: selectedTags });
		searchTerm = '';
		showDropdown = false;
	  }
	}
  
	function removeTag(tag: string) {
	  selectedTags = selectedTags.filter(t => t !== tag);
	  dispatch('tagRemove', { tag });
	  dispatch('tagsChange', { tags: selectedTags });
	}
  
	function addCustomTag() {
	  const trimmedTag = searchTerm.trim();
	  if (trimmedTag && allowCustomTags && customTagExists && canAddMoreTags) {
		addTag(trimmedTag);
	  }
	}
  
	function handleInputFocus() {
	  showDropdown = true;
	}
  
	function handleInputBlur() {
	  // Delay hiding dropdown to allow clicks
	  setTimeout(() => {
		showDropdown = false;
	  }, 200);
	}
  
	function handleKeydown(event: KeyboardEvent) {
	  if (event.key === 'Enter') {
		event.preventDefault();
		if (filteredTags.length > 0) {
		  addTag(filteredTags[0]);
		} else if (allowCustomTags && customTagExists) {
		  addCustomTag();
		}
	  } else if (event.key === 'Escape') {
		showDropdown = false;
		inputRef?.blur();
	  } else if (event.key === 'Backspace' && searchTerm === '' && selectedTags.length > 0) {
		removeTag(selectedTags[selectedTags.length - 1]);
	  }
	}
  
	function clearAllTags() {
	  selectedTags = [];
	  dispatch('tagsChange', { tags: selectedTags });
	}
  </script>
  
  <div class="w-full space-y-2">
	<!-- Selected Tags -->
	{#if selectedTags.length > 0}
	  <div class="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md">
		{#each selectedTags as tag (tag)}
		  <div class="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
			<span>{tag}</span>
			<button
			  class="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center"
			  onclick={() => removeTag(tag)}
			  type="button"
			>
			  <X class="h-3 w-3" />
			</button>
		  </div>
		{/each}
		
		{#if selectedTags.length > 1}
		  <button
			class="h-6 px-2 text-xs text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
			onclick={clearAllTags}
			type="button"
		  >
			Clear all
		  </button>
		{/if}
	  </div>
	{/if}
  
	<!-- Search Input -->
	<div class="relative">
	  <div class="relative">
		<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
		<input
		  bind:this={inputRef}
		  bind:value={searchTerm}
		  type="text"
		  placeholder={placeholder}
		  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-4"
		  onfocus={handleInputFocus}
		  onblur={handleInputBlur}
		  onkeydown={handleKeydown}
		  disabled={!canAddMoreTags}
		/>
	  </div>
  
	  <!-- Tag limit indicator -->
	  {#if maxTags > 0}
		<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
		  <span class="text-xs text-muted-foreground">
			{selectedTags.length}/{maxTags}
		  </span>
		</div>
	  {/if}
	</div>
  
	<!-- Dropdown -->
	{#if showDropdown && (filteredTags.length > 0 || (allowCustomTags && customTagExists))}
	  <div class="relative">
		<div class="absolute top-0 left-0 right-0 z-50 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
		  <!-- Available Tags -->
		  {#if filteredTags.length > 0}
			<div class="p-2">
			  <div class="text-xs font-medium text-muted-foreground mb-2 px-2">
				Available Tags
			  </div>
			  {#each filteredTags as tag (tag)}
				<button
				  class="w-full justify-start h-8 px-2 text-sm hover:bg-accent text-left bg-transparent border-none cursor-pointer rounded-sm"
				  onclick={() => addTag(tag)}
				  type="button"
				>
				  <span class="truncate">{tag}</span>
				</button>
			  {/each}
			</div>
		  {/if}
  
		  <!-- Custom Tag Option -->
		  {#if allowCustomTags && customTagExists}
			{#if filteredTags.length > 0}
			  <div class="border-t"></div>
			{/if}
			<div class="p-2">
			  <button
				class="w-full justify-start h-8 px-2 text-sm hover:bg-accent text-left bg-transparent border-none cursor-pointer rounded-sm flex items-center"
				onclick={addCustomTag}
				type="button"
			  >
				<Plus class="h-3 w-3 mr-2" />
				<span class="truncate">Create "{searchTerm.trim()}"</span>
			  </button>
			</div>
		  {/if}
  
		  <!-- No results -->
		  {#if filteredTags.length === 0 && (!allowCustomTags || !customTagExists)}
			<div class="p-4 text-center text-sm text-muted-foreground">
			  No tags found
			</div>
		  {/if}
		</div>
	  </div>
	{/if}
  
	<!-- Help Text -->
	{#if !canAddMoreTags}
	  <p class="text-xs text-muted-foreground">
		Maximum {maxTags} tags allowed
	  </p>
	{:else if allowCustomTags}
	  <p class="text-xs text-muted-foreground">
		Type to search existing tags or create new ones
	  </p>
	{:else}
	  <p class="text-xs text-muted-foreground">
		Type to search available tags
	  </p>
	{/if}
  </div>
  