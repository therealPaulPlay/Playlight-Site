<script>
	import { onMount, onDestroy } from "svelte";
	import Chart from "chart.js/auto";

	let { chartOptions, series, type = "line" } = $props();
	let canvas;
	let chartInstance;

	function setupChart() {
		if (!canvas) return;

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
						grid: {
							color: "rgba(0, 0, 0, 0.1)",
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
		if (series && chartOptions) {
			setupChart();
		}
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<div class="h-[400px] w-full">
	<canvas bind:this={canvas}></canvas>
</div>
