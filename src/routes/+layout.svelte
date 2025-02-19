<script>
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import { ModeWatcher } from "mode-watcher";
	import Footer from "$lib/components/ui/sonner/footer.svelte";
	let { children } = $props();
</script>

{@render children()}

<Toaster />
<ModeWatcher />
<Footer />