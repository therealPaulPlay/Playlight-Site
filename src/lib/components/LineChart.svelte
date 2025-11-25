<script>
	import { onMount, onDestroy } from "svelte";
	import Chart from "chart.js/auto";
	import { AlertCircle } from "lucide-svelte";
	let { chartOptions, series, type = "line" } = $props();
	
	let canvas;
	let chartInstance;
	let hasData = $state(true);
	
	function checkIfHasData() {
		// Check if series exists and has data
		return series && Array.isArray(series) && series.length > 0 && series.some((s) => s.data && s.data.length > 0);
	}

	function setupChart() {
		if (!canvas) return;
		// Check if we have data to display
		hasData = checkIfHasData();
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
		// Create datasets from series data
		const datasets = series?.map((dataset, index) => ({
			label: dataset.name,
			data: dataset.data,
			borderColor: index === 0 ? "rgb(75, 192, 192)" : "rgb(255, 99, 132)",
			tension: 0.1,
		}));
		// Create chart configuration
		const config = {
			type,
			data: {
				labels: chartOptions?.xaxis?.categories || [],
				datasets,
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: "bottom",
					},
				},
				scales: {
					x: {
						display: true,
					},
					y: {
						display: true,
						beginAtZero: true, // Make sure y-axis starts at zero
						min: 0, // Explicitly set minimum to zero
						grid: {
							color: "hsl(12 6.5% 15.1%)",
						},
					},
				},
			},
		};
		// Create new chart instance
		chartInstance = new Chart(canvas, config);
	}
	onMount(() => {
		setupChart();
	});

	// Watch for changes in props
	$effect(() => {
		if (series !== undefined || chartOptions !== undefined) setupChart();
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<div class="relative h-[400px] w-full">
	<canvas bind:this={canvas} class={!hasData ? "hidden" : ""}></canvas>
	{#if !hasData}
		<div class="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center">
			<AlertCircle size={48} />
			<p class="mt-2 text-lg font-medium">No data available yet.</p>
		</div>
	{/if}
</div>
