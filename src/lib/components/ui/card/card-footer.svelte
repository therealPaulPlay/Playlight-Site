<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn("[.border-t]:pt-6 flex items-center px-6", className)}
	{...restProps}
>
	{@render children?.()}
</div>