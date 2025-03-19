<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select/index.js";
	import { Gamepad2, Upload, Loader2, Image as ImageIcon, Video, X, AlertCircle } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { toast } from "svelte-sonner";
	import { createUploader } from "$lib/utils/uploadthing.js";
	import { UploadDropzone } from "@uploadthing/svelte";
	import { formatDomain } from "$lib/utils/formatDomain";

	let dialogOpen = $state(false);
	let isCreating = $state(false);
	let isDeleting = $state(false);

	// Form data
	let name = $state("");
	let ownerEmail = $state("");
	let category = $state("");
	let description = $state("");
	let domain = $state("");

	let logoUrl = $state("");
	let coverImageUrl = $state("");
	let coverVideoUrl = $state("");

	let logoKey = $state("");
	let coverImageKey = $state("");
	let coverVideoKey = $state("");

	// Create uploaders for each file type with added validation
	const logoUploader = createUploader("logoUploader", {
		url: `${$BASE_API_URL}/uploads/uploadthing`,
		allowedContent: "",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("bearer")}`,
		},
		onClientUploadComplete: (res) => {
			logoUrl = res[0].ufsUrl;
			logoKey = res[0].key;
			toast.success("Logo uploaded successfully!");
		},
		onUploadError: (error) => {
			toast.error(`Error uploading logo: ${error.message}`);
		},
	});

	const coverImageUploader = createUploader("coverImageUploader", {
		url: `${$BASE_API_URL}/uploads/uploadthing`,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("bearer")}`,
		},
		onClientUploadComplete: (res) => {
			coverImageUrl = res[0].ufsUrl;
			coverImageKey = res[0].key;
			toast.success("Cover image uploaded successfully!");
		},
		onUploadError: (error) => {
			toast.error(`Error uploading cover image: ${error.message}`);
		},
	});

	const coverVideoUploader = createUploader("coverVideoUploader", {
		url: `${$BASE_API_URL}/uploads/uploadthing`,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("bearer")}`,
		},
		onClientUploadComplete: (res) => {
			coverVideoUrl = res[0].ufsUrl;
			coverVideoKey = res[0].key;
			toast.success("Cover video uploaded successfully!");
		},
		onUploadError: (error) => {
			toast.error(`Error uploading cover video: ${error.message}`);
		},
	});

	// Game categories
	const categories = ["Action", "Adventure", "Driving", "Casual", "RPG", "Strategy", "Sports", "Quiz"];

	async function createGame() {
		if (!name || !category || !description || !domain || !ownerEmail) {
			toast.error("Please fill in all required fields.");
			return;
		}

		isCreating = true;
		const formattedDomain = formatDomain(domain);
		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/game`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					name,
					ownerEmail,
					category,
					description,
					domain: formattedDomain,
					logoUrl,
					coverImageUrl,
					coverVideoUrl,
				}),
			});

			await response.json();
			toast.success("Game created successfully!");
			dialogOpen = false;
			resetForm();
		} catch (error) {
			toast.error("Failed to create game: " + error);
		} finally {
			isCreating = false;
		}
	}

	function resetForm() {
		name = "";
		ownerEmail = "";
		category = "";
		description = "";
		domain = "";
		logoUrl = "";
		coverImageUrl = "";
		coverVideoUrl = "";
		logoKey = "";
		coverImageKey = "";
		coverVideoKey = "";
	}

	async function resetFile(type) {
		const fileKey = type === "logo" ? logoKey : type === "cover" ? coverImageKey : coverVideoKey;

		if (!fileKey) return;

		isDeleting = true;
		try {
			// Call server endpoint to delete the file
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/uploads/utapi/delete-file`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					fileKey: fileKey,
				}),
			});

			const result = await response.json();

			if (result.success) {
				if (type === "logo") {
					logoUrl = "";
					logoKey = "";
				} else if (type === "cover") {
					coverImageUrl = "";
					coverImageKey = "";
				} else if (type === "video") {
					coverVideoUrl = "";
					coverVideoKey = "";
				}
				toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
			} else {
				throw new Error(result.error || "Failed to delete file.");
			}
		} catch (error) {
			toast.error(`Failed to delete file: ${error.message}`);
		} finally {
			isDeleting = false;
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		Add Game <Gamepad2 class="ml-2" />
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[75dvh] max-w-2xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Add game</Dialog.Title>
			<Dialog.Description>Add a new game to the platform.</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label for="name">Game Name</Label>
					<Input id="name" bind:value={name} placeholder="My Awesome Game" />
				</div>

				<div class="grid gap-2">
					<Label for="owner">Owner Email</Label>
					<Input id="owner" bind:value={ownerEmail} placeholder="owner@example.com" type="email" />
				</div>
			</div>

			<div class="grid gap-2">
				<Label for="category">Category</Label>
				<Select type="single" bind:value={category}>
					<SelectTrigger>
						<span>{category || "Select a category"}</span>
					</SelectTrigger>
					<SelectContent>
						{#each categories as cat}
							<SelectItem value={cat}>{cat}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>

			<div class="grid gap-2">
				<Label for="domain">Domain</Label>
				<Input id="domain" bind:value={domain} placeholder="my-game.com" />
			</div>

			<div class="grid gap-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="Describe your game (max 300 characters)"
					maxlength="300"
				/>
				<p class="text-sm text-gray-500">{description.length}/300</p>
			</div>

			<div class="grid gap-4">
				<Label>Media Files</Label>

				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<Label class="text-sm">Logo (500x500, JPEG, max. 100KB)</Label>
						{#if logoUrl}
							<Button variant="ghost" size="sm" onclick={() => resetFile("logo")} disabled={isDeleting}>
								<X class="h-4 w-4" />
							</Button>
						{/if}
					</div>
					{#if !logoUrl}
						<!-- For logo -->
						<UploadDropzone uploader={logoUploader}>
							<ImageIcon slot="upload-icon" class="mt-4 h-6 w-6" />
							<span slot="label">Drop or click to upload logo</span>
						</UploadDropzone>
					{:else}
						<div class="flex items-center gap-2 rounded border p-2">
							<img src={logoUrl} alt="Logo preview" class="h-10 w-10 rounded object-cover" />
							<span class="truncate text-sm">{logoUrl}</span>
						</div>
					{/if}
				</div>

				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<Label class="text-sm">Cover Image (800x1200, JPEG, max. 250KB)</Label>
						{#if coverImageUrl}
							<Button variant="ghost" size="sm" onclick={() => resetFile("cover")} disabled={isDeleting}>
								<X class="h-4 w-4" />
							</Button>
						{/if}
					</div>
					{#if !coverImageUrl}
						<!-- For cover image -->
						<UploadDropzone uploader={coverImageUploader}>
							<ImageIcon slot="upload-icon" class="mt-4 h-6 w-6" />
							<span slot="label">Drop or click to upload cover image</span>
						</UploadDropzone>
					{:else}
						<div class="flex items-center gap-2 rounded border p-2">
							<img src={coverImageUrl} alt="Cover preview" class="h-10 w-10 rounded object-cover" />
							<span class="truncate text-sm">{coverImageUrl}</span>
						</div>
					{/if}
				</div>

				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<Label class="text-sm">Cover Video (MP4, 2:3 aspect ratio, max. 3MB)</Label>
						{#if coverVideoUrl}
							<Button variant="ghost" size="sm" onclick={() => resetFile("video")} disabled={isDeleting}>
								<X class="h-4 w-4" />
							</Button>
						{/if}
					</div>
					{#if !coverVideoUrl}
						<!-- For video -->
						<UploadDropzone uploader={coverVideoUploader}>
							<Video slot="upload-icon" class="mt-4 h-6 w-6" />
							<span slot="label">Drop or click to upload cover video</span>
						</UploadDropzone>
					{:else}
						<div class="flex items-center gap-2 rounded border p-2">
							<span class="truncate text-sm">{coverVideoUrl}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button
				onclick={createGame}
				disabled={isCreating ||
					!name ||
					!category ||
					!description ||
					!domain ||
					!ownerEmail ||
					!logoUrl ||
					!coverImageUrl ||
					!coverVideoUrl}
			>
				{#if isCreating}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Creating...
				{:else}
					<Upload class="mr-2 h-4 w-4" />
					Add Game
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	:global([data-ut-element="allowed-content"]) {
		display: none;
	}
</style>
