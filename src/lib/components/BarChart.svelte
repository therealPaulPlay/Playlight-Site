<script>
	import { onMount, onDestroy } from "svelte";
	import Chart from "chart.js/auto";
	import { AlertCircle } from "lucide-svelte";

	let { data = [] } = $props();
	let canvas;
	let chartInstance;
	let hasData = $state(true);

	function setupChart() {
		if (!canvas) return;

		// Check if we have data to display
		hasData = data && Array.isArray(data) && data.length > 0;

		// If no data, don't create chart
		if (!hasData) {
			if (chartInstance) {
				chartInstance.destroy();
				chartInstance = null;
			}
			return;
		}

		// Destroy existing chart if it exists
		if (chartInstance) chartInstance.destroy();

		// Create chart configuration
		const config = {
			type: "bar",
			data: {
				labels: data.map((item) => item.format || "unknown"),
				datasets: [
					{
						label: "Count",
						data: data.map((item) => item.count),
						backgroundColor: "hsl(12 6.5% 52.7%)",
						borderWidth: 0,
					},
				],
			},
			options: {
				indexAxis: "y",
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false,
					},
				},
				scales: {
					x: {
						display: true,
						beginAtZero: true,
						min: 0,
						grid: {
							color: "hsl(12 6.5% 15.1%)",
						},
						ticks: {
							precision: 0,
						},
					},
					y: {
						display: true,
						grid: {
							color: "hsl(12 6.5% 15.1%)",
						}
					},
				},
				barPercentage: 0.6,
				categoryPercentage: 0.8,
			},
		};

		// Create new chart instance
		chartInstance = new Chart(canvas, config);
	}

	onMount(() => {
		setupChart();
	});

	// Watch for changes in data
	$effect(() => {
		if (data !== undefined) {
			setupChart();
		}
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<div class="relative h-[300px] w-full">
	<canvas bind:this={canvas} class={!hasData ? "hidden" : ""}></canvas>
	{#if !hasData}
		<div class="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center">
			<AlertCircle size={48} />
			<p class="mt-2 text-lg font-medium">No data available yet.</p>
		</div>
	{/if}
</div>
