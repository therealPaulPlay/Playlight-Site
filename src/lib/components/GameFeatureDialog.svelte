<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Star, Loader2, XCircle } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { toast } from "svelte-sonner";
	import { formatDomain } from "$lib/utils/formatDomain";

	let { selectedGame = $bindable({}) } = $props();

	// State
	let dialogOpen = $state(false);
	let isLoading = $state(false);

	// Form data
	let featuredGameDomain = $state("");
	let featureDescription = $state("");
	let selectedDays = $state(1);

	// Format date for display
	function formatDate(dateString) {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	async function handleFeatureAction() {
		isLoading = true;
		try {
			const formattedDomain = selectedGame?.featured_game ? "" : formatDomain(featuredGameDomain);

			// To remove a feature, omit domain and duration params
			const requestBody = selectedGame?.featured_game
				? { id: localStorage.getItem("id") }
				: {
						id: localStorage.getItem("id"),
						featuredGameDomain: formattedDomain,
						days: parseInt(selectedDays),
					};

			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/game/set-featured-game/${selectedGame.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify(requestBody),
			});

			const result = await response.json();
			selectedGame?.featured_game
				? toast.success("Featured game removed successfully!")
				: toast.success(`Feature set successfully for ${selectedDays} days!`);

			selectedGame.featured_game = result.featuredGameId;
			selectedGame.feature_expires_at = result.featureExpiresAt;

			dialogOpen = false;
		} catch (error) {
			toast.error("Error updating featured game: " + error);
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		Feature
		{#if selectedGame?.featured_game}
			<XCircle />
		{:else}
			<Star />
		{/if}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Feature a game</Dialog.Title>
			<Dialog.Description>Pick a game to show at the start of the Discovery on this site.</Dialog.Description>
		</Dialog.Header>

		{#if !selectedGame?.featured_game}
			<div class="space-y-6 py-4">
				<div class="grid gap-2">
					<Label for="featuredGameDomain">Domain</Label>
					<Input id="featuredGameDomain" bind:value={featuredGameDomain} placeholder="game-to-feature.com" />
				</div>

				<div class="grid gap-2">
					<Label>Duration</Label>
					<Tabs bind:value={selectedDays} class="w-full">
						<TabsList class="grid grid-cols-3">
							<TabsTrigger value={1}>1 Day</TabsTrigger>
							<TabsTrigger value={3}>3 Days</TabsTrigger>
							<TabsTrigger value={7}>7 Days</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>
		{:else}
			<div class="py-4">
				<div class="bg-card border p-4">
					<div class="mb-3 flex items-center gap-2">
						<h3 class="text-base font-medium">Active feature</h3>
					</div>

					<div class="space-y-3">
						<div class="flex items-center gap-2">
							<Badge variant="outline" class="shrink-0 text-xs">Game ID</Badge>
							<span class="text-sm">{selectedGame.featured_game}</span>
						</div>

						<div class="flex items-center gap-2">
							<Badge variant="outline" class="flex text-xs">Expires</Badge>
							<span class="text-sm">{formatDate(selectedGame.feature_expires_at)}</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<Dialog.Footer>
			<Button
				variant={selectedGame?.featured_game ? "destructive" : "default"}
				onclick={handleFeatureAction}
				disabled={isLoading || (!selectedGame?.featured_game && !featuredGameDomain)}
			>
				{#if isLoading}
					<Loader2 class="mr-2 animate-spin" />
					Processing...
				{:else if selectedGame?.featured_game}
					Remove Feature
				{:else}
					Set Feature
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
