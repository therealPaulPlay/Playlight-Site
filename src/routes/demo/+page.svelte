<script>
	import { onMount } from "svelte";
	import { CornerLeftDown, CornerLeftUp, CornerRightDown, CornerRightUp, Joystick, Play } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { blur } from "svelte/transition";

	let scrollY = $state(0);

	// Load the SDK for demo
	let playlightSDK;

	onMount(async () => {
		try {
			const module = await import("https://sdk.playlight.dev/playlight-sdk.es.js");
			playlightSDK = module.default;
			await playlightSDK.init();
		} catch (error) {
			console.error("Error loading the Playlight SDK:", error);
		}
	});
</script>

<svelte:head>
	<title>Demo</title>
	<link
		rel="stylesheet"
		href="https://sdk.playlight.dev/playlight-sdk.css"
		media="print"
		onload={(e) => (e.target.media = "all")}
	/>
</svelte:head>

<svelte:window
	onscroll={() => {
		scrollY = window.scrollY;
	}}
/>

<main class="flex md:mt-30 mb-10 min-h-[calc(100vh-85px)] w-full flex-col items-center justify-center">
	<div class="z-10 flex flex-col items-center justify-center">
		<h1 class="text-5xl font-bold uppercase md:text-8xl">[Your Game]</h1>
		<div class="relative mt-20 flex flex-col gap-4 text-center">
			<Button
				class="text-primary border-primary/75 pointer-events-none w-60 cursor-not-allowed border border-dashed bg-transparent"
				><p class="flex items-center gap-2 font-medium">Play <Play strokeWidth={2} size={16} /></p></Button
			>
			<Button
				class="w-60"
				variant="outline"
				onclick={() => {
					playlightSDK?.setDiscovery(true);
				}}
			>
				More Games <Joystick />
			</Button>
			<p class="mx-auto flex gap-2">
				Custom button (optional) <CornerRightUp size={18} />
			</p>
		</div>
		<p class="mt-40 mr-auto mb-4 ml-8 flex gap-2 max-md:hidden">
			<CornerLeftDown size={18} style="margin-top: 5px;" />Responsive & adjustable widget (optional)
		</p>
		<div class="playlight-widget-carousel bg-background/50 h-[345px] p-2 max-md:hidden md:w-170"></div>
	</div>
	<video
		width="1280"
		height="720"
		class="absolute h-full top-30 w-full object-cover blur-3xl brightness-[25%]"
		playsinline
		webkit-playsinline
		autoplay
		muted
		loop
	>
		<source src="/videos/playlight_landingpage_video.mp4" type="video/mp4" />
		<track kind="captions" />
	</video>
</main>

{#if scrollY < 100}
	<p class="fixed top-25 left-[50%] flex translate-x-[-50%] gap-2" transition:blur={{ duration: 150 }}>
		<CornerLeftUp size={18} /> Try leaving the page
	</p>
{/if}
<p class="fixed right-10 bottom-20 z-10 flex gap-2">
	Built-in button (optional) <CornerRightDown size={18} style="margin-top: 5px;" />
</p>
