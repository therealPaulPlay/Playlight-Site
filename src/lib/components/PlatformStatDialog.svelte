<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { ChartBar, TrendingDown, TrendingUp } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import * as Card from "$lib/components/ui/card/index.js";

	let dialogOpen = $state(false);
	let statistics = $state([]);
	let loading = $state(false);

	async function fetchStatistics() {
		loading = true;
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/admin/total-statistics`);
			const data = await response.json();

			// Process data to calculate percentage changes
			statistics = data.map((month, index) => {
				const prevMonth = data[index + 1];

				// Calculate percentage changes if previous month exists
				let playlightChange = 0;
				let referralsChange = 0;

				if (prevMonth) {
					playlightChange =
						prevMonth.totalPlaylightOpens > 0
							? ((month.totalPlaylightOpens - prevMonth.totalPlaylightOpens) / prevMonth.totalPlaylightOpens) * 100
							: 0;

					referralsChange =
						prevMonth.totalReferrals > 0
							? ((month.totalReferrals - prevMonth.totalReferrals) / prevMonth.totalReferrals) * 100
							: 0;
				}

				// Format the month name for display
				const [year, monthNum] = month.yearMonth.split("-");
				const monthDate = new Date(year, parseInt(monthNum) - 1);
				const monthName = monthDate.toLocaleString("default", { month: "long" });

				return {
					...month,
					monthName,
					year,
					playlightChange,
					referralsChange,
				};
			});
		} catch (error) {
			console.error("Error loading statistics:", error);
			toast.error("Failed to load statistics: " + error);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (dialogOpen) fetchStatistics();
	});

	// Helper function to format numbers with commas
	function formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// Helper function to format percentage change
	function formatPercentage(percentage) {
		return percentage.toFixed(1);
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<span class="max-md:hidden md:visible">Platform Stats</span>
		<ChartBar />
	</Dialog.Trigger>

	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Monthly platform statistics</Dialog.Title>
			<Dialog.Description>Monthly overview of total playlight opens and game referrals.</Dialog.Description>
		</Dialog.Header>

		<div class="max-h-[50dvh] overflow-y-auto">
			{#if loading}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each Array(6) as _}
						<div class="bg-muted/50 h-38 w-full animate-pulse rounded-lg"></div>
					{/each}
				</div>
			{:else if statistics.length === 0}
				<p class="text-muted-foreground text-center text-sm">No statistics available.</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each statistics as stat}
						<Card.Root class="bg-background overflow-hidden border">
							<Card.Header class="bg-muted/50 border-b">
								<Card.Title class="text-muted-foreground -mt-2 mb-4 text-lg font-semibold"
									>{stat.monthName} {stat.year}</Card.Title
								>
							</Card.Header>
							<Card.Content class="p-4">
								<div class="grid grid-cols-2 gap-2">
									<div>
										<p class="text-muted-foreground text-sm">Opens</p>
										<p class="text-xl font-semibold">{formatNumber(stat.totalPlaylightOpens)}</p>

										{#if stat.playlightChange !== 0}
											<div class="mt-1 flex items-center gap-1">
												{#if stat.playlightChange > 0}
													<TrendingUp class="h-4 w-4 text-green-500" />
													<span class="text-sm font-medium text-green-500">
														+{formatPercentage(stat.playlightChange)}%
													</span>
												{:else}
													<TrendingDown class="h-4 w-4 text-red-500" />
													<span class="text-sm font-medium text-red-500">
														{formatPercentage(stat.playlightChange)}%
													</span>
												{/if}
											</div>
										{/if}
									</div>

									<div>
										<p class="text-muted-foreground text-sm">Referrals</p>
										<p class="text-xl font-semibold">{formatNumber(stat.totalReferrals)}</p>

										{#if stat.referralsChange !== 0}
											<div class="mt-1 flex items-center gap-1">
												{#if stat.referralsChange > 0}
													<TrendingUp class="h-4 w-4 text-green-500" />
													<span class="text-sm font-medium text-green-500">
														+{formatPercentage(stat.referralsChange)}%
													</span>
												{:else}
													<TrendingDown class="h-4 w-4 text-red-500" />
													<span class="text-sm font-medium text-red-500">
														{formatPercentage(stat.referralsChange)}%
													</span>
												{/if}
											</div>
										{/if}
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
