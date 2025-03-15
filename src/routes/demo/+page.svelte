<script>
	import { onMount } from "svelte";
	import { CornerLeftUp, CornerRightDown, CornerRightUp, Joystick, Play } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";

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

<main class="relative flex h-[calc(100vh-85px)] w-full flex-col items-center justify-center">
	<div class="z-10 flex flex-col items-center justify-center">
		<h1 class="text-5xl font-bold uppercase lg:text-8xl">[Your Game]</h1>
		<div class="relative mt-20 flex flex-col gap-4 text-center">
			<Button class="pointer-events-none w-60 cursor-not-allowed bg-transparent text-primary border border-primary border-dashed"><p class="font-medium flex items-center gap-2">Play <Play strokeWidth={2} size={16} /></p></Button>
			<Button
				class="w-60"
				variant="outline"
				onclick={() => {
					playlightSDK?.setDiscovery(true);
				}}
			>
				More Games <Joystick />
			</Button>
			<p class="absolute -bottom-10 left-4 flex gap-2">
				Custom button (optional) <CornerRightUp size={18} />
			</p>
		</div>
	</div>
	<video
		width="1280"
		height="720"
		class="absolute h-full w-full object-cover blur-3xl brightness-[30%]"
		playsinline
		webkit-playsinline
		autoplay
		muted
		loop
	>
		<source src="/videos/playlight_landingpage_video.mp4" type="video/mp4" />
		<track kind="captions" />
	</video>
	<p class="absolute top-5 flex gap-2"><CornerLeftUp size={18} /> Try leaving the page</p>
	<p class="fixed right-10 bottom-21 flex rotate-1 gap-2">
		Built-in button (optional) <CornerRightDown size={18} style="margin-top: 5px;" />
	</p>
</main>
