<script lang="ts">
	import { Input } from "$lib/components/ui/input";

	export let placeholder = "Search...";
	export let value = "";
	export let className = "";

	function handleInput(event) {
		value = event.target.value;
	}
</script>

<div class="relative {className}">
	<svg
		class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
	<Input
		type="text"
		{placeholder}
		{value}
		on:input={handleInput}
		class="pl-8"
	/>
</div>
