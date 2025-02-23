<script>
	import { spring } from "svelte/motion";

	const position = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.08,
			damping: 0.9,
		},
	);

	function handleMouseMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		position.set({
			x: Math.max(35, Math.min(65, x)),
			y: Math.max(35, Math.min(65, y)),
		});
	}

	function handleMouseLeave() {
		position.set({ x: 50, y: 50 });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="absolute inset-0" onmousemove={handleMouseMove} onmouseleave={handleMouseLeave}>
	<div class="absolute inset-0 overflow-hidden">
		<!-- Darkened video base layer with edge fading -->
		<div class="video-container">
			<div class="fade-edges">
				<video
					width="1280"
					height="720"
					class="h-full w-full object-cover blur-xl brightness-[60%]"
					playsinline
					webkit-playsinline
					autoplay
					muted
					loop
				>
					<source src="/videos/playlight_landingpage_video.mp4" type="video/mp4" />
					<track kind="captions" />
				</video>
			</div>
		</div>

		<!-- Black overlay with spotlight cutout -->
		<div class="overlay" style="--spotlight-x: {$position.x}%; --spotlight-y: {$position.y}%;"></div>
	</div>
</div>

<style>
	.video-container {
		position: absolute;
		inset: 0;
		filter: contrast(1.1);
	}

	.fade-edges {
		position: relative;
		width: 100%;
		height: 100%;
		mask: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, black 10%, black 90%, rgba(0, 0, 0, 0.5) 100%);
	}

	.overlay {
		position: absolute;
		inset: 0;
		background-color: black;
		mask: radial-gradient(circle 20rem at var(--spotlight-x) var(--spotlight-y), transparent, black 75%);
	}

	.video-container {
		transform-style: preserve-3d;
		perspective: 1000px;
	}

	.video-container video {
		transform: scale(1.05);
		filter: brightness(0.5) blur(5px);
	}
</style>
