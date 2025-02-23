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
	import { AlertTriangle, LogOut, Settings, Menu } from "lucide-svelte";
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
			{ date: "2025-02-16", playersGained: 15, gamesReferred: 3 },
			{ date: "2025-02-17", playersGained: 20, gamesReferred: 5 },
			{ date: "2025-02-18", playersGained: 18, gamesReferred: 4 },
			{ date: "2025-02-19", playersGained: 22, gamesReferred: 6 },
			{ date: "2025-02-20", playersGained: 19, gamesReferred: 3 },
			{ date: "2025-02-21", playersGained: 25, gamesReferred: 7 },
			{ date: "2025-02-22", playersGained: 30, gamesReferred: 8 },
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
	});

	let showSidebar = $state(false);
	function toggleSidebar() {
		showSidebar = !showSidebar;
	}

	function handleClickOutside(event) {
		const sidebar = document.querySelector("[data-sidebar]");
		const menuButton = document.querySelector("[data-menu-button]");

		if (showSidebar && sidebar && !sidebar.contains(event.target) && !menuButton.contains(event.target)) {
			showSidebar = false;
		}
	}
</script>

<svelte:document onclick={handleClickOutside} />

<main class="bg-background flex h-screen">
	<!-- Mobile Menu Button -->
	<Button data-menu-button class="fixed top-22 left-4 z-30 md:hidden" onclick={toggleSidebar}>
		<Menu size={20} />
	</Button>

	<!-- Sidebar -->
	<div
		data-sidebar
		class="bg-card fixed left-0 z-40 min-h-full w-64 transition-transform duration-200 ease-in-out md:relative md:translate-x-0 {showSidebar
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<div class="flex flex-col border-t border-r p-4">
			<div class="mb-8 flex items-center justify-between">
				<h2 class="max-w-full truncate text-lg font-semibold">Hey, {$username}!</h2>
				<Button variant="ghost"><LogOut /></Button>
			</div>
			<h3 class="text-muted-foreground mb-4 text-sm font-medium">Your Sites</h3>
			<div class="space-y-2 overflow-y-auto max-h-[calc(100dvh-250px)]">
				{#if sites.length}
					{#each sites as site}
						<Button
							variant={selectedSite?.id === site.id ? "secondary" : "outline"}
							class="w-full justify-start"
							onclick={() => {
								selectedSite = site;
								if (window.innerWidth < 768) showSidebar = false;
							}}
						>
							{site.domain}
						</Button>
					{/each}
				{:else}
					<Button variant="outline" class="w-full justify-start">No site connected.</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Overlay for mobile -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	{#if showSidebar}
		<div class="bg-background/50 fixed inset-0 z-30 md:hidden" onclick={() => (showSidebar = false)}></div>
	{/if}

	<!-- Center View -->
	<div class="w-full overflow-x-hidden overflow-y-auto p-8">
		{#if selectedSite}
			<div class="mb-8 flex items-center justify-between gap-4">
				<h1 class="truncate text-3xl font-bold">{selectedSite.domain || "Example.com"}</h1>
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
					<CardTitle>Performance</CardTitle>
				</CardHeader>
				<CardContent>
					{#if loading || typeof window === "undefined"}
						<div class="flex h-[400px] items-center justify-center">Loading...</div>
					{:else}
						<Chart
							chartOptions={{
								xaxis: { categories: stats?.value?.map((item) => item.date) },
							}}
							series={[
								{
									name: "Players gained",
									data: stats?.value?.map((item) => item.playersGained),
								},
								{
									name: "Games recommended",
									data: stats?.value?.map((item) => item.gamesReferred),
								},
							]}
							type="line"
						/>
					{/if}
				</CardContent>
			</Card>

			<!-- Important Actions and dialogs remain unchanged -->
			<Card>
				<CardHeader>
					<CardTitle>Site Actions</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Update Domain</h3>
							<p class="text-muted-foreground text-sm">Change the main domain for this site.</p>
						</div>
						<Button variant="outline" class="cursor-pointer" onclick={() => (showDomainDialog = true)}>
							<Settings class="mr-2 h-4 w-4" />
							Domain
						</Button>
					</div>
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Remove Site</h3>
							<p class="text-muted-foreground text-sm">Remove this site from Playlight.</p>
						</div>
						<Button variant="destructive" class="cursor-pointer" onclick={() => (showDeleteDialog = true)}
							>Remove Site</Button
						>
					</div>
				</CardContent>
			</Card>
		{:else}
			<div class="flex h-full items-center justify-center">
				<p class="text-muted-foreground">No sites connected yet.</p>
			</div>
		{/if}
	</div>
</main>

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
