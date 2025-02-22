<script>
	import { onMount, onDestroy } from "svelte";
	import Chart from "chart.js/auto";
	let { chartOptions, series, type = "line" } = $props();

	let canvas = $state();
	let chartInstance = $state();

	// Dynamically import Chart.js on mount to avoid SSR issues
	onMount(async () => {
		// Construct the Chart.js data structure using your passed-in options and series
		const opts = chartOptions.value || {};
		const labels = opts?.xaxis?.categories || [];
		const data = {
			labels,
			datasets: series?.value?.map((dataset) => ({
				label: dataset.name,
				data: dataset.data,
				fill: false,
				borderColor: "rgba(75, 192, 192, 1)",
			})),
		};
		chartInstance = new Chart(canvas, {
			type,
			data,
			options: opts,
		});
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<canvas class="w-full h-full" bind:this={canvas}></canvas>
