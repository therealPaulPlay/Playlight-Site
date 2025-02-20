<script>
	import InviteCta from "$lib/components/InviteCta.svelte";
	import Spotlight from "$lib/components/Spotlight.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { blur, fly } from "svelte/transition";
</script>

<svelte:head>
	<title>Playlight - A discovery network, built into your game</title>
</svelte:head>

<main class="flex min-h-screen w-full flex-col">
	<!-- Hero -->
	<section class="relative flex min-h-96 w-full items-center overflow-hidden px-6 py-12 text-center">
		<Spotlight />
		<div class="mx-auto max-w-2xl z-1 pointer-events-none">
			<h1 class="mb-4 text-4xl font-extrabold md:text-5xl uppercase" in:blur={{ duration: 500 }}>Get your game seen.</h1>
			<p class="text-muted-foreground mb-8 text-lg" in:blur={{ duration: 700 }}>
				A discovery platform, built right into your own site.
			</p>
			<Button class="mb-4 px-6 py-3 font-semibold pointer-events-auto" href="/join">Join Playlight</Button>
		</div>
	</section>

	<!-- Feature section -->
	<section class="container mx-auto px-6 py-10"></section>

	<!-- Final CTA banner -->
	<InviteCta />
</main>
