<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Trash2, Settings, LogOut } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { signOut } from "$lib/utils/checkAuthentication";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { toast } from "svelte-sonner";

	let dialogOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let password = $state();

	async function deleteAccount() {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/account/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					password,
				}),
			});
			toast.success("Account deleted.");
			signOut();
			goto("/");
		} catch (error) {
			toast.error("Failed to delete account: " + error);
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "ghost" })}><Settings /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Account settings</Dialog.Title>
			<Dialog.Description>Manage your account.</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-wrap items-center gap-2">
			<Button
				variant="outline"
				onclick={async () => {
					signOut();
					toast.info("Signed out.");
					goto("/");
				}}>Sign out<LogOut /></Button
			>
			<Button
				variant="destructive"
				onclick={() => {
					deleteDialogOpen = true;
				}}>Delete Account<Trash2 /></Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete account?</Dialog.Title>
			<Dialog.Description>Are you sure that you want to delete your account?</Dialog.Description>
		</Dialog.Header>
		<Label for="password" class="-mt-2">Password</Label>
		<Input class="w-full" id="password" type="password" placeholder="password" bind:value={password} />
		<Dialog.Footer>
			<Button
				variant="destructive"
				onclick={async () => {
					await deleteAccount();
				}}
				>Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
