<script>
	import { onMount } from "svelte";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { toast } from "svelte-sonner";

	let testimonials = $state([]);
	let loading = $state(true);
	let marqueeContainer;
	let marqueeContent = $state(null);
	let isHovered = $state(false);
	let animationDistance = $state(0);

	onMount(async () => {
		await fetchTestimonials();
		calculateMarqueeDistance();
	});

	function calculateMarqueeDistance() {
		if (!marqueeContent) return;

		// Get the width of marquee content (half of the full content since we duplicate it)
		const itemsWidth = marqueeContent.scrollWidth / 2;
		animationDistance = itemsWidth;
		document.documentElement.style.setProperty("--marquee-distance", `-${itemsWidth}px`); // Set the CSS variable for the animation
	}

	async function fetchTestimonials() {
		try {
			loading = true;
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/platform/suggestions`);
			const data = await response.json();
			testimonials = data?.games?.slice(0, 10) || [];
		} catch (error) {
			toast.error("Failed to load testimonials: " + error);
		} finally {
			loading = false;
		}
	}
</script>

<section
	bind:this={marqueeContainer}
	role="banner"
	class="bg-background/50 relative mx-auto w-full max-w-7xl overflow-hidden px-4"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<div class="border-muted border-y py-8">
		<!-- Masks for fading edges -->
		<div
			class="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r to-transparent"
		></div>
		<div
			class="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l to-transparent"
		></div>

		{#if loading}
			<div class="flex min-h-16 items-center space-x-16 py-4">
				{#each Array(10) as _}
					<div class="flex animate-pulse items-center space-x-3">
						<div class="bg-muted h-10 w-10"></div>
						<div class="bg-muted h-5 w-32"></div>
					</div>
				{/each}
			</div>
		{:else}
			<div bind:this={marqueeContent} class="marquee-content flex py-4 whitespace-nowrap {isHovered ? 'paused' : ''}">
				{#each [...testimonials, ...testimonials] as game, i}
					<div class="group mx-8 inline-flex items-center">
						<div class="bg-card mr-3 h-10 w-10 flex-shrink-0 overflow-hidden">
							{#if game.logo_url}
								<img src={game.logo_url} alt="{game.name} logo" class="h-full w-full object-contain p-1" />
							{/if}
						</div>
						<a
							href={`https://${game.domain}`}
							target="_blank"
							rel="noopener"
							class="text-lg font-medium hover:underline">{game.name}</a
						>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes marqueeScroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(var(--marquee-distance, 2000px));
		}
	}

	.marquee-content {
		animation: marqueeScroll 90s linear infinite;
		display: inline-flex;
	}

	.marquee-content.paused {
		animation-play-state: paused;
	}
</style>
