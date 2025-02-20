<script>
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import Footer from "$lib/components/Footer.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	let { children } = $props();
</script>

<!-- Nav bar -->
<nav class="flex w-full items-center justify-between bg-black px-6 py-4">
	<a href="/">
		<img src="/images/logo_white_small.png" alt="logo" class="w-42 md:w-64 select-none" />
	</a>
	<div class="flex justify-evenly gap-5 md:mr-5 items-center text-nowrap mt-2">
		<a href="/signup" class="hover:underline"> Log in </a>
		<Button href="/join">Join</Button>
	</div>
</nav>

{@render children()}

<Toaster />
<Footer />