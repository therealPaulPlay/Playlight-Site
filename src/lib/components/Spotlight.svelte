<script>
	import { spring } from "svelte/motion";

	// Spring-based position for smooth movement
	const position = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.1,
			damping: 0.8,
		},
	);

	// Clamp the movement to keep spotlight within bounds
	function handleMouseMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		// Clamp values between 20% and 80% of container
		position.set({
			x: Math.max(20, Math.min(80, x)),
			y: Math.max(20, Math.min(80, y)),
		});
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="absolute inset-0" onmousemove={handleMouseMove}>
	<div
		class="bg-muted/10 absolute h-96 w-96 rounded-full -z-1"
		style="left: {$position.x}%; top: {$position.y}%; transform: translate(-50%, -50%)"
	>
		<!-- Inner glow effect -->
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<div class="bg-gradient-radial from-muted/20 absolute inset-0 rounded-full to-transparent" />
	</div>
</div>

<style>
	/* Custom radial gradient for spotlight effect */
	.bg-gradient-radial {
		background: radial-gradient(circle, var(--from-color) 0%, var(--to-color) 70%);
		--from-color: hsl(var(--muted) / 0.2);
		--to-color: transparent;
	}
</style>
