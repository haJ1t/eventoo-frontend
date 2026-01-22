<script>
	import { Dialog as DialogPrimitive } from "bits-ui";

	import XIcon from "@lucide/svelte/icons/x";

	let { ref = $bindable(null), children, ...restProps } = $props();
</script>

<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...restProps}>
	{@render children?.()}
	{#if children == null}
		<XIcon />
		<span class="sr-only">Close</span>
	{/if}
</DialogPrimitive.Close>
