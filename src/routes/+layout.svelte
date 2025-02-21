<script>
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import Footer from "$lib/components/Footer.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	let { children } = $props();
</script>

<!-- Nav bar -->
<nav class="sticky top-0 z-90 w-full">
	<div class="flex items-center justify-between px-6 py-4 w-full">
		<a href="/">
			<img src="/images/logo_white_small.png" alt="logo" class="w-42 select-none md:w-56" />
		</a>
		<div class="mt-2 flex items-center justify-evenly gap-5 text-nowrap md:mr-5">
			<a href="/signup" class="hover:underline"> Log in </a>
			<Button href="/join">Join</Button>
		</div>
	</div>
	<div class="custom-blur-mask absolute -z-1 h-full w-full top-0"></div>
	<div class="custom-color-mask bg-background absolute -z-1 h-full w-full top-0"></div>
</nav>

{@render children()}

<Toaster />
<Footer />

<style>
	.custom-blur-mask {
		mask: linear-gradient(to bottom, black, rgba(0, 0, 0, 0.75) 70%, transparent);
		backdrop-filter: blur(5px);
	}
	.custom-color-mask {
		mask: linear-gradient(to bottom, black, rgba(0, 0, 0, 0.75) 30%, rgba(0, 0, 0, 0.5) 70%, transparent);
	}
</style>
