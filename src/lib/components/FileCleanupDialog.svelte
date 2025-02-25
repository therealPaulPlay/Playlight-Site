<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { FileX } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import DialogFooter from "./ui/dialog/dialog-footer.svelte";

	let dialogOpen = $state(false);

	async function mediaCleanup() {
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/uploads/utapi/cleanup-files`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
				}),
			});
			const data = await response.json();
			toast.success(data?.message);
		} catch (error) {
			toast.error("Failed to clean media: " + error);
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>UT Cleanup<FileX /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Remove unused media</Dialog.Title>
			<Dialog.Description>This checks through all games and removes unused files on Uploadthing.</Dialog.Description>
		</Dialog.Header>
		<DialogFooter>
			<Button onclick={mediaCleanup}>Start cleanup</Button>
		</DialogFooter>
	</Dialog.Content>
</Dialog.Root>
