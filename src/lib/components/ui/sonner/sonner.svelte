<script>
	import { Toaster as Sonner } from "svelte-sonner";
	import { mode } from "mode-watcher";

	let { ...restProps } = $props();
</script>

<Sonner theme={"dark"} class="toaster group [&>*]:rounded-none!" {...restProps} />
