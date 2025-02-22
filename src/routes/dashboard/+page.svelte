<script>
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { toast } from "svelte-sonner";
	import { username } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { AlertTriangle, LogOut, Settings } from "lucide-svelte";
	import Chart from "$lib/components/Chart.svelte";

	// State management
	let selectedTimeframe = $state(30);
	let selectedSite = $state(1);
	let sites = $state([]);
	let stats = $state([]);
	let loading = $state(false);
	let showDeleteDialog = $state(false);
	let showDomainDialog = $state(false);
	let newDomain = $state("");

	onMount(() => {
		// Uncomment the following block to use demo data during development
		stats.value = [
			{ date: "2025-02-16", playersGained: 15, recommendations: 3 },
			{ date: "2025-02-17", playersGained: 20, recommendations: 5 },
			{ date: "2025-02-18", playersGained: 18, recommendations: 4 },
			{ date: "2025-02-19", playersGained: 22, recommendations: 6 },
			{ date: "2025-02-20", playersGained: 19, recommendations: 3 },
			{ date: "2025-02-21", playersGained: 25, recommendations: 7 },
			{ date: "2025-02-22", playersGained: 30, recommendations: 8 },
		];

		// Optionally, update chartOptions and series immediately based on demo data:
		chartOptions.value = {
			chart: { zoom: { enabled: false } },
			xaxis: { categories: stats.value.map((item) => item.date) },
			tooltip: { enabled: true },
			legend: { show: true },
		};

		series.value = [
			{ name: "Players Gained", data: stats.value.map((item) => item.playersGained) },
			{ name: "Recommendations", data: stats.value.map((item) => item.recommendations) },
		];
	});

	// Fetch sites and initial stats
	onMount(async () => {
		try {
			const sitesResponse = await fetchWithErrorHandling(`${$BASE_API_URL}/sites`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("bearer")}` },
			});
			sites.value = await sitesResponse.json();
			if (sites.value.length > 0) {
				selectedSite.value = sites.value[0];
				await fetchStats();
			}
		} catch (error) {
			toast.error("Failed to load sites");
		}
	});

	async function fetchStats() {
		if (!selectedSite) return;

		loading = true;
		try {
			const response = await fetchWithErrorHandling(
				`${$BASE_API_URL}/stats/${selectedSite.id}?timeframe=${selectedTimeframe}`,
				{ headers: { Authorization: `Bearer ${localStorage.getItem("bearer")}` } },
			);
			stats.value = await response.json();
		} catch (error) {
			toast.error("Failed to load statistics");
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/sites/${selectedSite.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${localStorage.getItem("bearer")}` },
			});
			sites = sites.filter((site) => site.id !== selectedSite.id);
			selectedSite = sites[0];
			showDeleteDialog = false;
			toast.success("Site removed successfully");
		} catch (error) {
			toast.error("Failed to remove site");
		}
	}

	async function handleDomainUpdate() {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/sites/${selectedSite.id}/domain`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({ domain: newDomain }),
			});
			selectedSite.domain = newDomain;
			showDomainDialog = false;
			toast.success("Domain updated successfully");
		} catch (error) {
			toast.error("Failed to update domain");
		}
	}

	let chartOptions = $state({});
	let series = $state([]);

	$effect(() => {
		if (selectedTimeframe && selectedSite) {
			fetchStats();
		}

		if (stats) {
			chartOptions.value = {
				chart: { zoom: { enabled: false } },
				xaxis: { categories: stats.map((item) => item.date) },
				tooltip: { enabled: true },
				legend: { show: true },
			};

			series.value = [
				{ name: "Players Gained", data: stats.map((item) => item.playersGained) },
				{ name: "Recommendations", data: stats.map((item) => item.recommendations) },
			];
		}
	});
</script>

<div class="bg-background flex h-screen">
	<!-- Sidebar remains unchanged -->
	<div class="bg-card w-64 border-t border-r p-4">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="max-w-full truncate text-lg font-semibold">Hey, {$username}!</h2>
			<Button variant="ghost"><LogOut /></Button>
		</div>
		<h3 class="text-muted-foreground mb-4 text-sm font-medium">Your Sites</h3>
		<div class="space-y-2">
			{#if sites.length}
				{#each sites as site}
					<Button
						variant={selectedSite?.id === site.id ? "secondary" : "outline"}
						class="w-full justify-start"
						onclick={() => (selectedSite = site)}
					>
						{site.domain}
					</Button>
				{/each}
			{:else}
				<Button variant="outline" class="w-full justify-start">No site connected.</Button>
			{/if}
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 overflow-auto p-8">
		{#if selectedSite}
			<div class="mb-8 flex items-center justify-between">
				<h1 class="text-3xl font-bold">{selectedSite.domain || "Example.com"}</h1>
				<Select type="single" bind:value={selectedTimeframe}>
					<SelectTrigger class="w-32">
						{selectedTimeframe} Days
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={7}>7 Days</SelectItem>
						<SelectItem value={30}>30 Days</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Stats Graph using Chart.js via our Chart.svelte component -->
			<Card class="mb-8">
				<CardHeader>
					<CardTitle>Performance Overview</CardTitle>
				</CardHeader>
				<CardContent>
					{#if loading || typeof window === "undefined"}
						<div class="flex h-[400px] items-center justify-center">Loading...</div>
					{:else}
						{#key (stats, chartOptions, series)}
							<div class="h-150">
								<Chart chartOptions={$state.snapshot(chartOptions)} series={$state.snapshot(series)} type="line" />
							</div>
						{/key}
					{/if}
				</CardContent>
			</Card>

			<!-- Important Actions and dialogs remain unchanged -->
			<Card>
				<CardHeader>
					<CardTitle>Site Actions</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-medium">Update Domain</h3>
							<p class="text-muted-foreground text-sm">Change the main domain for this site</p>
						</div>
						<Button variant="outline" class="cursor-pointer" onclick={() => (showDomainDialog = true)}>
							<Settings class="mr-2 h-4 w-4" />
							Change Domain
						</Button>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-medium">Remove Site</h3>
							<p class="text-muted-foreground text-sm">Remove this site from Playlight</p>
						</div>
						<Button variant="destructive" class="cursor-pointer" onclick={() => (showDeleteDialog = true)}
							>Remove Site</Button
						>
					</div>
				</CardContent>
			</Card>

			<Dialog bind:open={showDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle class="flex items-center gap-2">
							<AlertTriangle class="text-destructive h-5 w-5" />
							Remove Site
						</DialogTitle>
						<DialogDescription>
							This will immediately remove all recommendations for your game from Playlight. You'll need to remove the
							Playlight script from your site manually. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" class="cursor-pointer" onclick={() => (showDeleteDialog = false)}>Cancel</Button>
						<Button variant="destructive" onclick={handleDelete}>Remove Site</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog bind:open={showDomainDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Domain</DialogTitle>
						<DialogDescription>
							Enter the new domain for your site. Make sure to update your implementation accordingly.
						</DialogDescription>
					</DialogHeader>
					<Input type="text" placeholder="https://newdomain.com" bind:value={newDomain} />
					<DialogFooter>
						<Button variant="outline" class="cursor-pointer" onclick={() => (showDomainDialog = false)}>Cancel</Button>
						<Button onclick={handleDomainUpdate}>Update Domain</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		{:else}
			<div class="flex h-full items-center justify-center">
				<p class="text-muted-foreground">No sites connected yet.</p>
			</div>
		{/if}
	</div>
</div>
