<script>
	import { Toaster as Sonner } from "svelte-sonner";

	let restProps = $props();
</script>

<Sonner
	class="toaster group"
	toastOptions={{
		classes: {
			toast:
				"group toast group-[.toaster]:bg-background h-auto w-full p-4 rounded-md border group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
		},
	}}
	{...restProps}
/>