<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { onMount } from "svelte";
	import gsap from "gsap";

	let cardContainer;
	let isFlipped = false;

	function handleFlip() {
		isFlipped = !isFlipped;
		gsap.to(cardContainer, {
			duration: 0.5,
			rotationY: isFlipped ? 180 : 0,
			ease: "power2.inOut",
		});
	}
</script>

<!-- Final CTA banner -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<section
	class="my-10 h-120 w-full px-6 py-12 text-center sm:h-100"
	onmouseenter={handleFlip}
	onmouseleave={handleFlip}
	onclick={(event) => {
		if (event.pointerType === "touch") {
			handleFlip();
		}
	}}
>
	<div class="perspective-1000 relative mx-auto h-full max-w-xl">
		<!-- Card container with fixed height and 3D transform -->
		<div bind:this={cardContainer} class="preserve-3d relative h-full">
			<!-- Front face -->
			<div
				class="border-muted! absolute h-full w-full rounded-lg border bg-linear-[310deg,hsl(20_14.3%_5%),transparent] p-8 backface-hidden"
			>
				<div class="h-full content-center text-center">
					<h2 class="mb-2 text-3xl font-bold uppercase">This is your invitation.</h2>
					<p class="text-muted-foreground">Hover to learn more.</p>
				</div>
				<!-- Decorative circles -->
				<div
					class="bg-background border-muted! absolute top-1/2 -left-2 h-4 w-4 -translate-y-1/2 rounded-full border"
				></div>
				<div class="bg-background border-muted! absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rounded-full border"></div>
			</div>

			<!-- Back face -->
			<div
				class="bg-background border-muted! absolute h-full w-full rotate-y-180 rounded-lg border p-8 backface-hidden"
			>
				<!-- Decorative circles -->
				<div
					class="bg-background border-muted! absolute top-1/2 -left-2 h-4 w-4 -translate-y-1/2 rounded-full border"
				></div>
				<div
					class="bg-background border-muted! absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rounded-full border"
				></div>

				<h2 class="mb-2 text-xl font-bold line-through opacity-50 md:text-2xl">Boost their platform, not your game.</h2>
				<h2 class="mb-4 text-2xl font-bold uppercase md:text-3xl">Grow independently.</h2>

				<div class="border-muted! my-6 border-t border-dashed"></div>

				<p class="text-muted-foreground mb-6">
					Draw your audience in with Playlight, and shine a light on the best indie experiences—yours included.
				</p>
				<div>
					<Button class="px-8 py-3 font-semibold" href="/join">Join Playlight</Button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	.preserve-3d {
		transform-style: preserve-3d;
	}

	.backface-hidden {
		backface-visibility: hidden;
	}

	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>
