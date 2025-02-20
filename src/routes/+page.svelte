<script>
	import InviteCta from "$lib/components/InviteCta.svelte";
	import Spotlight from "$lib/components/Spotlight.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { CircleCheck, CircleX, Search } from "lucide-svelte";
	import { blur, fly } from "svelte/transition";
</script>

<svelte:head>
	<title>Playlight - A discovery network, built into your game</title>
</svelte:head>

<main class="flex min-h-screen w-full flex-col">
	<!-- Hero -->
	<section class="relative flex min-h-120 w-full items-center overflow-hidden px-6 py-12 text-center">
		<Spotlight />
		<div class="pointer-events-none z-1 mx-auto max-w-2xl">
			<h1 class="mb-4 text-4xl font-extrabold uppercase md:text-5xl" in:blur>Get your game seen.</h1>
			<p class="text-muted-foreground mb-8 text-lg" in:blur>A discovery platform, built right into your own site.</p>
			<Button class="pointer-events-auto mb-4 px-6 py-3 font-semibold" href="/join">Join Playlight</Button>
		</div>
	</section>

	<section class="w-full px-4 py-16">
		<div class="mx-auto flex max-w-7xl flex-wrap gap-8">
			<!-- Left Box -->
			<div class="flex flex-1 flex-wrap gap-8">
				<!-- Centralized Platform Side -->
				<div class="bg-card relative min-w-42 flex-1 rounded-lg p-6">
					<div class="absolute top-6 right-6">
						<CircleX />
					</div>
					<h3 class="mb-4 text-lg font-semibold">Centralized</h3>
					<div class="relative mt-8 flex h-50 items-center justify-center">
						<!-- Platform Mockup 1 -->
						<div
							class="bg-background absolute w-full max-w-[280px] translate-x-2 translate-y-3 -rotate-3 rounded-lg p-4 shadow-md"
						>
							<div class="text-muted-foreground absolute top-2 right-2 max-w-2/3 truncate text-sm font-bold">
								SuperGames.com
							</div>
							<div class="mt-4 grid grid-cols-4 gap-2">
								{#each Array(8) as _}
									<div class="bg-muted aspect-square rounded"></div>
								{/each}
							</div>
						</div>

						<!-- Platform Mockup 2 -->
						<div
							class="bg-background absolute w-full max-w-[280px] -translate-x-2 -translate-y-3 rotate-3 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105"
						>
							<div class="text-muted-foreground absolute top-2 right-2 max-w-2/3 truncate text-sm font-bold">
								MonsterPlay.com
							</div>
							<div class="mt-4 grid grid-cols-4 gap-2">
								{#each Array(8) as _}
									<div class="bg-muted-foreground aspect-square rounded"></div>
								{/each}
							</div>
						</div>
					</div>
				</div>
				<!-- Decentralized Side -->
				<div class="bg-card relative min-w-42 flex-1 rounded-lg border border-white p-6">
					<div class="absolute top-6 right-6">
						<CircleCheck />
					</div>
					<h3 class="mb-4 text-lg font-semibold">Decentralized</h3>
					<svg class="h-4/5 w-full" viewBox="0 0 210 210">
						<circle cx="105" cy="105" r="105"></circle>
						<!-- Circular connection paths -->
						<g stroke="hsl(24 5.4% 63.9% / 1)">
							<!-- Center to outer connections -->
							<line x1="105" y1="105" x2="105" y2="45" stroke-width="3"></line>
							<line x1="105" y1="105" x2="159" y2="75" stroke-width="3"></line>
							<line x1="105" y1="105" x2="159" y2="135" stroke-width="3"></line>
							<line x1="105" y1="105" x2="51" y2="135" stroke-width="3"></line>
							<line x1="105" y1="105" x2="51" y2="75" stroke-width="3"></line>
							<line x1="105" y1="105" x2="105" y2="165" stroke-width="3"></line>
						</g>

						<!-- Games/Apps with solid background -->
						<g>
							<rect x="85" y="30" width="40" height="40" rx="5" fill="hsl(12 6.5% 15.1% / 1)"></rect>
						</g>
						<g>
							<rect x="85" y="25" width="40" height="40" rx="5" fill="hsl(24 5.4% 63.9% / 1)"></rect>
						</g>
						<g>
							<rect x="139" y="60" width="40" height="40" rx="5" fill="hsl(12 6.5% 15.1% / 1)"></rect>
						</g>
						<g>
							<rect x="139" y="55" width="40" height="40" rx="5" fill="hsl(24 5.4% 63.9% / 1)"></rect>
						</g>
						<g>
							<rect x="139" y="120" width="40" height="40" rx="5" fill="hsl(12 6.5% 15.1% / 1)"></rect>
						</g>
						<g>
							<rect x="139" y="115" width="40" height="40" rx="5" fill="hsl(24 5.4% 63.9% / 1)"></rect>
						</g>
						<g>
							<rect x="31" y="120" width="40" height="40" rx="5" fill="hsl(12 6.5% 15.1% / 1)"></rect>
						</g>
						<g>
							<rect x="31" y="115" width="40" height="40" rx="5" fill="hsl(24 5.4% 63.9% / 1)"></rect>
						</g>
						<g>
							<rect x="31" y="60" width="40" height="40" rx="5" fill="hsl(12 6.5% 15.1% / 1)"></rect>
						</g>
						<g>
							<rect x="31" y="55" width="40" height="40" rx="5" fill="hsl(24 5.4% 63.9% / 1)"></rect>
						</g>
						<g>
							<rect x="85" y="150" width="40" height="40" rx="5" fill="hsl(12 6.5% 15.1% / 1)"></rect>
						</g>
						<g>
							<rect x="85" y="145" width="40" height="40" rx="5" fill="hsl(24 5.4% 63.9% / 1)"></rect>
						</g>
					</svg>
				</div>
			</div>

			<!-- Right Box -->
			<div class="bg-card min-w-[320px] flex-1 rounded-lg p-8 shadow-lg">
				<h2 class="mb-6 text-3xl font-bold">Indie Devs, unite.</h2>
				<p class="text-muted-foreground mb-4 text-lg">
					Build your audience directly through interconnected games. Playlight is a network that <span
						class="text-foreground">grows your games organically</span
					>, keeping you in control while
					<span class="text-foreground">fostering a community</span> of passionate players and developers.
				</p>
				<p class="text-muted-foreground text-lg">
					You decide where you highlight exciting indie titles that your players will love, and a smart algorithm
					promotes your experience across sites.
				</p>
			</div>
		</div>
	</section>

	<section class="w-full px-4 py-16">
		<div class="mx-auto flex max-w-7xl flex-wrap gap-8">
			<!-- Left Box: Browser Mockup -->
			<div class="bg-card min-w-[320px] flex-1 rounded-lg p-6 shadow-lg">
				<!-- Browser Chrome -->
				<div class="relative -rotate-3 transform">
					<div class="bg-muted rounded-t-lg p-2">
						<!-- Address Bar -->
						<div class="bg-background flex items-center gap-2 rounded px-3 py-2">
							<Search class="text-muted-foreground h-4 w-4" />
							<span class="text-muted-foreground text-sm">yourgame.com</span>
						</div>
					</div>

					<!-- Browser Content -->
					<div class="bg-background min-h-70 rounded-b-lg p-6">
						<!-- Game Options -->
						<div class="relative grid grid-cols-3 gap-6 text-center">
							<!-- Game 1 -->
							<div
								class="bg-card hover:bg-muted/50 flex aspect-[2/3] items-center justify-center rounded-lg p-4 transition-colors"
							>
								<span class="text-lg font-medium">Game 1</span>
							</div>

							<!-- Game 2 -->
							<div
								class="bg-card hover:bg-muted/50 flex aspect-[2/3] items-center justify-center rounded-lg p-4 transition-colors"
							>
								<span class="text-lg font-medium">Game 2</span>
							</div>

							<!-- Game 3 (Highlighted) -->
							<div
								class="bg-card border-primary hover:bg-muted/50 relative flex aspect-[2/3] items-center justify-center rounded-lg border-2 p-4 transition-colors"
							>
								<span class="text-primary text-lg font-medium">Game 3</span>
								<div
									class="shine pointer-events-none absolute absolute inset-0 top-0 left-0 h-full w-full bg-linear-[120deg,rgba(255,255,255,0.25),transparent_90%]"
								></div>
							</div>
						</div>
					</div>

					<!-- Cursor -->
					<div class="pointer-events-none absolute top-8 left-24">
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4,4 L20,12 L12,14 L10,22 L4,4" fill="black" stroke="white"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Right Box: Text Content -->
			<div class="bg-card min-w-[320px] flex-1 rounded-lg p-8 shadow-lg">
				<h2 class="mb-6 text-3xl font-bold">Smart Recommendations.</h2>
				<p class="text-muted-foreground text-lg leading-relaxed">
					Keep players engaged with intelligent game suggestions. The <span class="text-foreground">algorithm</span>
					identifies <span class="text-foreground">key moments</span> when players are most receptive to new
					experiences, like when they're <span class="text-foreground">about to leave</span>, and presents them with
					<span class="text-foreground">carefully curated options</span> that match their interests and playing style.
				</p>
			</div>
		</div>
	</section>

	<!-- Feature section -->
	<section class="container mx-auto px-6 py-10"></section>

	<!-- Final CTA banner -->
	<InviteCta />
</main>

<style>
	g {
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 0.3s ease-in-out;
	}

	g:hover {
		transform: scale(1.1);
	}
</style>
