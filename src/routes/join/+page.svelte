<script>
	import { blur } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
	import { toast } from "svelte-sonner";
	import { BASE_API_URL } from "$lib/stores/configStore";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Loader2, Rocket } from "lucide-svelte";
	import { enhance } from "$app/forms";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { goto } from "$app/navigation";

	let isSubmitting = $state(false);
	let formData = $state({
		email: "",
		website: "",
		message: "",
	});

	// Basic form validation
	let isValid = $derived(formData.email && formData.website && formData.message);

	// Form submission handler
	async function handleSubmit(event) {
		if (!isValid) return;
		event.preventDefault();
		isSubmitting = true;

		try {
			const response = await fetchWithErrorHandling(`${$BASE_API_URL}/contact/submit`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					email: formData?.email,
					message: formData?.message,
					website: formData?.website,
				}),
			});
		} catch (error) {
			toast.error("Failed to submit form: " + error);
		}
		toast.error("Thanks for your submission! We'll get back to you shortly!");
		isSubmitting = false;
		goto("/");
	}
</script>

<svelte:head>
	<title>Join Playlight</title>
</svelte:head>

<main class="flex min-h-screen w-full items-center justify-center px-4 py-16">
	<div in:blur={{ duration: 400 }} class="w-full max-w-xl">
		<Card class="border-2">
			<CardHeader>
				<CardTitle class="text-3xl font-bold uppercase">Join Playlight.</CardTitle>
				<CardDescription>
					Take the first step towards better game discovery. Fill out the form below and we'll get back to you shortly.
				</CardDescription>
			</CardHeader>

			<form onsubmit={handleSubmit}>
				<CardContent class="space-y-6">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input type="email" id="email" placeholder="you@yourstudio.com" bind:value={formData.email} required />
					</div>

					<div class="space-y-2">
						<Label for="website">Website</Label>
						<Input type="url" id="website" placeholder="https://yourgame.com" bind:value={formData.website} required />
					</div>

					<div class="space-y-2">
						<Label for="message">Tell us about your game</Label>
						<Textarea
							id="message"
							placeholder="What makes your browser game special?"
							class="min-h-[120px]"
							bind:value={formData.message}
							required
						/>
					</div>
				</CardContent>

				<CardFooter>
					<Button type="submit" class="w-full" disabled={!isValid || isSubmitting} style="cursor: pointer">
						{#if isSubmitting}
							<Loader2 class="mr-2 animate-spin" />
							Sending...
						{:else}
							Join<Rocket />
						{/if}
					</Button>
				</CardFooter>
			</form>
		</Card>

		<p class="text-muted-foreground mt-4 text-center text-sm">
			By submitting this form, you agree to our Terms and Privacy Policy.
		</p>
	</div>
</main>
