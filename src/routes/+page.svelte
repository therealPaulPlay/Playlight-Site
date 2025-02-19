<script>
	import Spotlight from "$lib/components/Spotlight.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { blur, fade, fly } from "svelte/transition";
</script>

<svelte:head>
	<title>Playlight - A discovery network, built into your game</title>
</svelte:head>

<main class="flex min-h-screen w-full flex-col">
	<!-- Hero -->
	<section class="relative flex min-h-96 w-full items-center overflow-hidden px-6 py-12 text-center">
		<Spotlight />
		<div class="mx-auto max-w-2xl">
			<h1 class="mb-4 text-4xl font-extrabold md:text-5xl" in:blur={{ duration: 500 }}>Get your game seen.</h1>
			<p class="text-muted-foreground mb-8 text-lg" in:blur={{ duration: 700 }}>
				A discovery network, built right into your own site.
			</p>
			<Button class="mb-4 px-6 py-3 font-semibold">Join Playlight</Button>
		</div>
	</section>

	<!-- Feature section -->
	<section class="container mx-auto px-6 py-10"></section>

	<!-- Final CTA banner -->
	<section class="w-full border-t border-neutral-700 px-6 py-12 text-center">
		<div class="mx-auto max-w-xl">
			<h2 class="mb-2 text-xl font-bold line-through opacity-50 md:text-2xl" in:blur={{ duration: 400 }}>
				Boost their platform, not your game.
			</h2>
			<h2 class="mb-4 text-2xl font-bold md:text-3xl" in:blur={{ duration: 400 }}>
				Grow independently with Playlight.
			</h2>
			<p class="text-muted-foreground mb-6" in:fade={{ duration: 500 }}>
				Draw your audience in with Playlight, and shine a spotlight on the best indie experiences—yours included.
			</p>
			<div in:fade={{ duration: 600 }}>
				<Button class="px-6 py-3 font-semibold">Join Playlight</Button>
			</div>
		</div>
	</section>
</main>
