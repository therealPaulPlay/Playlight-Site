<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { ListCheck, Plus, Trash2 } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	let dialogOpen = $state(false);
	let addEmail = $state();
	let whitelistEntries = $state([]);

	async function fetchWhitelist() {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/admin/all-whitelist`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
				}),
			});
			whitelistEntries = await response.json();
		} catch (error) {
			toast.error("Failed to load whitelist: " + error);
		}
	}

	async function removeFromWhitelist(email) {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/admin/whitelist/${email}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
				}),
			});
			await response.json();
			fetchWhitelist();
		} catch (error) {
			toast.error("Failed to remove entry from whitelist: " + error);
		}
	}

	async function addToWhitelist(email) {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/admin/whitelist`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					email,
				}),
			});
			await response.json();
			fetchWhitelist();
			toast.success("Added entry successfully!");
			addEmail = "";
		} catch (error) {
			toast.error("Failed to remove entry from whitelist: " + error);
		}
	}

	$effect(() => {
		if (dialogOpen) fetchWhitelist();
	});
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Whitelist <ListCheck /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Manage whitelist</Dialog.Title>
			<Dialog.Description>Add or remove users from the signup whitelist.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="flex flex-wrap items-center gap-2">
				<Label for="email">Add email</Label>
				<div class="flex w-full items-center gap-2">
					<Input id="email" placeholder="example.user@email.com" class="grow-1" bind:value={addEmail} />
					<Button
						disabled={!Boolean(addEmail)}
						onclick={() => {
							addToWhitelist(addEmail);
						}}>Add <Plus /></Button
					>
				</div>
			</div>
		</div>
		<Label>Whitelist</Label>
		<div class="flex max-h-[30dvh] max-w-full flex-wrap gap-2 overflow-x-visible overflow-y-auto">
			{#if whitelistEntries?.length}
				{#each whitelistEntries as entry}
					<div class="flex w-full max-w-full items-center justify-between border">
						<p class="max-w-2/3 truncate px-2 text-sm">{entry.email}</p>
						<Button variant="secondary" onclick={() => removeFromWhitelist(entry.email)}><Trash2 /></Button>
					</div>
				{/each}
			{:else}
				<p class="text-sm italic">Whitelist not fetched or empty.</p>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
