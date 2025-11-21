<script>
	import { onMount } from "svelte";
	import {
		ArrowRight,
		CornerLeftDown,
		CornerLeftUp,
		CornerRightDown,
		CornerRightUp,
		Joystick,
		Play,
	} from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { blur } from "svelte/transition";

	let scrollY = $state(0);
	let sidebarShown = $state(false);
</script>

<svelte:head>
	<title>Demo</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		scrollY = window.scrollY;
	}}
/>

<main class="mb-10 flex min-h-[calc(100vh-85px)] w-full flex-col items-center justify-center md:mt-30">
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
					window.playlightSDK?.setDiscovery(true);
				}}
			>
				More Games <Joystick />
			</Button>
			<p class="mx-auto flex gap-2">
				Custom button <CornerRightUp size={18} />
			</p>
		</div>
		<p class="mt-40 mr-auto mb-4 ml-8 flex gap-2 max-md:hidden">
			<CornerLeftDown size={18} style="margin-top: 5px;" />Responsive & adjustable widget (optional)
		</p>
		<div class="playlight-widget-carousel bg-background/50 h-[345px] p-4 max-md:hidden md:w-170"></div>
		{#if scrollY < 100}
			<div
				class="bg-background/50 fixed right-8 bottom-8 max-w-[calc(100%-4rem)] space-y-4 p-4 backdrop-blur-xl"
				transition:blur={{ duration: 150 }}
			>
				<p class="flex max-w-82 gap-2">
					A sidebar is shown to visitors coming from a Playlight game. <ArrowRight
						size={18}
						style="min-width: 20px; margin-top: 3px;"
					/>
				</p>
				<Button
					onclick={() => {
						if (!sidebarShown) window.playlightSDK?.setConfig({ sidebar: { forceVisible: true } });
						else window.playlightSDK?.setConfig();
						sidebarShown = !sidebarShown;
					}}>{!sidebarShown ? "Try it" : "Hide"}</Button
				>
			</div>
		{/if}
	</div>
	<video
		width="1280"
		height="720"
		class="absolute top-30 h-full w-full object-cover blur-3xl brightness-[25%]"
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
	<p class="fixed top-28 left-[50%] flex translate-x-[-50%] gap-2 max-md:hidden" class:opacity-50={sidebarShown} transition:blur={{ duration: 150 }}>
		<CornerLeftUp size={18} />
		{!sidebarShown ? "Try leaving the page" : "Disabled when sidebar is active"}
	</p>
{/if}
