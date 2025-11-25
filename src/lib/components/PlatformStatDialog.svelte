<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { ChartBar, TrendingDown, TrendingUp } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { toast } from "svelte-sonner";

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
				let referralsChange = 0;

				if (prevMonth) {
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

	<Dialog.Content class="w-2xl! max-w-full!">
		<Dialog.Header>
			<Dialog.Title>Monthly platform statistics</Dialog.Title>
		</Dialog.Header>

		<div class="max-h-[50dvh] overflow-y-auto">
			{#if loading}
				<div class="bg-muted/50 h-64 w-full animate-pulse rounded-lg"></div>
			{:else if statistics.length === 0}
				<p class="text-muted-foreground text-center text-sm">No statistics available.</p>
			{:else}
				<table class="w-full">
					<thead>
						<tr class="border-b">
							<th class="text-muted-foreground pb-2 pr-2 text-left text-sm font-medium">Month</th>
							<th class="text-muted-foreground px-2 pb-2 text-right text-sm font-medium">Referrals</th>
							<th class="text-muted-foreground pb-2 pl-2 text-right text-sm font-medium">Change</th>
						</tr>
					</thead>
					<tbody>
						{#each statistics as stat, index}
							<tr class="border-b">
								<td class="py-3 pr-2 text-left">
									{stat.monthName} {stat.year}
								</td>
								<td class="px-2 py-3 text-right font-semibold">
									{formatNumber(stat.totalReferrals)}
								</td>
								<td class="py-3 pl-2 text-right">
									{#if stat.referralsChange !== 0 && index}
										<div class="flex items-center justify-end gap-1">
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
									{:else}
										<span class="text-muted-foreground text-sm">-</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
