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
	import { isAdmin, username } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { AlertTriangle, LogOut, Settings, Menu, Plus, ArrowDown, Search } from "lucide-svelte";
	import Chart from "$lib/components/Chart.svelte";
	import { goto } from "$app/navigation";
	import WhitelistDialog from "$lib/components/WhitelistDialog.svelte";
	import GameCreationDialog from "$lib/components/GameCreationDialog.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import AccountSettings from "$lib/components/AccountSettings.svelte";
	import { formatDomain } from "$lib/utils/formatDomain";

	// State management
	let statTimeframe = $state(7);
	let selectedGame = $state();
	let games = $state([]);
	let stats = $state([]);
	let loading = $state(false);
	let showDeleteDialog = $state(false);
	let showDomainDialog = $state(false);
	let newDomain = $state("");

	let page = $state(1);
	let passwordInput = $state("");
	let gameSearchTerm = $state();

	// Fetch sites and initial stats
	onMount(async () => {
		fetchGames();
	});

	async function fetchGames() {
		try {
			const response = await fetchWithErrorHandling(
				`${$BASE_API_URL}/game/${localStorage.getItem("id")}?page=${page}${gameSearchTerm ? "&search=" + gameSearchTerm : ""}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("bearer")}` },
				},
			);
			const data = await response.json();
			games = [...games, ...data?.games];
			if (games.length > 0) selectedGame = games[0];
		} catch (error) {
			toast.error("Failed to load games: " + error);
		}
	}

	async function fetchStats() {
		if (!selectedGame) return;

		loading = true;
		try {
			const response = await fetchWithErrorHandling(
				`${$BASE_API_URL}/game/${selectedGame.id}/statistics?days=${statTimeframe}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bearer")}` },
					body: JSON.stringify({ id: localStorage.getItem("id") }),
				},
			);
			stats.value = await response.json();
		} catch (error) {
			toast.error("Failed to load statistics: " + error);
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/game/${selectedGame.id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bearer")}` },
				body: JSON.stringify({ id: localStorage.getItem("id"), password: passwordInput }),
			});
			games = games.filter((site) => site.id !== selectedGame.id);
			selectedGame = undefined;
			showDeleteDialog = false;
			passwordInput = "";
			toast.success("Site removed successfully");
		} catch (error) {
			toast.error("Failed to remove site: " + error);
		}
	}

	async function handleDomainUpdate() {
		try {
			const game = { ...selectedGame };
			game.domain = formatDomain(newDomain);
			game.id = undefined;
			await fetchWithErrorHandling(`${$BASE_API_URL}/game/${selectedGame.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({ ...game, password: passwordInput, id: localStorage.getItem("id") }),
			});
			selectedGame.domain = game.domain;
			showDomainDialog = false;
			passwordInput = "";
			toast.success("Domain updated successfully!");
		} catch (error) {
			toast.error("Failed to update domain: " + error);
		}
	}

	let chartOptions = $state({});
	let series = $state([]);

	$effect(() => {
		if (statTimeframe && selectedGame && games.length) fetchStats();
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
				<AccountSettings />
			</div>
			<!-- Sidebar scroll container -->
			<div class="max-h-[calc(100dvh-250px)] overflow-y-auto">
				<h3 class="text-muted-foreground mb-4 text-sm font-medium">Admin Tools</h3>
				{#if $isAdmin}
					<div class="space-y-2">
						<GameCreationDialog />
						<WhitelistDialog />
					</div>
				{:else}
					<p class="text-muted-foreground bg-muted p-2 text-sm italic">
						Please reach out via <a href="mailto:paulplaystudio@gmail.com" class="underline">email</a>.
					</p>
				{/if}
				<h3 class="text-muted-foreground mt-4 mb-4 text-sm font-medium">{$isAdmin ? "All Games" : "Your Games"}</h3>
				<div class="space-y-2">
					<search class="flex gap-2">
						<Input
							type="text"
							placeholder="Search for game..."
							class="focus-visible:ring-0"
							bind:value={gameSearchTerm}
							onkeypress={(e) => {
								if (e.key == "Enter") {
									e.preventDefault();
									page = 1;
									games = [];
									fetchGames();
								}
							}}
						/>
						<Button
							variant="outline"
							onclick={() => {
								page = 1;
								games = [];
								fetchGames();
							}}><Search /></Button
						>
					</search>
					{#if games.length}
						{#each games as game}
							<Button
								variant={selectedGame?.id === game.id ? "secondary" : "outline"}
								class="w-full justify-start"
								onclick={() => {
									selectedGame = game;
									if (window.innerWidth < 768) showSidebar = false;
								}}
							>
								{game.domain}
							</Button>
						{/each}
					{:else}
						<Button variant="outline" class="w-full justify-start">No games found.</Button>
					{/if}
					{#if games?.length > 50 && games?.length % 50 == 0}
						<Button
							variant="ghost"
							class="w-full"
							onclick={() => {
								page++;
								fetchGames();
							}}>Load more <ArrowDown /></Button
						>
					{/if}
				</div>
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
		{#if selectedGame}
			<div class="mb-8 flex items-center justify-between gap-4">
				<div class="flex max-w-2/3 gap-4">
					<img src={selectedGame?.logo_url} alt="game logo" class="h-10 w-10 rounded object-cover" />
					<h1 class="truncate text-3xl font-bold">{selectedGame.domain || "Example.com"}</h1>
				</div>
				<Select type="single" bind:value={statTimeframe}>
					<SelectTrigger class="w-32">
						{statTimeframe} Days
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={7}>7 Days</SelectItem>
						<SelectItem value={30}>30 Days</SelectItem>
						<SelectItem value={90}>90 Days</SelectItem>
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
									name: "Games referred",
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
							<p class="text-muted-foreground text-sm">Change the main domain for this game.</p>
						</div>
						<Button variant="outline" class="cursor-pointer" onclick={() => (showDomainDialog = true)}>
							<Settings class="mr-2 h-4 w-4" />
							Domain
						</Button>
					</div>
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Remove Site</h3>
							<p class="text-muted-foreground text-sm">Remove this game from the platform.</p>
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
		<Label for="password" class="-mb-2">Password</Label>
		<Input type="password" placeholder="password" bind:value={passwordInput} />
		<DialogFooter>
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
		<Label for="password" class="-mb-2">Password</Label>
		<Input type="password" placeholder="password" id="password" bind:value={passwordInput} />
		<Label for="domain" class="mt-2 -mb-2">Domain</Label>
		<Input type="text" id="domain" placeholder="new-domain.com" bind:value={newDomain} />
		<DialogFooter>
			<Button onclick={handleDomainUpdate}>Update Domain</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
