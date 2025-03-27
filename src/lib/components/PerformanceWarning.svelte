<script>
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";
	import { TriangleAlert } from "lucide-svelte";

	let { statistics = {} } = $props();
	let gainImbalanceNote = $state(false);

	$effect(() => {
		// Calculate sums
		let totalPlayersGained = 0;
		let totalGamesReferred = 0;

		if (Array.isArray(statistics)) {
			statistics.forEach((stat) => {
				totalPlayersGained += stat.playersGained || 0;
				totalGamesReferred += stat.gamesReferred || 0;
			});
			gainImbalanceNote = totalPlayersGained > totalGamesReferred * 2 && totalPlayersGained > 500;
		}
	});
</script>

{#if gainImbalanceNote}
	<div class="mt-3 max-w-260 border border-yellow-500/20 bg-yellow-500/10 p-4" transition:slide>
		<h4 class="mb-1 inline-flex items-center gap-2 text-sm font-medium"><TriangleAlert size={14} />Important</h4>
		<p class="text-muted-foreground text-sm">
			This game currently gains significantly more players than it refers other games. To keep the platform fair and
			effective, please ensure that Playlight is easily accessible in this application. It's recommended to enable the
			exit intent, and to display a discovery button as well as a widget where suitable.
		</p>
	</div>
{/if}
