<script>
	import InviteCta from "$lib/components/InviteCta.svelte";
	import Spotlight from "$lib/components/Spotlight.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { ArrowRight, CircleCheck, CircleX, Search } from "lucide-svelte";
	import { onMount } from "svelte";
	import { blur, fly } from "svelte/transition";
	import gsap from "gsap";
	import TextPlugin from "gsap/TextPlugin";

	const genres = ["trivia", "roleplay", "mmo", "strategy", "racing", "puzzle"];

	let searchText = $state();
	let textElement = $state();

	onMount(() => {
		searchText = genres[0];
		gsap.registerPlugin(TextPlugin);

		// Create timeline for smooth text transitions
		const tl = gsap.timeline({ repeat: -1 });

		genres.forEach((genre, index) => {
			const nextGenre = genres[(index + 1) % genres.length];

			tl.to(textElement, {
				duration: 0.4,
				ease: "power2.inOut",
			})
				.to(textElement, {
					duration: 0.4,
					text: {
						value: nextGenre,
						delimiter: "",
					},
					ease: "power2.inOut",
				})
				.to({}, { duration: 1.5 }); // Pause between transitions
		});
	});

	let statsSection;
	let hasAnimated = false;

	const stats = [
		{ value: 1000000, label: "Monthly Players", prefix: "", suffix: "+" },
		{ value: 10, label: "Avg. Playtime / Game", prefix: ">", suffix: " min" },
		{ value: 90, label: "Player Satisfaction", prefix: ">", suffix: "%" },
	];

	function animateValue(obj, start, end, duration) {
		gsap.to(
			{
				value: start,
			},
			{
				value: end,
				duration: duration,
				ease: "power1.out",
				onUpdate: function () {
					const value = Math.round(this.targets()[0].value);
					obj.textContent = `${obj.dataset.prefix || ""}${value.toLocaleString()}${obj.dataset.suffix || ""}`;
				},
			},
		);
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;

						// Animate each stat
						entry.target.querySelectorAll(".stat-value").forEach((stat) => {
							const endValue = parseInt(stat.dataset.value);
							const startValue = 0;
							animateValue(stat, startValue, endValue, 1.2);
						});

						// Fade in animation
						gsap.from(".stat-item", {
							opacity: 0,
							y: 20,
							duration: 0.4,
							stagger: 0.1,
							ease: "power2.out",
						});
					}
				});
			},
			{ threshold: 0.2 },
		);

		observer.observe(statsSection);
	});

	// Load the SDK for demo
	let playlightSDK;

	onMount(async () => {
		try {
			const module = await import("https://sdk.playlight.dev/playlight-sdk.es.js");
			playlightSDK = module.default;
			await playlightSDK.init({
				button: {
					visible: false,
				},
				exitIntent: {
					enabled: false,
				},
			});
		} catch (error) {
			console.error("Error loading the Playlight SDK:", error);
		}
	});
</script>

<svelte:head>
	<title>Playlight - A discovery platform, built into your game</title>
	<link
		rel="stylesheet"
		href="https://sdk.playlight.dev/playlight-sdk.css"
		media="print"
		onload={(e) => (e.target.media = "all")}
	/>
</svelte:head>

<main class="flex min-h-screen w-full flex-col">
	<!-- Hero -->
	<section class="relative flex min-h-120 w-full items-center overflow-hidden px-6 py-12 text-center">
		<Spotlight />
		<div class="pointer-events-none z-1 mx-auto max-w-2xl">
			<h1 class="mb-4 text-4xl font-extrabold uppercase md:text-5xl" in:blur>Get your game seen.</h1>
			<p class="text-muted-foreground mb-8 text-lg" in:blur>A discovery platform, built right into your own game.</p>
			<div class="align-center mx-auto flex max-w-40 flex-col justify-center">
				<Button class="pointer-events-auto mb-4 px-6 py-3 font-semibold" href="/join">Join Playlight</Button>
				<Button
					class="pointer-events-auto mb-4 px-6 py-3 font-semibold"
					variant="outline"
					onclick={() => {
						playlightSDK?.setDiscovery(true);
					}}>Launch Demo</Button
				>
			</div>
		</div>
	</section>

	<section class="mx-auto flex w-full max-w-7xl flex-wrap gap-8 px-4 py-16">
		<!-- Left Box -->
		<div class="flex flex-4 flex-wrap gap-8">
			<!-- Centralized Platform Side -->
			<div class="bg-card relative min-w-42 flex-1 p-6">
				<div class="absolute top-6 right-6">
					<CircleX />
				</div>
				<h3 class="mb-4 max-w-3/4 truncate text-lg font-semibold">Centralized</h3>
				<div class="relative mx-auto mt-8 flex h-50 items-center justify-center max-md:max-w-54">
					<!-- Platform Mockup 1 -->
					<div
						class="bg-background/90 absolute w-full max-w-[280px] translate-x-1.5 translate-y-2 -rotate-3 p-4 shadow-md"
					>
						<div class="text-muted absolute top-2 right-2 max-w-2/3 truncate text-sm font-bold">SuperGames.com</div>
						<div class="mt-4 grid grid-cols-4 gap-2">
							{#each Array(8) as _}
								<div class="bg-muted aspect-square rounded"></div>
							{/each}
						</div>
					</div>

					<!-- Platform Mockup 2 -->
					<div
						class="bg-background absolute w-full max-w-[280px] -translate-x-1 -translate-y-3 p-4 shadow-md transition-transform duration-300 hover:scale-105"
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
			<div
				class="bg-card relative min-w-42 flex-1 border border-white bg-linear-[240deg,rgba(255,255,255,0.15),transparent_40%] p-6"
			>
				<div class="absolute top-6 right-6">
					<CircleCheck />
				</div>
				<h3 class="mb-4 max-w-3/4 truncate text-lg font-semibold">Decentralized</h3>
				<svg class="mx-auto h-4/5 w-full max-md:max-w-52" viewBox="0 0 210 210">
					<circle cx="105" cy="105" r="105" filter="url(#shadow)"></circle>
					<filter id="shadow" filterUnits="userSpaceOnUse" x="-20" y="-20" width="250" height="250">
						<feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="black" flood-opacity="0.5" />
					</filter>
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
						<rect x="85" y="30" width="40" height="40" rx="4" fill="hsl(12 6.5% 15.1% / 1)"></rect>
					</g>
					<g>
						<rect x="85" y="25" width="40" height="40" rx="4" fill="hsl(24 5.4% 63.9% / 1)"></rect>
					</g>
					<g>
						<rect x="139" y="60" width="40" height="40" rx="4" fill="hsl(12 6.5% 15.1% / 1)"></rect>
					</g>
					<g>
						<rect x="139" y="55" width="40" height="40" rx="4" fill="hsl(24 5.4% 63.9% / 1)"></rect>
					</g>
					<g>
						<rect x="139" y="120" width="40" height="40" rx="4" fill="hsl(12 6.5% 15.1% / 1)"></rect>
					</g>
					<g>
						<rect x="139" y="115" width="40" height="40" rx="4" fill="hsl(24 5.4% 63.9% / 1)"></rect>
					</g>
					<g>
						<rect x="31" y="120" width="40" height="40" rx="4" fill="hsl(12 6.5% 15.1% / 1)"></rect>
					</g>
					<g>
						<rect x="31" y="115" width="40" height="40" rx="4" fill="hsl(24 5.4% 63.9% / 1)"></rect>
					</g>
					<g>
						<rect x="31" y="60" width="40" height="40" rx="4" fill="hsl(12 6.5% 15.1% / 1)"></rect>
					</g>
					<g>
						<rect x="31" y="55" width="40" height="40" rx="4" fill="hsl(24 5.4% 63.9% / 1)"></rect>
					</g>
					<g>
						<rect x="85" y="150" width="40" height="40" rx="4" fill="hsl(12 6.5% 15.1% / 1)"></rect>
					</g>
					<g>
						<rect x="85" y="145" width="40" height="40" rx="4" fill="hsl(24 5.4% 63.9% / 1)"></rect>
					</g>
				</svg>
			</div>
		</div>

		<!-- Right Box -->
		<div class="bg-card min-w-70 flex-3 p-8">
			<h2 class="mb-6 text-3xl font-bold">Indie Devs, unite.</h2>
			<p class="text-muted-foreground mb-4 text-lg">
				Playlight is an <span class="text-foreground">integrable discovery network</span> that grows your browser games
				organically, keeping you in control while
				<span class="text-foreground">fostering a community of passionate players</span> and developers.
			</p>
			<p class="text-muted-foreground text-lg">
				You decide where you highlight exciting indie titles that your players will love, and a smart <span
					class="text-foreground">open-source</span
				>
				algorithm <span class="text-foreground">promotes your experiences</span> across sites.
			</p>
		</div>
	</section>

	<section class="mx-auto flex w-full max-w-7xl flex-wrap gap-8 px-4 py-16">
		<!-- Left Box: Browser Mockup -->
		<div class="bg-card min-w-[320px] flex-1 p-6 shadow-lg">
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
				<div class="bg-background rounded-b-lg p-6 md:min-h-70">
					<!-- Game Options -->
					<div class="relative grid grid-cols-3 gap-6 text-center">
						<!-- Game 1 -->
						<div class="bg-card hover:bg-muted/50 flex aspect-[2/3] items-center justify-center p-4 transition-colors">
							<span class="text-lg font-medium">Game 1</span>
						</div>

						<!-- Game 2 -->
						<div class="bg-card hover:bg-muted/50 flex aspect-[2/3] items-center justify-center p-4 transition-colors">
							<span class="text-lg font-medium">Game 2</span>
						</div>

						<!-- Game 3 (Highlighted) -->
						<div
							class="bg-card border-primary hover:bg-muted/50 relative flex aspect-[2/3] items-center justify-center border-2 p-4 transition-colors"
						>
							<span class="text-primary text-lg font-medium">Game 3</span>
							<div
								class="shine pointer-events-none absolute absolute inset-0 top-0 left-0 h-full w-full bg-linear-[120deg,rgba(255,255,255,0.25),transparent_90%]"
							></div>
						</div>
					</div>
				</div>

				<!-- Cursor -->
				<div class="cursor-hover-animation pointer-events-none absolute top-8 left-24">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4,4 L20,12 L12,14 L10,22 L4,4" fill="black" stroke="white"></path>
					</svg>
				</div>
			</div>
		</div>

		<!-- Right Box: Text Content -->
		<div class="bg-card min-w-[320px] flex-1 p-8">
			<h2 class="mb-6 text-3xl font-bold">Smart recommendations.</h2>
			<p class="text-muted-foreground text-lg leading-relaxed mb-4">
				Keep players engaged with thoughtful game recommendations. The <span class="text-foreground">Discovery</span>
				only activates at <span class="text-foreground">intentional moments</span> - when players are
				<span class="text-foreground">exiting your game</span> or through a
				<span class="text-foreground">discovery button you control</span>.
			</p>
			<p class="text-muted-foreground text-lg leading-relaxed">
				No random popups, just
				<span class="text-foreground">personalized suggestions</span> that respect your game's experience and bring joy to
				players.
			</p>
		</div>
	</section>

	<section class="mx-auto flex w-full max-w-7xl flex-wrap gap-8 px-4 py-16">
		<!-- Left Box: Search Results Mockup -->
		<div class="bg-card min-w-[320px] flex-1 p-6 shadow-lg">
			<!-- Search Bar -->
			<div class="bg-background mb-6 flex items-center gap-2 rounded px-4 py-3">
				<Search class="text-muted-foreground h-5 w-5" />
				<span class="text-muted-foreground overflow-hidden text-sm">
					best <span bind:this={textElement}>{searchText}</span> browser game
				</span>
			</div>

			<!-- Search Results -->
			<div class="space-y-4">
				<!-- Result 1: Your Game -->
				<div
					class="bg-card hover:bg-muted/50 rounded bg-linear-[120deg,rgba(255,255,255,0.15),transparent_90%] p-4 transition-colors"
				>
					<h3 class="text-primary mb-1 text-lg font-semibold">Your Game - Play now</h3>
					<div class="text-muted-foreground text-sm">yourgame.com</div>
					<p class="text-muted-foreground mt-1 text-sm">Play your game online - Easily findable in search...</p>
				</div>

				<!-- Result 2: Skeleton -->
				<div class="bg-card rounded p-4">
					<div class="bg-muted-foreground/20 mb-2 h-4 w-2/5 rounded"></div>
					<div class="bg-muted-foreground/20 mb-2 h-3 w-1/4 rounded"></div>
					<div class="bg-muted-foreground/20 h-3 w-2/3 rounded"></div>
				</div>
			</div>
		</div>

		<!-- Right Box: Text Content -->
		<div class="bg-card min-w-[320px] flex-1 p-8">
			<h2 class="mb-6 text-3xl font-bold">Boost your SEO, naturally.</h2>
			<p class="text-muted-foreground text-lg leading-relaxed">
				Playlight creates a <span class="text-foreground">natural network of backlinks</span> through game suggestions.
				As players discover new games through participating games, they build
				<span class="text-foreground">authentic user funnels</span> that search engines love.
			</p>
		</div>
	</section>
	<section class="mx-auto flex w-full max-w-7xl flex-wrap gap-8 px-4 py-16">
		<!-- Left Box: Overlapping Documents -->
		<div class="bg-card min-w-[320px] flex-1 p-6">
			<div class="relative mx-auto h-60 max-w-9/10">
				<!-- Code Document -->
				<div
					class="bg-background/75 absolute top-4 left-4 w-full max-w-[320px] -rotate-3 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
				>
					<div class="mb-4 flex items-center justify-between">
						<div class="flex gap-2">
							<div class="h-3 w-3 rounded-full bg-red-500"></div>
							<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
							<div class="h-3 w-3 rounded-full bg-green-500"></div>
						</div>
						<span class="text-muted-foreground text-sm">index.html</span>
					</div>
					<pre class="text-muted-foreground max-w-3/4 truncate text-sm text-wrap"><code class="language-html">
{"<!-- Add Playlight -->"}
{'<script src="https://cdn.com"><\/script>'}
{"<!-- And done! -->"}
                    </code></pre>
				</div>

				<!-- Contract Document (crossed out) -->
				<div
					class="bg-background absolute top-8 right-4 w-full max-w-[320px] rotate-3 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
				>
					<div class="mb-4 flex justify-between">
						<span class="text-xl font-bold">CONTRACT</span>
						<div class="text-destructive text-sm font-bold">VOID</div>
					</div>
					<div class="relative">
						<!-- Fake contract text -->
						<div class="space-y-2">
							{#each Array(6) as _}
								<div class="bg-muted h-2 w-full rounded"></div>
							{/each}
						</div>
						<!-- Red X overlay -->
						<div class="absolute inset-0 flex items-center justify-center">
							<svg
								class="text-destructive h-40 w-40 opacity-50"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M18 6L6 18"></path>
								<path d="M6 6L18 18"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Box: Text Content -->
		<div class="bg-card min-w-[320px] flex-1 p-8">
			<h2 class="mb-6 text-3xl font-bold">Start in seconds.</h2>
			<p class="text-muted-foreground text-lg leading-relaxed">
				No complicated setup, no lengthy contracts - just pure simplicity. There are no lock-in terms -
				<span class="text-foreground">your success is what keeps us together</span>, not legal bindings.
			</p>
			<p class="text-muted-foreground mt-4 text-lg leading-relaxed">
				We believe in <span class="text-foreground">freedom and flexibility</span>. That is why all parts of Playlight
				are <span class="text-foreground">open source</span>.
			</p>
			<a class="text-foreground mt-4 flex w-fit items-center gap-1 text-lg hover:underline" href="/docs"
				>Read the docs <ArrowRight size={20} style="margin-top: 1px;" /></a
			>
		</div>
	</section>

	<!-- Stats (Statistical Proof)-->
	<section bind:this={statsSection} class="border-muted! mt-16 w-full border-y">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-8 px-4 py-8">
			{#each stats as stat}
				<div class="stat-item min-w-50 text-center">
					<div
						class="stat-value mb-2 text-4xl font-bold"
						data-value={stat.value}
						data-prefix={stat.prefix}
						data-suffix={stat.suffix}
					>
						{stat.prefix}{0}{stat.suffix}
					</div>
					<div class="text-muted-foreground text-sm tracking-wider uppercase">
						{stat.label}
					</div>
				</div>
			{/each}
		</div>
	</section>

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

	@keyframes hover {
		0% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(3px, -3px);
		}
		50% {
			transform: translate(0, 5px);
		}
		75% {
			transform: translate(-3px, 0);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	.cursor-hover-animation {
		animation: hover 4s ease-in-out infinite;
	}
</style>
