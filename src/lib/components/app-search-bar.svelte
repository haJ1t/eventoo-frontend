<script>
	import { Search } from "lucide-svelte";
	import { Input } from "$lib/components/ui/input";

	// Props
	let {
		value = $bindable(""),
		placeholder = "Search...",
		class: className = "",
		onSearch = null,
		debounceMs = 300,
		showIcon = true,
		iconClass = "h-5 w-5 text-gray-400",
		inputClass = "",
		...restProps
	} = $props();

	let debounceTimer;

	// Debounced search function
	function handleInput(event) {
		const newValue = event.target.value;
		value = newValue;
		
		if (onSearch && debounceMs > 0) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				onSearch(newValue);
			}, debounceMs);
		} else if (onSearch) {
			onSearch(newValue);
		}
	}

	// Clear search
	function clearSearch() {
		value = "";
		if (onSearch) {
			onSearch("");
		}
	}
</script>

<div class="relative {className}">
	{#if showIcon}
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class={iconClass} />
		</div>
	{/if}
	
	<div class="relative">
        <input
            type="text"
            {placeholder}
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary
            {showIcon ? 'pl-10' : ''} {value ? 'pr-10' : ''} w-full {inputClass}"
            {value}
            oninput={handleInput}
            {...restProps}
        />
    </div>
    
	
	{#if value}
		<button
			type="button"
			onclick={clearSearch}
			class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
			aria-label="Clear search"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
</div>