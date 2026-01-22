<script>
	import { Dialog as DialogPrimitive } from "bits-ui";

	let { ref = $bindable(null), children, ...restProps } = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...restProps}>
	{@render children?.()}
</DialogPrimitive.Trigger>
