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
	import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import { toast } from "svelte-sonner";
	import { isAdmin, isAuthenticated, username } from "$lib/stores/accountStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { AlertTriangle, LogOut, Settings, Menu, Plus, ArrowDown, Search, HelpCircle } from "lucide-svelte";
	import LineChart from "$lib/components/LineChart.svelte";
	import BarChart from "$lib/components/BarChart.svelte";
	import { goto } from "$app/navigation";
	import WhitelistDialog from "$lib/components/WhitelistDialog.svelte";
	import GameCreationDialog from "$lib/components/GameCreationDialog.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import AccountSettings from "$lib/components/AccountSettings.svelte";
	import { formatDomain } from "$lib/utils/formatDomain";
	import FileCleanupDialog from "$lib/components/FileCleanupDialog.svelte";
	import PlatformStatDialog from "$lib/components/PlatformStatDialog.svelte";
	import PerformanceWarning from "$lib/components/PerformanceWarning.svelte";
	import GameFeatureDialog from "$lib/components/GameFeatureDialog.svelte";

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

	// Event analytics state
	let eventType = $state("click");
	let eventData = $state([]);
	let eventLoading = $state(false);

	// Player flow state
	let playerFlowData = $state({ gainedFrom: [], referredTo: [] });
	let playerFlowLoading = $state(false);

	// Generate last 7 days for date selection
	function generateLast7Days() {
		const dates = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			dates.push(date.toISOString().split("T")[0]);
		}
		return dates;
	}

	let availableDates = generateLast7Days();
	let eventStartDate = $state(availableDates[0]);
	let eventEndDate = $state(availableDates[availableDates.length - 1]);

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
			if ($isAuthenticated) toast.error("Failed to load games: " + error);
		}
	}

	async function fetchStats() {
		if (!selectedGame) return;

		loading = true;
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/game/${selectedGame.id}/statistics`, {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bearer")}` },
				body: JSON.stringify({ id: localStorage.getItem("id"), days: statTimeframe }),
			});
			stats.value = await response.json();
		} catch (error) {
			toast.error("Failed to load statistics: " + error);
		} finally {
			loading = false;
		}
	}

	async function fetchEventData() {
		if (!selectedGame) return;

		eventLoading = true;
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/game/${selectedGame.id}/events`, {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bearer")}` },
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					startDate: eventStartDate,
					endDate: eventEndDate,
					type: eventType,
				}),
			});
			eventData = await response.json();
		} catch (error) {
			toast.error("Failed to load event data: " + error);
		} finally {
			eventLoading = false;
		}
	}

	async function fetchPlayerFlow() {
		if (!selectedGame) return;

		playerFlowLoading = true;
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/game/${selectedGame.id}/events/player-flow`, {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bearer")}` },
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					startDate: eventStartDate,
					endDate: eventEndDate,
				}),
			});
			playerFlowData = await response.json();
		} catch (error) {
			toast.error("Failed to load player flow: " + error);
		} finally {
			playerFlowLoading = false;
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
			toast.success("Site removed successfully!");
		} catch (error) {
			toast.error("Failed to remove site: " + error);
		}
	}

	async function handlePauseChange(isPaused) {
		try {
			await fetchWithErrorHandling(`${$BASE_API_URL}/game/set-paused/${selectedGame.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bearer")}` },
				body: JSON.stringify({ id: localStorage.getItem("id"), isPaused }),
			});
			selectedGame.paused = isPaused ? 1 : 0;
			toast.success(`Game ${isPaused ? "paused" : "activated"} successfully!`);
		} catch (error) {
			toast.error("Failed to update game status: " + error);
		}
	}

	let chartOptions = $state({});
	let series = $state([]);

	$effect(() => {
		if (statTimeframe && selectedGame && games.length) fetchStats();
	});

	$effect(() => {
		if (eventStartDate && eventEndDate && eventType && selectedGame && games.length) {
			fetchEventData();
		}
	});

	$effect(() => {
		if (eventStartDate && eventEndDate && selectedGame && games.length) fetchPlayerFlow();
	});

	let showSidebar = $state(false);

	function handleClickOutside(event) {
		const sidebar = document.querySelector("[data-sidebar]");
		const menuButton = document.querySelector("[data-menu-button]");

		if (showSidebar && sidebar && !sidebar.contains(event.target) && !menuButton.contains(event.target)) {
			showSidebar = false;
		}
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<svelte:document onclick={handleClickOutside} />

<main class="bg-background flex min-h-screen">
	<!-- Mobile Menu Button -->
	<Button data-menu-button class="fixed top-22 left-4 z-30 md:hidden" onclick={() => (showSidebar = !showSidebar)}>
		<Menu size={20} />
	</Button>

	<!-- Sidebar -->
	<div
		data-sidebar
		class="bg-card fixed left-0 z-40 min-h-full w-72 max-w-72 overflow-x-hidden border-t border-r transition-transform duration-200 ease-in-out md:relative md:translate-x-0 {showSidebar
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<div class="flex flex-col p-4">
			<div class="mb-8 flex items-center justify-between">
				<h2 class="max-w-full truncate text-lg font-semibold">Hey, {$username}!</h2>
				<AccountSettings />
			</div>
			<!-- Sidebar scroll container -->
			<div class="max-h-[calc(100dvh-200px)] overflow-y-auto">
				<h3 class="text-muted-foreground mb-4 text-sm font-medium">Admin tools</h3>
				{#if $isAdmin}
					<div class="space-y-2">
						<GameCreationDialog />
						<WhitelistDialog />
						<FileCleanupDialog />
					</div>
				{:else}
					<p class="text-muted-foreground bg-muted p-2 text-sm italic">
						Need help from an admin? Please reach out via <a href="mailto:paulplaystudio@gmail.com" class="underline"
							>email</a
						>.
					</p>
				{/if}
				<h3 class="text-muted-foreground mt-4 mb-4 text-sm font-medium">{$isAdmin ? "All games" : "Your games"}</h3>
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
								<p class="truncate">{game.domain}</p>
							</Button>
						{/each}
					{:else}
						<Button variant="outline" class="w-full max-w-full justify-start truncate"
							><p class="truncate">No games found.</p></Button
						>
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
	<div class="w-full overflow-x-hidden p-8">
		{#if selectedGame}
			<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
				<div class="flex gap-4">
					<img src={selectedGame?.logo_url} alt="game logo" class="h-10 w-10 border object-cover" />
					<h1 class="truncate text-3xl font-bold">{selectedGame.domain || "Example.com"}</h1>
				</div>
				<div class="flex items-center justify-center gap-4">
					<PlatformStatDialog />
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
			</div>

			<!-- Stats Graph using Chart.js via our Chart.svelte component -->
			<Card class="mb-8">
				<CardHeader>
					<CardTitle>Performance</CardTitle>
					<PerformanceWarning statistics={stats?.value} />
				</CardHeader>
				<CardContent>
					{#if loading || typeof window === "undefined"}
						<div class="flex h-[400px] items-center justify-center">Loading...</div>
					{:else}
						<LineChart
							chartOptions={{
								xaxis: { categories: stats?.value?.map((item) => item.date) },
							}}
							series={[
								{
									name: "players gained",
									data: stats?.value?.map((item) => item.playersGained),
								},
								{
									name: "games referred",
									data: stats?.value?.map((item) => item.gamesReferred),
								},
							]}
							type="line"
						/>
					{/if}
				</CardContent>
			</Card>

			<!-- Event Analytics -->
			<Card class="mb-8">
				<CardHeader>
					<div class="flex flex-wrap items-start justify-between gap-4">
						<CardTitle>Events</CardTitle>
						<div class="flex flex-wrap items-center gap-8">
							<div class="flex items-center gap-2">
								<Label class="text-sm">Event type</Label>
								<Tabs bind:value={eventType}>
									<TabsList>
										<TabsTrigger value="click">Click</TabsTrigger>
										<TabsTrigger value="open">Open</TabsTrigger>
									</TabsList>
								</Tabs>
								<div class="group relative">
									<HelpCircle size={18} class="text-muted-foreground cursor-help" />
									<div
										class="bg-popover text-popover-foreground pointer-events-none absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-md border p-3 text-sm opacity-0 shadow-md transition-opacity group-hover:opacity-100"
									>
										<ul class="space-y-2">
											<li>Click: User clicks on another game (which results in a referral)</li>
											<li>Open: User opens the Discovery</li>
										</ul>
									</div>
								</div>
							</div>
							{#each [{ label: "From", value: eventStartDate, bind: (v) => (eventStartDate = v) }, { label: "To", value: eventEndDate, bind: (v) => (eventEndDate = v) }] as dateSelect}
								<div class="flex items-center gap-2">
									<Label class="text-sm">{dateSelect.label}</Label>
									<Select type="single" value={dateSelect.value} onValueChange={dateSelect.bind}>
										<SelectTrigger class="w-32">
											{dateSelect.value}
										</SelectTrigger>
										<SelectContent>
											{#each availableDates as date}
												<SelectItem value={date}>{date}</SelectItem>
											{/each}
										</SelectContent>
									</Select>
								</div>
							{/each}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{#if eventLoading || typeof window === "undefined"}
						<div class="flex h-[300px] items-center justify-center">Loading...</div>
					{:else}
						<BarChart data={eventData} />
					{/if}

					<!-- Player Flow Section -->
					<div class="mt-12">
						<h3 class="mb-4 text-sm font-medium">Player flow</h3>
						{#if playerFlowLoading}
							<div class="flex h-48 items-center justify-center">Loading...</div>
						{:else}
							<div class="flex flex-wrap gap-6">
								{#each [{ title: "Gained from", data: playerFlowData.gainedFrom }, { title: "Referred to", data: playerFlowData.referredTo }] as section}
									<div class="max-w-full flex-1 border p-4">
										<h4 class="text-muted-foreground mb-4 text-sm font-medium">{section.title}</h4>
										{#if section.data.length === 0}
											<p class="text-muted-foreground text-sm">No data.</p>
										{:else}
											<div class="of-top of-bottom of-length-2 max-h-64 space-y-2 overflow-y-auto">
												{#each section.data as game}
													<div class="flex items-center gap-3 p-2">
														<img src={game.logo_url} alt={game.name} class="h-8 w-8 object-cover" />
														<a
															class="mr-auto truncate text-sm hover:underline"
															href={`https://${game.domain}`}
															target="_blank">{game.name}</a
														>
														<span class="text-muted-foreground text-sm">{game.count}</span>
													</div>
												{/each}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</CardContent>
			</Card>

			<!-- Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Site actions</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Update info</h3>
							<p class="text-muted-foreground text-sm">Change information regarding this game.</p>
						</div>
						<GameCreationDialog updateOnly={true} bind:selectedGame />
					</div>
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Feature a game</h3>
							<p class="text-muted-foreground text-sm">Highlight a Playlight game on this site.</p>
						</div>
						<GameFeatureDialog bind:selectedGame />
					</div>
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Pause game</h3>
							<p class="text-muted-foreground text-sm">Hide this game on the platform.</p>
						</div>
						<Tabs
							value={selectedGame.paused ? "paused" : "active"}
							onValueChange={(value) => handlePauseChange(value === "paused")}
						>
							<TabsList>
								<TabsTrigger value="active">Active</TabsTrigger>
								<TabsTrigger value="paused">Paused</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<div class="flex items-center justify-between gap-2">
						<div>
							<h3 class="font-medium">Remove game</h3>
							<p class="text-muted-foreground text-sm">Remove this game from the platform.</p>
						</div>
						<Button variant="destructive" class="cursor-pointer" onclick={() => (showDeleteDialog = true)}
							>Remove</Button
						>
					</div>
				</CardContent>
			</Card>
		{:else}
			<div class="flex h-full items-center justify-center">
				<p class="text-muted-foreground">No games connected yet.</p>
			</div>
		{/if}
	</div>
</main>

<Dialog bind:open={showDeleteDialog}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2">
				<AlertTriangle class="text-destructive h-5 w-5" />
				Remove "{selectedGame?.name}"
			</DialogTitle>
			<DialogDescription>
				This will immediately remove all recommendations for your game from Playlight. You'll need to remove the
				Playlight script from your site manually. This action cannot be undone.
			</DialogDescription>
		</DialogHeader>
		<div class="grid gap-2 py-4">
			<Label for="password">Password</Label>
			<Input type="password" placeholder="your-password" bind:value={passwordInput} />
		</div>
		<DialogFooter>
			<Button variant="destructive" onclick={handleDelete}>Remove</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
