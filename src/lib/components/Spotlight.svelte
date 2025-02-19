<script>
	import { spring } from "svelte/motion";

	// Spring-based position for smooth movement - reduced movement range
	const position = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.08, // Reduced stiffness for smoother movement
			damping: 0.9, // Increased damping for less oscillation
		},
	);

	// Clamp the movement to keep spotlight within bounds
	function handleMouseMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		// More constrained movement range (35-65% instead of 20-80%)
		position.set({
			x: Math.max(35, Math.min(65, x)),
			y: Math.max(35, Math.min(65, y)),
		});
	}

	// Return to center when mouse leaves
	function handleMouseLeave() {
		position.set({ x: 50, y: 50 });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="absolute inset-0" onmousemove={handleMouseMove} onmouseleave={handleMouseLeave}>
	<div
		class="bg-muted/10 absolute -z-1 h-96 w-96 rounded-full"
		style="left: {$position.x}%; top: {$position.y}%; transform: translate(-50%, -50%)"
	>
		<!-- Inner glow effect -->
		<!-- svelte-ignore element-invalid-self-closing-tag -->
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