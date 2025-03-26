<script>
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select/index.js";
	import { Gamepad2, Upload, Loader2, Image as ImageIcon, Video, X, AlertCircle, Settings2 } from "lucide-svelte";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { toast } from "svelte-sonner";
	import { createUploader } from "$lib/utils/uploadthing.js";
	import { UploadDropzone } from "@uploadthing/svelte";
	import { formatDomain } from "$lib/utils/formatDomain";

	let { updateOnly = false, selectedGame = $bindable({}) } = $props();

	let dialogOpen = $state(false);
	let isLoading = $state(false);
	let isDeleting = $state(false);

	// Form data
	let name = $state("");
	let ownerEmail = $state("");
	let category = $state("");
	let description = $state("");
	let domain = $state("");

	// Upload file urls
	let logoUrl = $state("");
	let coverImageUrl = $state("");
	let coverVideoUrl = $state("");

	// Update only
	let passwordInput = $state();
	let noteRead = $state(false);

	// Create uploaders for each file type with added validation
	const logoUploader = createUploader("logoUploader", {
		url: `${$BASE_API_URL}/uploads/uploadthing`,
		allowedContent: "",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("bearer")}`,
		},
		onClientUploadComplete: (res) => {
			logoUrl = res[0].ufsUrl;
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
			toast.success("Cover video uploaded successfully!");
		},
		onUploadError: (error) => {
			toast.error(`Error uploading cover video: ${error.message}`);
		},
	});

	function extractKeyFromUrl(url) {
		const parts = url.split("/");
		return parts[parts.length - 1]; // Get the last part after the final slash
	}

	// Game categories
	const categories = ["Action", "Adventure", "Driving", "Casual", "RPG", "Strategy", "Sports", "Quiz"];

	async function createGame() {
		isLoading = true;
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
			isLoading = false;
		}
	}

	async function updateGame() {
		try {
			isLoading = true;
			const formattedDomain = formatDomain(domain);
			await fetchWithErrorHandling(`${$BASE_API_URL}/game/${selectedGame.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
				},
				body: JSON.stringify({
					id: localStorage.getItem("id"),
					password: passwordInput,
					name,
					category,
					description,
					domain: formattedDomain,
					logoUrl,
					coverImageUrl,
					coverVideoUrl,
				}),
			});
			// Update current game for UI
			selectedGame.description = description;
			selectedGame.domain = formattedDomain;
			selectedGame.logo_url = logoUrl;
			selectedGame.cover_image_url = coverImageUrl;
			selectedGame.cover_video_url = coverVideoUrl;
			toast.success("Game updated successfully!");
		} catch (error) {
			toast.error("Failed to update game: " + error);
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		name = selectedGame.name || "";
		ownerEmail = "";
		category = selectedGame.category || "";
		description = selectedGame.description || "";
		domain = selectedGame.domain || "";
		logoUrl = selectedGame.logo_url || "";
		coverImageUrl = selectedGame.cover_image_url || "";
		coverVideoUrl = selectedGame.cover_video_url || "";
		passwordInput = "";
	}

	$effect(() => {
		if (dialogOpen && updateOnly) resetForm();
	});

	async function resetFile(type) {
		const fileUrl = type === "logo" ? logoUrl : type === "cover" ? coverImageUrl : coverVideoUrl;
		if (!fileUrl) return;

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
					fileKey: extractKeyFromUrl(fileUrl),
				}),
			});

			const result = await response.json();

			if (result.success) {
				if (type === "logo") {
					logoUrl = "";
				} else if (type === "cover") {
					coverImageUrl = "";
				} else if (type === "video") {
					coverVideoUrl = "";
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
		{#if !updateOnly}
			Add Game <Gamepad2 class="ml-2" />
		{:else}
			Update <Settings2 class="ml-2" />
		{/if}
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[75dvh] max-w-2xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>{updateOnly ? "Update game" : "Add game"}</Dialog.Title>
			<Dialog.Description
				>{updateOnly
					? "Update an existing game on the platform."
					: "Add a new game to the platform."}</Dialog.Description
			>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2" class:disabled={updateOnly}>
					<Label for="name">Name</Label>
					<Input id="name" bind:value={name} placeholder="My Awesome Game" disabled={updateOnly} />
				</div>

				<div class="grid gap-2" class:disabled={updateOnly}>
					<Label for="owner">Owner email</Label>
					<Input
						id="owner"
						bind:value={ownerEmail}
						placeholder={updateOnly ? "(not required)" : "owner@example.com"}
						type="email"
						disabled={updateOnly}
					/>
				</div>
			</div>

			<div class="grid gap-2" class:disabled={updateOnly}>
				<Label for="category">Category</Label>
				<Select type="single" bind:value={category} disabled={updateOnly}>
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

			{#if updateOnly}
				<div class="mt-4 space-y-3">
					<div class="border border-yellow-500/20 bg-yellow-500/10 p-4">
						<h4 class="mb-1 text-sm font-medium">Note</h4>
						<p class="text-muted-foreground text-sm">
							Clicking on "X" removes the media from production immediately. Only do this with the intent of swiftly
							replacing it. Your assets should meet the format & size requirements – contact an admin if you are unsure.
						</p>
						<div class="mt-4 flex flex-wrap items-center">
							<Checkbox id="note" bind:checked={noteRead} aria-labelledby="note-label" />
							<Label for="note" class="ml-2 text-sm">I understand</Label>
						</div>
					</div>
				</div>
			{/if}
			<div class="grid gap-2 {updateOnly ? 'mt-1' : 'mt-4'}">
				<div class="flex items-center justify-between">
					<Label class="text-sm">Logo (500x500, JPEG, max. 75KB)</Label>
					{#if logoUrl}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => resetFile("logo")}
							disabled={isDeleting || (updateOnly && !noteRead)}
						>
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
					<div class="flex items-center gap-2 border p-2">
						<img src={logoUrl} alt="Logo preview" class="h-10 w-10 overflow-hidden object-cover" />
						<span class="truncate text-sm">{logoUrl}</span>
					</div>
				{/if}
			</div>

			<div class="grid gap-2">
				<div class="flex items-center justify-between">
					<Label class="text-sm">Cover Image (800x1200, JPEG, max. 150KB)</Label>
					{#if coverImageUrl}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => resetFile("cover")}
							disabled={isDeleting || (updateOnly && !noteRead)}
						>
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
					<div class="flex items-center gap-2 border p-2">
						<img src={coverImageUrl} alt="Cover preview" class="h-10 w-10 overflow-hidden object-cover" />
						<span class="truncate text-sm">{coverImageUrl}</span>
					</div>
				{/if}
			</div>

			<div class="grid gap-2">
				<div class="flex items-center justify-between">
					<Label class="text-sm">Cover Video (MP4, 2:3 aspect ratio, max. 3MB)</Label>
					{#if coverVideoUrl}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => resetFile("video")}
							disabled={isDeleting || (updateOnly && !noteRead)}
						>
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
					<div class="flex items-center gap-2 border p-2">
						<span class="truncate text-sm">{coverVideoUrl}</span>
					</div>
				{/if}
			</div>
		</div>

		{#if updateOnly}
			<Label for="password" class="-mb-2">Password</Label>
			<Input type="password" placeholder="e.g. my-password-123" id="password" bind:value={passwordInput} />
		{/if}

		<Dialog.Footer>
			<Button
				onclick={() => {
					updateOnly ? updateGame() : createGame();
				}}
				disabled={isLoading ||
					!name ||
					!category ||
					!description ||
					!domain ||
					(!updateOnly && !ownerEmail) ||
					!logoUrl ||
					!coverImageUrl ||
					!coverVideoUrl ||
					(updateOnly && !passwordInput)}
			>
				{#if isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Loading...
				{:else}
					<Upload class="mr-2 h-4 w-4" />
					{updateOnly ? "Update" : "Add Game"}
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	:global([data-ut-element="allowed-content"]) {
		display: none;
	}

	.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
